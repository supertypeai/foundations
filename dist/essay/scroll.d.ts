export declare function useReadingProgress(): number;
/**
 * The id of the heading the reader is currently in.
 *
 * One IntersectionObserver across every heading rather than one per heading:
 * the observer already reports which entries changed, so a second, third and
 * fourth observer only add bookkeeping. When several headings are on screen the
 * topmost wins, which is what a reader means by "where I am".
 *
 * viably had two near-identical copies of this — one in its table of contents,
 * one in its reading rail — which is what made it worth extracting.
 */
export declare function useScrollSpy(ids: string[], { rootMargin }?: {
    rootMargin?: string;
}): string;
