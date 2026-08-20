import type { ComponentProps, ReactNode } from "react";
/**
 * Three tracks with the third empty: two would push the prose off-centre the
 * moment an aside appeared, setting body copy on a different axis per page.
 * The measure grows per breakpoint — a comfortable line length is a range.
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
 * `<time datetime>` carries the machine value beside the human one. Fixed to
 * `en-US`, not the visitor's locale: server and client must agree or React
 * reports a hydration mismatch, and the server cannot see their locale.
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
