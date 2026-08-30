import type { TocHeading } from "./toc.js";
/**
 * Hairline progress bar, rendered even where the rail is hidden. A CSS
 * transition, not a spring: the value only feeds a transform, and this keeps the
 * essay layer from dragging in an animation runtime.
 */
export declare function ReadingProgressBar({ className }: {
    className?: string;
}): import("react").JSX.Element;
/**
 * Sticky rail with live scroll-spy. Both it and `ReadingProgressBar` read shared
 * stores, so mounting them together costs one scroll subscription, not two.
 */
export declare function ReadingRail({ headings, className, }: {
    headings: readonly TocHeading[];
    className?: string;
}): import("react").JSX.Element | null;
