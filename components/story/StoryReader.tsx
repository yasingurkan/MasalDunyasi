"use client";

import { useState } from "react";
import AudioPlayer from "@/components/story/AudioPlayer";
import HighlightedText from "@/components/story/HighlightedText";

interface StoryReaderProps {
  content: string;
}

export default function StoryReader({ content }: StoryReaderProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);

  return (
    <div className="flex flex-col gap-6">
      {/* Audio player controls */}
      <AudioPlayer text={content} onSentenceChange={setCurrentSentenceIndex} />

      {/* Story text with live sentence highlighting */}
      <HighlightedText content={content} currentSentenceIndex={currentSentenceIndex} />
    </div>
  );
}
