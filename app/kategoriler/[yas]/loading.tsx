export default function CategoryLoading() {
  return (
    <div className="relative z-10 flex flex-col min-h-dvh">
      {/* Header skeleton */}
      <div
        className="sticky top-0 z-50 h-16 w-full"
        style={{
          backgroundColor: "rgba(26, 16, 53, 0.85)",
          borderBottom: "1px solid rgba(107, 33, 168, 0.3)",
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Category header skeleton */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {/* Icon bubble */}
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-night-card)] animate-pulse flex-shrink-0" />

            <div className="flex flex-col gap-2">
              <div className="h-8 w-56 rounded-xl bg-[var(--color-night-card)] animate-pulse" />
              <div className="h-4 w-36 rounded-lg bg-[var(--color-night-card)] animate-pulse" />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="h-4 w-full rounded-lg bg-[var(--color-night-card)] animate-pulse" />
            <div className="h-4 w-3/4 rounded-lg bg-[var(--color-night-card)] animate-pulse" />
          </div>
        </header>

        {/* Sorting bar skeleton */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-5 w-36 rounded-lg bg-[var(--color-night-card)] animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-full bg-[var(--color-night-card)] animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Story grid skeleton: 8 cards */}
        <ul
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-busy="true"
          aria-label="Masallar yükleniyor"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <li
              key={i}
              className="rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-night-card)] border border-[var(--color-purple)]/20"
            >
              {/* Cover image placeholder */}
              <div className="w-full aspect-[8/5] bg-[var(--color-night-soft)] animate-pulse" />

              {/* Card body */}
              <div className="flex flex-col gap-3 p-4">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-full rounded-md bg-[var(--color-night-soft)] animate-pulse" />
                  <div className="h-4 w-2/3 rounded-md bg-[var(--color-night-soft)] animate-pulse" />
                </div>

                {/* Excerpt */}
                <div className="flex flex-col gap-1">
                  <div className="h-3.5 w-full rounded bg-[var(--color-night-soft)] animate-pulse" />
                  <div className="h-3.5 w-4/5 rounded bg-[var(--color-night-soft)] animate-pulse" />
                </div>

                {/* Footer badges */}
                <div className="flex items-center justify-between pt-1">
                  <div className="h-5 w-20 rounded-full bg-[var(--color-night-soft)] animate-pulse" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 rounded-full bg-[var(--color-night-soft)] animate-pulse" />
                    <div className="h-5 w-14 rounded-full bg-[var(--color-night-soft)] animate-pulse" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-center gap-2 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-9 rounded-lg bg-[var(--color-night-card)] animate-pulse"
            />
          ))}
        </div>
      </main>

      {/* Footer skeleton */}
      <div
        className="h-64 w-full"
        style={{
          backgroundColor: "#0F0A1E",
          borderTop: "1px solid rgba(107, 33, 168, 0.3)",
        }}
      />
    </div>
  );
}
