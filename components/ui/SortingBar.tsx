"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { SortOrder } from "@/types";

interface SortingBarProps {
  currentSort: SortOrder;
  totalCount: number;
}

interface SortOption {
  value: SortOrder;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "tarih-yeni", label: "En Yeni" },
  { value: "tarih-eski", label: "En Eski" },
  { value: "a-z", label: "A'dan Z'ye" },
  { value: "z-a", label: "Z'den A'ya" },
];

export default function SortingBar({ currentSort, totalCount }: SortingBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSort = useCallback(
    (sort: SortOrder) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("siralama", sort);
      // Reset to first page when sorting changes
      params.delete("sayfa");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Result count */}
      <p className="text-[var(--color-star)]/60 text-sm">
        <span className="font-bold text-[var(--color-gold)]">{totalCount.toLocaleString("tr-TR")}</span>
        {" "}masal bulundu
      </p>

      {/* Sort buttons */}
      <div
        role="group"
        aria-label="Sıralama seçenekleri"
        className="flex items-center gap-1.5 flex-wrap"
      >
        {SORT_OPTIONS.map((option) => {
          const isActive = currentSort === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSort(option.value)}
              aria-pressed={isActive}
              className={[
                "px-3 py-1.5 rounded-[var(--radius-badge)] text-xs font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-night)]",
                isActive
                  ? "bg-[var(--color-gold)] text-[var(--color-night)] border-[var(--color-gold)] shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                  : "bg-[var(--color-night-card)] text-[var(--color-star)]/70 border-[var(--color-purple)]/30 hover:border-[var(--color-purple)]/60 hover:text-[var(--color-star)] hover:bg-[var(--color-purple)]/20",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
