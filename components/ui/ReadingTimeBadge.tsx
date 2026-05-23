import type { FC } from "react";

interface ReadingTimeBadgeProps {
  minutes: number;
}

const ReadingTimeBadge: FC<ReadingTimeBadgeProps> = ({ minutes }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-badge)] bg-[var(--color-gold)]/15 text-[var(--color-gold)] text-xs font-semibold leading-none border border-[var(--color-gold)]/30 whitespace-nowrap">
      {/* Clock icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3 h-3 shrink-0"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25a.75.75 0 0 0-1.5 0v3.5c0 .199.079.39.22.53l2 2a.75.75 0 1 0 1.06-1.06L8.75 8.19V4.75Z"
          clipRule="evenodd"
        />
      </svg>
      <span>{minutes} dk</span>
    </span>
  );
};

export default ReadingTimeBadge;
