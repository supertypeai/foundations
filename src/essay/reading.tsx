"use client";

import { cn } from "../cn.js";
import { Rail, RailLink } from "./rail.js";
import { useReadingProgress, useScrollSpy } from "./scroll.js";
import type { TocHeading } from "./toc.js";

/**
 * Hairline progress bar, rendered even where the rail is hidden. A CSS
 * transition, not a spring: the value only feeds a transform, and this keeps the
 * essay layer from dragging in an animation runtime.
 */
export function ReadingProgressBar({ className }: { className?: string }) {
  const progress = useReadingProgress();
  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary",
        "transition-transform duration-150 ease-out",
        className,
      )}
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}

/** Circular percentage indicator at the head of the rail. */
function ProgressDonut({ progress }: { progress: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative grid size-10 place-items-center">
      <svg viewBox="0 0 40 40" className="size-10 -rotate-90" aria-hidden>
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth="3"
          className="stroke-border"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-150 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
      </svg>
      <span className="absolute font-mono text-3xs font-medium tabular-nums text-muted-foreground">
        {Math.round(progress * 100)}
      </span>
    </div>
  );
}

/**
 * Sticky rail with live scroll-spy. Both it and `ReadingProgressBar` read shared
 * stores, so mounting them together costs one scroll subscription, not two.
 */
export function ReadingRail({
  headings,
  className,
}: {
  headings: readonly TocHeading[];
  className?: string;
}) {
  const progress = useReadingProgress();
  const active = useScrollSpy(headings.map((h) => h.id));

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="flex items-center gap-3">
        <ProgressDonut progress={progress} />
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          On this page
        </p>
      </div>

      <Rail>
        {headings.map(({ id, label, depth }) => (
          <RailLink
            key={id}
            href={`#${id}`}
            active={active === id}
            nested={depth === 3}
          >
            {label}
          </RailLink>
        ))}
      </Rail>
    </nav>
  );
}
