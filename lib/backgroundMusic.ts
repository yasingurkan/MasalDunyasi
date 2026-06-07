"use client";

// ── Uyku getiren fon müziği — Web Audio API ile sentezlenir ───────────────────
//
// Harici dosya / telif YOK: müzik tamamen kod ile, gerçek zamanlı üretilir.
// Yumuşak bir akor "pad"i (yavaşça nefes alır) + müzik kutusu tarzı, pentatonik
// dizinden seçilen seyrek çıngırak notaları → sakin, huzurlu, sonsuz ve tekrarsız.
// Pentatonik dizi (Do majör: C D E G A) sayesinde rastgele notalar hep uyumludur.

export interface BackgroundMusicController {
  /** Müziği baştan başlat (yumuşak fade-in ile) */
  play: () => void;
  /** Duraklat */
  pause: () => void;
  /** Duraklamadan devam et */
  resume: () => void;
  /** Durdur (fade-out ile) */
  stop: () => void;
  /** Hedef ses seviyesini ayarla (0–1) */
  setVolume: (v: number) => void;
}

const DEFAULT_VOLUME = 0.3; // fon — duyulur ama okumanın önüne geçmez
const FADE_S = 1.4;

// Do majör pentatonik, müzik kutusu oktavlarında (Hz). Çıngırak notaları buradan seçilir.
const SCALE_HZ = [
  261.63, 293.66, 329.63, 392.0, 440.0, // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.0, // C5 D5 E5 G5 A5
];

// Pad akoru — düşük, sıcak (C3 · G3 · E4)
const PAD_HZ = [130.81, 196.0, 329.63];

type Maybe<T> = T | null;

export function createBackgroundMusic(): BackgroundMusicController {
  let ctx: Maybe<AudioContext> = null;
  let master: Maybe<GainNode> = null;
  let noteTimer: Maybe<ReturnType<typeof setInterval>> = null;
  let targetVolume = DEFAULT_VOLUME;
  let initialized = false;
  let disabled = false;

  function ensureGraph(): boolean {
    if (disabled) return false;
    if (initialized) return true;
    if (typeof window === "undefined") return false;

    const AC: typeof AudioContext | undefined =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) {
      disabled = true;
      return false;
    }

    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0; // fade-in ile yükselecek
    master.connect(ctx.destination);

    // ── Pad: yumuşak akor, lowpass'tan geçer, hafifçe "nefes alır" ──
    const padBus = ctx.createGain();
    padBus.gain.value = 0.5;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 700;
    padBus.connect(lowpass);
    lowpass.connect(master);

    PAD_HZ.forEach((f, i) => {
      const osc = ctx!.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      osc.detune.value = (i - 1) * 5; // hafif chorus
      const g = ctx!.createGain();
      g.gain.value = 0.16;
      osc.connect(g);
      g.connect(padBus);
      osc.start();
    });

    // Nefes: çok yavaş LFO pad seviyesini dalgalandırır
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.14;
    lfo.connect(lfoGain);
    lfoGain.connect(padBus.gain);
    lfo.start();

    initialized = true;
    return true;
  }

  // Müzik kutusu tarzı tek çıngırak notası
  function pluck() {
    if (!ctx || !master) return;
    const f = SCALE_HZ[Math.floor(Math.random() * SCALE_HZ.length)];
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = f;

    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.13, t + 0.015); // hızlı attack
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6); // yavaş çınlama

    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 2.8);
  }

  function startNotes() {
    stopNotes();
    // ~2 sn'de bir, bazen sus (daha doğal, seyrek ninni dokunuşu)
    noteTimer = setInterval(() => {
      if (Math.random() < 0.75) pluck();
    }, 2000);
  }

  function stopNotes() {
    if (noteTimer) {
      clearInterval(noteTimer);
      noteTimer = null;
    }
  }

  function fadeTo(v: number) {
    if (!ctx || !master) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(v, t + FADE_S);
  }

  return {
    play() {
      if (!ensureGraph() || !ctx) return;
      ctx.resume().catch(() => {});
      fadeTo(targetVolume);
      startNotes();
    },

    pause() {
      stopNotes();
      fadeTo(0);
      // kısa fade sonrası bağlamı askıya al (zamanlayıcılar/ses donar)
      const c = ctx;
      setTimeout(() => c?.suspend().catch(() => {}), FADE_S * 1000 + 50);
    },

    resume() {
      if (!ctx) return;
      ctx.resume().catch(() => {});
      fadeTo(targetVolume);
      startNotes();
    },

    stop() {
      stopNotes();
      fadeTo(0);
      const c = ctx;
      setTimeout(() => c?.suspend().catch(() => {}), FADE_S * 1000 + 50);
    },

    setVolume(v: number) {
      targetVolume = Math.min(1, Math.max(0, v));
      if (initialized && ctx && ctx.state === "running") fadeTo(targetVolume);
    },
  };
}
