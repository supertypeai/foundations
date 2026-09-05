import type { ComponentProps, ComponentType, ReactNode } from "react";
import type { TocHeading } from "./toc.js";
/**
 * Three tracks with the third empty: two would push the prose off-centre the
 * moment an aside appeared. The margin track appears only where the container can
 * pay for it, which at 72rem is 11rem and at 64rem is 7rem, where a `text-sm`
 * label wraps. A container query, since the answer depends on the room this shell
 * was given rather than the window.
 */
export declare function EssayColumns({ aside, children, className, ...props }: ComponentProps<"div"> & {
    aside?: ReactNode;
}): import("react").JSX.Element;
/**
 * The margin track's contents, pinned as the column scrolls.
 *
 * The offset is stated here and nowhere else: it has to clear the same sticky
 * site nav that `EssaySection`'s `scroll-mt` clears, and two literals a file
 * apart is how an anchored heading ends up under the chrome that the rail
 * scrolled it to.
 */
export declare function EssayAside({ children, className, }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/**
 * The join between a header and the body under it: the one place in the package that draws
 * it, so a seam cannot be ruled twice by a header and a layout that cannot see each other.
 *
 * The rule is for the narrow layout alone. Past `@6xl` the margin rail marks the join, and
 * the header's own bottom padding is the whole of the gap.
 */
export declare function EssayBody({ children, className, }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/**
 * The reading column with a scroll-spied rail in its margin: an article whose
 * body is prose or MDX, rather than the declared sections `EssayLayout` sets.
 *
 * The rail is dropped when a piece has no headings, so a short post gets a
 * centred measure instead of a margin holding an empty nav.
 */
export declare function ReadingLayout({ headings, children, className, }: {
    headings: readonly TocHeading[];
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
/** A separator between meta items. Decorative, so it is hidden from assistive tech. */
export declare function MetaDot({ className }: {
    className?: string;
}): import("react").JSX.Element;
/** The row of meta beneath a title: byline, date, reading time, tags. */
export declare function PostMetaRow({ className, children, size, ...props }: ComponentProps<"div"> & {
    size?: "sm" | "base";
}): import("react").JSX.Element;
declare const DATE_FMT: {
    readonly short: Intl.DateTimeFormat;
    readonly long: Intl.DateTimeFormat;
};
export type PostDateFormat = keyof typeof DATE_FMT;
/**
 * The date string, outside React, since an OG image builds one in a plain function
 * and the index builds one in a component. Fixed to `en-US`: server and client
 * must agree or React reports a hydration mismatch. The index abbreviates; an
 * article spells the month out.
 */
export declare const formatPostDate: (date: string | Date, format?: PostDateFormat) => string;
/** `<time datetime>` carries the machine value beside the human one. */
export declare function PostDate({ date, format, className, }: {
    date: string | Date;
    format?: PostDateFormat;
    className?: string;
}): import("react").JSX.Element | null;
/**
 * Estimated reading time. Pair with `readingTime()` from the toc module.
 * `icon` is injected, so the package needs no icon set of its own.
 */
export declare function ReadTime({ minutes, icon: Icon, className, }: {
    minutes: number;
    icon?: ComponentType<{
        className?: string;
    }>;
    className?: string;
}): import("react").JSX.Element;
/** Topic tags, as quiet pills. */
export declare function TagPills({ tags, className, }: {
    tags: readonly string[];
    className?: string;
}): import("react").JSX.Element | null;
export {};
