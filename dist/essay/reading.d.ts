import type { TocHeading } from "./toc.js";
/**
 * Hairline progress bar pinned to the top of the viewport. Always rendered,
 * including where the rail is hidden, so readers keep a sense of place.
 *
 * A CSS transition rather than a spring from an animation library: the value
 * only ever feeds a transform, and a short ease absorbs wheel-jitter as well as
 * a spring does at this fidelity — which keeps the essay layer dependency-free,
 * so a project wanting a reading rail does not inherit an animation runtime.
 */
export declare function ReadingProgressBar({ className }: {
    className?: string;
}): import("react").JSX.Element;
/**
 * Sticky table-of-contents rail with live scroll-spy.
 *
 * The donut reflects overall progress; the active heading comes from the shared
 * scroll-spy. Both read stores rather than owning listeners, so mounting this
 * beside `ReadingProgressBar` costs one scroll subscription, not two.
 */
export declare function ReadingRail({ headings, className, }: {
    headings: TocHeading[];
    className?: string;
}): import("react").JSX.Element | null;
