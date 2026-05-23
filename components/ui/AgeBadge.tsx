import type { FC } from "react";

interface AgeBadgeProps {
  ageMin: number;
  ageMax: number;
}

const AgeBadge: FC<AgeBadgeProps> = ({ ageMin, ageMax }) => {
  const label =
    ageMin === ageMax ? `${ageMin} yaş` : `${ageMin}-${ageMax} yaş`;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-badge)] bg-[var(--color-purple)]/20 text-[var(--color-purple-light)] text-xs font-semibold leading-none border border-[var(--color-purple)]/40 whitespace-nowrap">
      {/* Person/child icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-3 h-3 shrink-0"
        aria-hidden="true"
      >
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
      </svg>
      <span>{label}</span>
    </span>
  );
};

export default AgeBadge;
