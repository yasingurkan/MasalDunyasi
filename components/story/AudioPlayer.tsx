"use client";

import { useEffect, useRef, useState } from "react";
import { createSpeechController, isSpeechSupported } from "@/lib/speech";
import { splitIntoSentences } from "@/lib/utils";
import type { SpeechController } from "@/lib/speech";

type AudioState = "idle" | "loading" | "playing" | "paused";

interface AudioPlayerProps {
  text: string;
  onSentenceChange: (index: number) => void;
}

export default function AudioPlayer({ text, onSentenceChange }: AudioPlayerProps) {
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [supported, setSupported] = useState<boolean>(true);
  const controllerRef = useRef<SpeechController | null>(null);

  // Total sentence count – computed once from the text prop
  const totalSentences = splitIntoSentences(text).length;

  // Check speech support only on the client
  useEffect(() => {
    setSupported(isSpeechSupported());
  }, []);

  // Cleanup on unmount: stop any ongoing speech
  useEffect(() => {
    return () => {
      controllerRef.current?.stop();
    };
  }, []);

  // Recreate the controller whenever `text` changes so sentence callbacks are fresh
  useEffect(() => {
    // If speech was in progress, stop it cleanly before discarding the old controller
    if (audioState !== "idle") {
      controllerRef.current?.stop();
      setAudioState("idle");
      setCurrentIndex(-1);
    }
    // We intentionally omit `audioState` from the dep array to avoid a loop;
    // the intent is only to react to `text` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  function getOrCreateController(): SpeechController {
    const controller = createSpeechController(
      text,
      (idx) => {
        // İlk cümle başladığında "loading" → "playing"
        if (idx >= 0) setAudioState("playing");
        setCurrentIndex(idx);
        onSentenceChange(idx);
      },
      () => {
        setAudioState("idle");
        setCurrentIndex(-1);
        onSentenceChange(-1);
      }
    );
    controllerRef.current = controller;
    return controller;
  }

  function handlePlay() {
    const controller = getOrCreateController();
    controller.play();
    setAudioState("loading"); // ilk ses yüklenene kadar
  }

  function handlePause() {
    controllerRef.current?.pause();
    setAudioState("paused");
  }

  function handleResume() {
    controllerRef.current?.resume();
    setAudioState("playing");
  }

  function handleStop() {
    controllerRef.current?.stop();
    setAudioState("idle");
    setCurrentIndex(-1);
    onSentenceChange(-1);
  }

  // Progress: percentage of sentences completed (0–100)
  const progressPercent =
    totalSentences > 0 && currentIndex >= 0
      ? Math.round(((currentIndex + 1) / totalSentences) * 100)
      : 0;

  if (!supported) {
    return (
      <div className="rounded-2xl border border-purple-900/50 bg-gradient-to-br from-[#231545] to-[#0F0A1E] p-5 text-center">
        <p className="text-sm text-purple-300">
          Tarayıcınız sesli okuma özelliğini desteklemiyor.
          Sesli okuma için Chrome veya Edge kullanmanızı öneririz.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-800/40 bg-gradient-to-br from-[#231545] to-[#0F0A1E] p-5 shadow-lg">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-purple-300">
          <span aria-hidden="true">🔊</span>
          Türkçe
        </span>

        {audioState !== "idle" && (
          <span className="text-xs text-purple-400">
            {currentIndex >= 0 ? currentIndex + 1 : 0} / {totalSentences} cümle
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {audioState === "idle" && (
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 rounded-xl bg-[#F59E0B] px-6 py-2.5 text-sm font-bold text-[#6B21A8] shadow-md transition-all duration-200 hover:bg-[#FCD34D] hover:shadow-[#F59E0B]/40 hover:shadow-lg active:scale-95"
          >
            <span aria-hidden="true">▶</span>
            Sesli Oku
          </button>
        )}

        {audioState === "loading" && (
          <button
            disabled
            className="flex items-center gap-2 rounded-xl bg-[#F59E0B]/60 px-6 py-2.5 text-sm font-bold text-[#6B21A8] shadow-md cursor-wait"
          >
            <span className="inline-block w-4 h-4 border-2 border-[#6B21A8]/40 border-t-[#6B21A8] rounded-full animate-spin" aria-hidden="true" />
            Hazırlanıyor…
          </button>
        )}

        {audioState === "playing" && (
          <>
            <button
              onClick={handlePause}
              className="flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-[#6B21A8] shadow-md transition-all duration-200 hover:bg-[#FCD34D] hover:shadow-[#F59E0B]/40 hover:shadow-lg active:scale-95"
            >
              <span aria-hidden="true">⏸</span>
              Duraklat
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-red-700/40 hover:shadow-lg active:scale-95"
            >
              <span aria-hidden="true">⏹</span>
              Durdur
            </button>
          </>
        )}

        {audioState === "paused" && (
          <>
            <button
              onClick={handleResume}
              className="flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-[#6B21A8] shadow-md transition-all duration-200 hover:bg-[#FCD34D] hover:shadow-[#F59E0B]/40 hover:shadow-lg active:scale-95"
            >
              <span aria-hidden="true">▶</span>
              Devam Et
            </button>
            <button
              onClick={handleStop}
              className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-red-700/40 hover:shadow-lg active:scale-95"
            >
              <span aria-hidden="true">⏹</span>
              Durdur
            </button>
          </>
        )}
      </div>

      {/* Progress bar – only visible when not idle */}
      {audioState !== "idle" && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-purple-400">
            <span>İlerleme</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-purple-950">
            <div
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Okuma ilerlemesi"
              className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
