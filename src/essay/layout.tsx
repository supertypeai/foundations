import type { ComponentProps, ComponentType, ReactNode } from "react";

import { cn } from "../cn.js";
import { ReadingRail } from "./reading.js";
import type { TocHeading } from "./toc.js";

/**
 * Three tracks with the third empty: two would push the prose off-centre the
 * moment an aside appeared. The margin track appears only where the container can
 * pay for it, which at 72rem is 11rem and at 64rem is 7rem, where a `text-sm`
 * label wraps. A container query, since the answer depends on the room this shell
 * was given rather than the window.
 */
export function EssayColumns({
  aside,
  children,
  className,
  ...props
}: ComponentProps<"div"> & { aside?: ReactNode }) {
  return (
    <div className="@container w-full">
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl gap-10 px-6",
          "@6xl:grid-cols-[1fr_minmax(0,42rem)_1fr] @6xl:gap-0",
          "@7xl:max-w-7xl @7xl:grid-cols-[1fr_minmax(0,44rem)_1fr]",
          "@min-[84rem]:max-w-[84rem] @min-[84rem]:grid-cols-[1fr_minmax(0,46rem)_1fr]",
          className,
        )}
        {...props}
      >
        <div className="hidden @6xl:block @6xl:pr-10">{aside}</div>
        <div className="mx-auto w-full min-w-0 max-w-2xl @6xl:max-w-none">
          {children}
        </div>
        <div className="hidden @6xl:block" />
      </div>
    </div>
  );
}

/**
 * The margin track's contents, pinned as the column scrolls.
 *
 * The offset is stated here and nowhere else: it has to clear the same sticky
 * site nav that `EssaySection`'s `scroll-mt` clears, and two literals a file
 * apart is how an anchored heading ends up under the chrome that the rail
 * scrolled it to.
 */
export function EssayAside({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("sticky top-24", className)}>{children}</div>;
}

/**
 * The join between a header and the body under it: the one place in the package that draws
 * it, so a seam cannot be ruled twice by a header and a layout that cannot see each other.
 *
 * The rule is for the narrow layout alone. Past `@6xl` the margin rail marks the join, and
 * the header's own bottom padding is the whole of the gap.
 */
export function EssayBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t border-border pt-12 @6xl:border-t-0 @6xl:pt-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The reading column with a scroll-spied rail in its margin: an article whose
 * body is prose or MDX, rather than the declared sections `EssayLayout` sets.
 *
 * The rail is dropped when a piece has no headings, so a short post gets a
 * centred measure instead of a margin holding an empty nav.
 */
export function ReadingLayout({
  headings,
  children,
  className,
}: {
  headings: readonly TocHeading[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <EssayColumns
      className={cn("pb-16 sm:pb-24", className)}
      aside={
        headings.length > 0 ? (
          <EssayAside>
            <ReadingRail headings={headings} />
          </EssayAside>
        ) : undefined
      }
    >
      <EssayBody>{children}</EssayBody>
    </EssayColumns>
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
 * The date string, outside React, since an OG image builds one in a plain function
 * and the index builds one in a component. Fixed to `en-US`: server and client
 * must agree or React reports a hydration mismatch. The index abbreviates; an
 * article spells the month out.
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
          className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary-ink"
        >
          {tag}
        </span>
      ))}
    </span>
  );
}
