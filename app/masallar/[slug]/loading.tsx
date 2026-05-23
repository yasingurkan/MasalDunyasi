export default function StoryLoading() {
  return (
    <div className="relative z-10 flex flex-col min-h-dvh">
      {/* Header skeleton */}
      <div
        className="sticky top-0 z-50 h-16 w-full flex-shrink-0"
        style={{
          backgroundColor: "rgba(26, 16, 53, 0.85)",
          borderBottom: "1px solid rgba(107, 33, 168, 0.3)",
        }}
      />

      <main className="flex-1 w-full">
        {/* Hero image skeleton */}
        <div className="relative w-full h-[400px] sm:h-[460px] md:h-[500px] bg-[var(--color-night-soft)] animate-pulse" />

        {/* Content column */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
          {/* Metadata skeleton */}
          <header className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <div className="h-9 w-full rounded-xl bg-[var(--color-night-card)] animate-pulse" />
              <div className="h-9 w-2/3 rounded-xl bg-[var(--color-night-card)] animate-pulse" />
            </div>

            {/* Badge row */}
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-24 rounded-full bg-[var(--color-night-card)] animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-[var(--color-night-card)] animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-[var(--color-night-card)] animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-[var(--color-night-card)] animate-pulse" />
            </div>

            {/* Excerpt / lead */}
            <div
              className="flex flex-col gap-2 pl-4"
              style={{ borderLeft: "2px solid rgba(107, 33, 168, 0.4)" }}
            >
              <div className="h-4 w-full rounded bg-[var(--color-night-card)] animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-[var(--color-night-card)] animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-[var(--color-night-card)] animate-pulse" />
            </div>
          </header>

          {/* Audio player skeleton */}
          <div className="rounded-2xl border border-purple-800/40 bg-gradient-to-br from-[#231545] to-[#0F0A1E] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-24 rounded-lg bg-[var(--color-night-soft)] animate-pulse" />
            </div>
            <div className="h-10 w-36 rounded-xl bg-[var(--color-night-soft)] animate-pulse" />
          </div>

          {/* Story text skeleton — simulate paragraphs */}
          <div className="flex flex-col gap-5" aria-busy="true" aria-label="Masal yükleniyor">
            {Array.from({ length: 6 }).map((_, pIdx) => (
              <div key={pIdx} className="flex flex-col gap-2">
                {Array.from({ length: pIdx % 3 === 2 ? 3 : 4 }).map((_, lIdx) => (
                  <div
                    key={lIdx}
                    className="h-5 rounded bg-[var(--color-night-card)] animate-pulse"
                    style={{ width: lIdx === (pIdx % 3 === 2 ? 2 : 3) ? "66%" : "100%" }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-4 w-20 rounded bg-[var(--color-night-card)] animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 rounded-full bg-[var(--color-night-card)] animate-pulse"
                  style={{ width: `${60 + i * 10}px` }}
                />
              ))}
            </div>
          </div>

          {/* Back navigation skeleton */}
          <div className="pt-4 flex gap-3" style={{ borderTop: "1px solid rgba(107, 33, 168, 0.2)" }}>
            <div className="h-10 w-52 rounded-xl bg-[var(--color-night-card)] animate-pulse" />
            <div className="h-10 w-32 rounded-xl bg-[var(--color-night-card)] animate-pulse" />
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <div
        className="h-64 w-full flex-shrink-0"
        style={{
          backgroundColor: "#0F0A1E",
          borderTop: "1px solid rgba(107, 33, 168, 0.3)",
        }}
      />
    </div>
  );
}
