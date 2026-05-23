"use client";

import { splitIntoSentences } from "./utils";

export interface SpeechController {
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

// ── Ses desteği kontrolü ──────────────────────────────────────────────────────

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

// ── Paragraf yapısı ───────────────────────────────────────────────────────────

interface Paragraph {
  text: string;
  sentences: string[];
  /** Bu paragrafın ilk cümlesinin global index'i */
  startIndex: number;
}

function buildParagraphs(text: string): Paragraph[] {
  const rawParagraphs = text.split(/\n\n+/);
  const paragraphs: Paragraph[] = [];
  let globalIndex = 0;

  for (const raw of rawParagraphs) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const sentences = splitIntoSentences(trimmed);
    if (sentences.length === 0) continue;

    paragraphs.push({
      text: trimmed,
      sentences,
      startIndex: globalIndex,
    });

    globalIndex += sentences.length;
  }

  return paragraphs;
}

// ── Ses yükleyici ─────────────────────────────────────────────────────────────

function buildUrl(paragraphText: string): string {
  return `/api/tts?text=${encodeURIComponent(paragraphText)}`;
}

function loadAudio(paragraphText: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(buildUrl(paragraphText));
    audio.preload = "auto";

    const onReady = () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onError);
      resolve(audio);
    };
    const onError = () => {
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("error", onError);
      reject(new Error("Ses yüklenemedi"));
    };

    audio.addEventListener("canplaythrough", onReady, { once: true });
    audio.addEventListener("error", onError, { once: true });
    audio.load();
  });
}

// ── Edge TTS (tr-TR-EmelNeural) — paragraf bazlı konuşma kontrolcüsü ─────────
//
// Algoritma:
//  1. Metin paragraflara bölünür (\n\n ile)
//  2. Her paragraf tek seferde /api/tts'e gönderilir → SSML prosody ile doğal tonlama
//  3. Paragraf çalarken cümle sayısına göre setTimeout'lar kurulur (vurgulama)
//  4. Bir paragraf çalarken sonraki arka planda prefetch edilir
//  5. pause/resume mevcut HTMLAudioElement üzerinde çalışır

