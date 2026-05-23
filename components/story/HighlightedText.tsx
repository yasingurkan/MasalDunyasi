"use client";

import { useEffect, useRef } from "react";
import { splitIntoSentences } from "@/lib/utils";

interface HighlightedTextProps {
  content: string;
  currentSentenceIndex: number;
}

export default function HighlightedText({
  content,
  currentSentenceIndex,
}: HighlightedTextProps) {
  const sentences = splitIntoSentences(content);

  // Keep refs to every sentence span so we can scroll the active one into view
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (currentSentenceIndex < 0) return;
    const el = sentenceRefs.current[currentSentenceIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentSentenceIndex]);

  // Group consecutive sentences into pseudo-paragraphs:
  // A new "paragraph" begins whenever the original content had a newline
  // before that sentence.  We build this mapping once from the raw content.
  const paragraphs = groupSentencesIntoParagraphs(content, sentences);

  return (
    <div className="text-lg leading-relaxed text-[#F3F0FF]">
      {paragraphs.map((group, pIdx) => (
        <p key={pIdx} className="mb-5 last:mb-0">
          {group.map(({ sentence, globalIndex }) => {
            let className: string;
            if (globalIndex === currentSentenceIndex) {
              className = "sentence-current";
            } else if (currentSentenceIndex > globalIndex && currentSentenceIndex >= 0) {
              className = "sentence-done";
            } else {
              className = "";
            }

            return (
              <span
                key={globalIndex}
                ref={(el) => {
                  sentenceRefs.current[globalIndex] = el;
                }}
                data-sentence-id={globalIndex}
                className={className || undefined}
              >
                {sentence}
                {/* Add a space after each sentence unless it is the last in the paragraph */}
                {" "}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: group a flat sentence array back into paragraphs by consulting the
// original content.  A paragraph boundary is any sequence of two or more
// newlines (or a single blank line) in the source text.
// ---------------------------------------------------------------------------

interface SentenceEntry {
  sentence: string;
  globalIndex: number;
}

function groupSentencesIntoParagraphs(
  content: string,
  sentences: string[]
): SentenceEntry[][] {
  if (sentences.length === 0) return [];

  // Split the raw content on paragraph breaks (one or more blank lines)
  const rawParagraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (rawParagraphs.length <= 1) {
    // No explicit paragraph breaks: put all sentences in one group
    return [sentences.map((s, i) => ({ sentence: s, globalIndex: i }))];
  }

  // Assign each sentence to a paragraph by matching against raw paragraph text
  const result: SentenceEntry[][] = [];
  let globalIdx = 0;

  for (const rawPara of rawParagraphs) {
    const group: SentenceEntry[] = [];
    const paraSentences = splitIntoSentences(rawPara);

    for (let j = 0; j < paraSentences.length && globalIdx < sentences.length; j++) {
      group.push({ sentence: sentences[globalIdx], globalIndex: globalIdx });
      globalIdx++;
    }

    if (group.length > 0) {
      result.push(group);
    }
  }

  // Safety net: any sentences not yet assigned go into a final group
  if (globalIdx < sentences.length) {
    const remaining: SentenceEntry[] = [];
    while (globalIdx < sentences.length) {
      remaining.push({ sentence: sentences[globalIdx], globalIndex: globalIdx });
      globalIdx++;
    }
    result.push(remaining);
  }

  return result;
}
