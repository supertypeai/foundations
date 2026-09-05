import type { ReactNode } from "react";
/** Where the mark points. Exported for the cases where a footer wants the bare
 *  href — a `<link rel="…">`, a sitemap entry, an analytics label. */
export declare const FOUNDATIONS_URL = "https://github.com/supertypeai/foundations";
/**
 * The palette reduced to a small chip. It is small enough for a footer row and
 * still recognisable from the full panel.
 */
export declare function FoundationsMark({ className }: {
    className?: string;
}): import("react").JSX.Element;
/**
 * The standalone link. It is meant for a footer row or another layout that
 * already has its own structure. Use `Colophon` when the block itself is the
 * thing being placed.
 */
export declare function BuiltWithFoundations({ label, className, }: {
    label?: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export interface ColophonProps {
    /**
     * `card` is the full panel and `line` is the compact row.
     */
    variant?: "card" | "line";
    /**
     * The link label. Use this for translations or a different wording.
     */
    label?: ReactNode;
    /**
     * Extra content for the panel, such as a short note about the site or the
     * people behind it.
     */
    children?: ReactNode;
    className?: string;
}
/**
 * A preset built on top of `Bulletin`.
 *
 * ```tsx
 * <Colophon />                 // the panel
 * <Colophon variant="line" />  // the compact row
 * ```
 *
 * Use `BuiltWithFoundations` for the standalone link, and `Bulletin` if you
 * want the same layout with different copy.
 */
export declare function Colophon({ variant, label, children, className, }: ColophonProps): import("react").JSX.Element;
