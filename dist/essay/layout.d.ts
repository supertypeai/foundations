import type { ComponentProps, ReactNode } from "react";
/**
 * The essay's column grid: a measure-constrained centre column with an optional
 * aside beside it.
 *
 * Three tracks rather than two, with the third left empty. A two-track grid
 * pushes the prose off-centre the moment an aside appears, so a page with a rail
 * and a page without would set their body copy on different axes. The empty
 * third column keeps the measure fixed and lets the rail occupy margin that was
 * there either way.
 *
 * The measure grows a little at each breakpoint rather than staying fixed: a
 * comfortable line length is a range, and on a wide display the same 42rem that
 * reads well at 1280px starts to look stranded.
 */
export declare function EssayColumns({ aside, children, className, ...props }: ComponentProps<"div"> & {
    aside?: ReactNode;
}): import("react").JSX.Element;
/** A separator between meta items. Decorative, so it is hidden from assistive tech. */
export declare function MetaDot({ className }: {
    className?: string;
}): import("react").JSX.Element;
/** The row of meta beneath a title: byline, date, reading time, tags. */
export declare function PostMetaRow({ className, children, size, ...props }: ComponentProps<"div"> & {
    size?: "sm" | "base";
}): import("react").JSX.Element;
/**
 * A published date.
 *
 * Renders `<time datetime>` with the machine value alongside the human one, so
 * crawlers and assistive tech get an unambiguous date regardless of how it is
 * formatted for display. Formatting is fixed to `en-US` rather than the
 * visitor's locale: the server and the client must agree on the string or React
 * reports a hydration mismatch, and the server has no access to their locale.
 */
export declare function PostDate({ date, format, className, }: {
    date: string | Date;
    format?: "short" | "long";
    className?: string;
}): import("react").JSX.Element | null;
/** Estimated reading time. Pair with `readingTime()` from the toc module. */
export declare function ReadTime({ minutes, className, }: {
    minutes: number;
    className?: string;
}): import("react").JSX.Element;
/** Topic tags, as quiet pills. */
export declare function TagPills({ tags, className, }: {
    tags: string[];
    className?: string;
}): import("react").JSX.Element | null;
