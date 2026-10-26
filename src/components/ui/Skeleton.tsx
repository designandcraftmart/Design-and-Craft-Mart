import type { ComponentProps } from "react";

/** Gray placeholder block. Purely visual, hidden from screen readers. */
export function Skeleton({ className = "", ...rest }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={`rounded-input bg-ink/10 motion-safe:animate-pulse ${className}`.trim()}
      {...rest}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={`flex flex-col gap-2 ${className}`.trim()}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 && lines > 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/** Same footprint as ProductCard, so the page does not jump when data arrives. */
export function SkeletonCard({
  loadingLabel,
  className = "",
}: {
  /** Announced to screen readers, already translated. */
  loadingLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`overflow-hidden rounded-card bg-white shadow-soft ${className}`.trim()}
    >
      {loadingLabel ? <span className="sr-only">{loadingLabel}</span> : null}
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-6 w-20 rounded-pill" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-12 w-full rounded-pill" />
      </div>
    </div>
  );
}
