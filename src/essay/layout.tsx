import type { ComponentProps, ComponentType, ReactNode } from "react";

import { cn } from "../cn.js";

/**
 * Three tracks with the third empty: two would push the prose off-centre the
 * moment an aside appeared, setting body copy on a different axis per page.
 * The measure grows per breakpoint — a comfortable line length is a range.
 */
export function EssayColumns({
  aside,
  children,
  className,
  ...props
}: ComponentProps<"div"> & { aside?: ReactNode }) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-6xl gap-10 px-6",
        "lg:grid-cols-[1fr_minmax(0,42rem)_1fr] lg:gap-0",
        "xl:max-w-7xl xl:grid-cols-[1fr_minmax(0,44rem)_1fr]",
        "2xl:max-w-[84rem] 2xl:grid-cols-[1fr_minmax(0,46rem)_1fr]",
        className,
      )}
      {...props}
    >
      <div className="hidden lg:block lg:pr-10">{aside}</div>
      <div className="mx-auto w-full min-w-0 max-w-2xl lg:max-w-none">
        {children}
      </div>
      <div className="hidden lg:block" />
    </div>
  );
}

/** A separator between meta items. Decorative, so it is hidden from assistive tech. */
export function MetaDot({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("text-muted-foreground/50", className)}>
      ·
    </span>
  );
}

/** The row of meta beneath a title: byline, date, reading time, tags. */
export function PostMetaRow({
  className,
  children,
  size = "base",
  ...props
}: ComponentProps<"div"> & { size?: "sm" | "base" }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 text-muted-foreground",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const DATE_FMT = {
  short: new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  long: new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
} as const;

export type PostDateFormat = keyof typeof DATE_FMT;

/**
 * The date string, outside React. An OG image builds one in a plain function and
 * the index builds one in a component; two formatters is how the two drift.
 *
 * Fixed to `en-US`, not the visitor's locale: server and client must agree or
 * React reports a hydration mismatch, and the server cannot see their locale.
 * The index abbreviates because its dates sit inside a card's metadata line; an
 * article spells the month out under a display title.
 */
export const formatPostDate = (
  date: string | Date,
  format: PostDateFormat = "short",
) => DATE_FMT[format].format(typeof date === "string" ? new Date(date) : date);

/** `<time datetime>` carries the machine value beside the human one. */
export function PostDate({
  date,
  format,
  className,
}: {
  date: string | Date;
  format?: PostDateFormat;
  className?: string;
}) {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return null;
  return (
    <time dateTime={value.toISOString()} className={className}>
      {formatPostDate(value, format)}
    </time>
  );
}

/**
 * Estimated reading time. Pair with `readingTime()` from the toc module.
 * `icon` is injected, so the package needs no icon set of its own.
 */
export function ReadTime({
  minutes,
  icon: Icon,
  className,
}: {
  minutes: number;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {Icon && <Icon className="size-3.5" />}
      {minutes} min read
    </span>
  );
}

/** Topic tags, as quiet pills. */
export function TagPills({
  tags,
  className,
}: {
  tags: readonly string[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          {tag}
        </span>
      ))}
    </span>
  );
}
