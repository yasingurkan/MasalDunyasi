import type { FC } from "react";
import Link from "next/link";
import type { StoryListItem } from "@/types";
import ReadingTimeBadge from "@/components/ui/ReadingTimeBadge";
import AgeBadge from "@/components/ui/AgeBadge";
import StoryIllustration from "@/components/story/StoryIllustration";

interface StoryCardProps {
  story: StoryListItem;
}

const StoryCard: FC<StoryCardProps> = ({ story }) => {
  return (
    <Link
      href={`/masallar/${story.slug}`}
      className="story-card group block rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-night-card)] border border-[var(--color-purple)]/25 hover:border-[var(--color-purple)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]"
      aria-label={`${story.title} masalını oku`}
    >
      {/* Cover illustration */}
      <div className="relative w-full aspect-[8/5] overflow-hidden">
        <StoryIllustration
          slug={story.slug}
          imageQuery={story.imageQuery}
          imageUrl={story.imageUrl}
          categoryColor={(story as StoryListItem & { category?: { color?: string } }).category?.color}
          categoryIcon={(story as StoryListItem & { category?: { icon?: string } }).category?.icon}
          title={story.title}
          width={400}
          height={250}
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-night-card)]/60 via-transparent to-transparent pointer-events-none" />

        {/* Category badge */}
        {(story as StoryListItem & { category?: { color?: string; name?: string } }).category && (
          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded-[var(--radius-badge)] text-xs font-bold text-white/90 shadow"
            style={{ backgroundColor: (story as StoryListItem & { category?: { color?: string } }).category?.color }}
          >
            {(story as StoryListItem & { category?: { name?: string } }).category?.name}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-[var(--color-star)] font-bold text-base leading-snug line-clamp-2 group-hover:text-[var(--color-gold-light)] transition-colors duration-200">
          {story.title}
        </h2>

        <p className="text-[var(--color-star)]/60 text-sm leading-relaxed line-clamp-2">
          {story.excerpt}
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-badge)] bg-[var(--color-night-soft)] text-[var(--color-star)]/50 text-xs font-medium border border-white/5 truncate max-w-[140px]">
            {story.source}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <ReadingTimeBadge minutes={story.readingMinutes} />
            <AgeBadge ageMin={story.ageMin} ageMax={story.ageMax} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