export function createSpeechController(
  text: string,
  onSentenceChange: (index: number) => void,
  onEnd: () => void
): SpeechController {
  const paragraphs = buildParagraphs(text);

  let stopped = false;
  let paused = false;
  let currentParagraphIndex = 0;
  let currentAudio: HTMLAudioElement | null = null;
  const timers: ReturnType<typeof setTimeout>[] = [];

  // ── Timer yönetimi ──────────────────────────────────────────────────────────

  function clearAllTimers(): void {
    for (const t of timers) clearTimeout(t);
    timers.length = 0;
  }

  // ── Cümle vurgulama — paragraf başladıktan sonra audio süresi belli olunca kur

  function scheduleSentenceHighlights(
    audio: HTMLAudioElement,
    paragraph: Paragraph
  ): void {
    const setup = () => {
      const audioDurationMs = audio.duration * 1000;
      const sentenceCount = paragraph.sentences.length;

      // Her cümle için tahmini gecikme: paragraf süresini eşit böl
      paragraph.sentences.forEach((_, si) => {
        const delay = (si / sentenceCount) * audioDurationMs;
        const globalIdx = paragraph.startIndex + si;
        const timer = setTimeout(() => {
          if (!stopped && !paused) {
            onSentenceChange(globalIdx);
          }
        }, delay);
        timers.push(timer);
      });
    };

    // duration bazen loadedmetadata'da, bazen canplaythrough'da hazır olur
    if (audio.duration && isFinite(audio.duration)) {
      setup();
    } else {
      audio.addEventListener("loadedmetadata", setup, { once: true });
    }
  }

  // ── Tek paragrafı oynat, bitince callback çağır ─────────────────────────────

  async function playParagraph(
    audio: HTMLAudioElement,
    paragraph: Paragraph
  ): Promise<void> {
    currentAudio = audio;

    // İlk cümleyi hemen vurgula
    onSentenceChange(paragraph.startIndex);

    // Diğer cümleler için zamanlanmış vurgular kur
    scheduleSentenceHighlights(audio, paragraph);

    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("Çalma hatası"));
      audio.play().catch(reject);
    });
  }

  // ── Paragrafları sırayla oynat ──────────────────────────────────────────────

  async function speakFrom(paragraphIdx: number): Promise<void> {
    if (stopped || paused) return;
    if (paragraphIdx >= paragraphs.length) {
      if (!stopped && !paused) onEnd();
      return;
    }

    currentParagraphIndex = paragraphIdx;
    const paragraph = paragraphs[paragraphIdx];

    // Mevcut paragrafı yükle
    let audio: HTMLAudioElement;
    try {
      audio = await loadAudio(paragraph.text);
    } catch {
      // Yükleme başarısız — sonraki paragrafa geç
      if (!stopped && !paused) await speakFrom(paragraphIdx + 1);
      return;
    }

    if (stopped || paused) return;

    // Sonraki paragrafı arka planda prefetch et
    const nextIdx = paragraphIdx + 1;
    let nextAudio: HTMLAudioElement | null = null;
    if (nextIdx < paragraphs.length) {
      loadAudio(paragraphs[nextIdx].text)
        .then((a) => { nextAudio = a; })
        .catch(() => {});
    }

    // Mevcut paragrafı çal
    try {
      await playParagraph(audio, paragraph);
    } catch {
      // Hata olursa devam et
    }

    clearAllTimers();

    if (stopped || paused) return;

    // Sonraki paragrafa geç (prefetch hazırsa kullan)
    if (nextIdx < paragraphs.length) {
      if (nextAudio) {
        // Prefetch hazır
        currentParagraphIndex = nextIdx;
        const nextParagraph = paragraphs[nextIdx];

        // Sonraki-sonraki paragrafı prefetch et
        const afterNext = nextIdx + 1;
        if (afterNext < paragraphs.length) {
          loadAudio(paragraphs[afterNext].text)
            .then((a) => { nextAudio = a; })
            .catch(() => {});
        }

        try {
          await playParagraph(nextAudio, nextParagraph);
        } catch { /* devam et */ }

        clearAllTimers();
        if (!stopped && !paused) await speakFrom(nextIdx + 1);
      } else {
        if (!stopped && !paused) await speakFrom(nextIdx);
      }
    }
  }

  // ── Kontrolcü API'si ────────────────────────────────────────────────────────

  return {
    play() {
      stopped = false;
      paused = false;
      clearAllTimers();
      currentAudio?.pause();
      currentAudio = null;
      speakFrom(0).catch(console.error);
    },

    pause() {
      paused = true;
      clearAllTimers();
      currentAudio?.pause();
    },

    resume() {
      paused = false;
      if (currentAudio && currentAudio.paused) {
        // Mevcut paragrafta kaldığı yerden devam et
        // Vurgulama için kalan süreyi yeniden hesapla
        const paragraph = paragraphs[currentParagraphIndex];
        if (paragraph) {
          const remainingMs =
            (currentAudio.duration - currentAudio.currentTime) * 1000;
          const totalMs = currentAudio.duration * 1000;
          const elapsed = currentAudio.currentTime * 1000;

          // Henüz çalınmamış cümleleri tekrar zamanla
          paragraph.sentences.forEach((_, si) => {
            const absoluteDelay = (si / paragraph.sentences.length) * totalMs;
            if (absoluteDelay > elapsed) {
              const relativeDelay = absoluteDelay - elapsed;
              const globalIdx = paragraph.startIndex + si;
              const timer = setTimeout(() => {
                if (!stopped && !paused) onSentenceChange(globalIdx);
              }, relativeDelay);
              timers.push(timer);
            }
          });

          void remainingMs; // kullanılmıyor, sadece açıklayıcı
        }

        currentAudio.play().catch(() => {
          // Ses sıfırlandıysa mevcut paragraftan yeniden başla
          speakFrom(currentParagraphIndex).catch(console.error);
        });
      } else {
        speakFrom(currentParagraphIndex).catch(console.error);
      }
    },

    stop() {
      stopped = true;
      paused = false;
      clearAllTimers();
      currentAudio?.pause();
      currentAudio = null;
      onSentenceChange(-1);
    },
  };
}
