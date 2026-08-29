import type { ComponentProps, ComponentType, ReactNode } from "react";
/**
 * Three tracks with the third empty: two would push the prose off-centre the
 * moment an aside appeared, setting body copy on a different axis per page.
 * The measure grows per step — a comfortable line length is a range.
 *
 * The margin track is what the third one buys, and it only exists if the
 * container can pay for it:
 *
 *   aside = (container − 3rem padding − measure) ÷ 2 − 2.5rem gutter
 *
 * At 72rem, the grid's own first cap, that is 11rem — enough for a rail. At
 * `lg` (64rem), where this used to switch on, it is 7rem, and a `text-sm` label
 * past about thirteen characters wraps. So the reveal is pinned to the width
 * the three tracks were drawn for rather than to a viewport step that happens
 * to be near it.
 *
 * A container query, not a media query, because the answer depends on the room
 * this shell was given and not on the size of the window. Mounted in something
 * narrower — a docs page with its own 64rem column — it now drops the rail and
 * sets the prose centred, which is a layout, where before it drew a 5.5rem
 * margin and called it one.
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
declare const DATE_FMT: {
    readonly short: Intl.DateTimeFormat;
    readonly long: Intl.DateTimeFormat;
};
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
