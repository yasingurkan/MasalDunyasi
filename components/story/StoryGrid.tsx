import type { FC } from "react";
import type { StoryListItem } from "@/types";
import StoryCard from "./StoryCard";

interface StoryGridProps {
  stories: StoryListItem[];
}

const StoryGrid: FC<StoryGridProps> = ({ stories }) => {
  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <span className="text-5xl" aria-hidden="true">
          📖
        </span>
        <p className="text-[var(--color-star)]/50 text-lg font-medium">
          Bu kategoride henüz masal bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="grid gap-5
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4"
      role="list"
    >
      {stories.map((story) => (
        <li key={story.id}>
          <StoryCard story={story} />
        </li>
      ))}
    </ul>
  );
};

export default StoryGrid;
