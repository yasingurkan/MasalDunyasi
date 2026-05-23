"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

/** Returns a compact window of page numbers with ellipsis sentinels (-1). */
function buildPageWindow(current: number, total: number): (number | -1)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | -1)[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push(-1); // left ellipsis
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  if (current < total - 2) {
    pages.push(-1); // right ellipsis
  }

  // Always show last page
  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;

      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete("sayfa");
      } else {
        params.set("sayfa", String(page));
      }

      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: true });
    },
    [router, basePath, searchParams, totalPages]
  );

  if (totalPages <= 1) return null;

  const pageWindow = buildPageWindow(currentPage, totalPages);

  const btnBase =
    "inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-lg text-sm font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]";

  const btnInactive =
    "bg-[var(--color-night-card)] text-[var(--color-star)]/70 border-[var(--color-purple)]/30 hover:border-[var(--color-purple)]/60 hover:text-[var(--color-star)] hover:bg-[var(--color-purple)]/20";

  const btnActive =
    "bg-[var(--color-purple)] text-white border-[var(--color-purple)] shadow-[0_0_12px_rgba(107,33,168,0.5)] cursor-default";

  const btnDisabled =
    "bg-[var(--color-night-soft)] text-[var(--color-star)]/25 border-white/5 cursor-not-allowed";

  return (
    <nav
      aria-label="Sayfalama"
      className="flex items-center justify-center gap-1.5 flex-wrap py-2"
    >
      {/* Previous button */}
      <button
        type="button"
        onClick={() => navigate(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Önceki sayfa"
        className={[btnBase, currentPage <= 1 ? btnDisabled : btnInactive].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Önceki</span>
      </button>

      {/* Page number buttons */}
      {pageWindow.map((page, idx) => {
        if (page === -1) {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center min-w-[2.25rem] h-9 text-[var(--color-star)]/40 text-sm select-none"
              aria-hidden="true"
            >
              &hellip;
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => !isActive && navigate(page)}
            disabled={isActive}
            aria-label={`Sayfa ${page}`}
            aria-current={isActive ? "page" : undefined}
            className={[btnBase, isActive ? btnActive : btnInactive].join(" ")}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        type="button"
        onClick={() => navigate(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Sonraki sayfa"
        className={[
          btnBase,
          currentPage >= totalPages ? btnDisabled : btnInactive,
        ].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 11.78a.75.75 0 0 1-1.06-1.06L10.94 8 6.22 3.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Sonraki</span>
      </button>
    </nav>
  );
}
