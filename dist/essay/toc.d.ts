/** A heading in the table of contents. */
export interface TocHeading {
    /** 2 = h2 (top level), 3 = h3 (nested). */
    depth: 2 | 3;
    /** Matches the id rehype-slug stamps on the heading, so anchors line up. */
    id: string;
    label: string;
}
/**
 * GitHub's slug algorithm, reimplemented. Must agree exactly with rehype-slug or
 * the rail's anchors point at headings that do not exist.
 */
export declare function createSlugger(): (value: string) => string;
/**
 * h2/h3 from raw markdown. Fenced code is skipped — a `# comment` in a shell
 * block is not a heading. Works on source, so it needs no DOM or compiled MDX.
 */
export declare function extractHeadings(markdown: string): TocHeading[];
/**
 * Computed, never stored: a hand-declared `readingMinutes` is correct once.
 * 200 wpm, code blocks excluded — counting them inflates every technical post.
 */
export declare function readingTime(source: string, wordsPerMinute?: number): number;
