export declare function useReadingProgress(): number;
/**
 * One IntersectionObserver across all headings, not one each — the observer
 * already reports what changed. Topmost wins when several are on screen.
 */
export declare function useScrollSpy(ids: string[], { rootMargin }?: {
    rootMargin?: string;
}): string;
