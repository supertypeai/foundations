/** A heading in the table of contents. */
export interface TocHeading {
    /** 2 = h2 (top level), 3 = h3 (nested). */
    depth: 2 | 3;
    /** Matches the id rehype-slug stamps on the heading, so anchors line up. */
    id: string;
    label: string;
}
/**
 * GitHub's heading-slug algorithm, reimplemented rather than depended upon.
 *
 * It has to agree exactly with rehype-slug — which uses github-slugger — or the
 * rail's anchors point at headings that do not exist. Lowercase, strip anything
 * that is not a word character, space or hyphen, then collapse spaces to hyphens.
 * Repeats get a numeric suffix, which is what the counter tracks.
 */
export declare function createSlugger(): (value: string) => string;
/**
 * Extracts h2/h3 headings from raw markdown.
 *
 * Fenced code is skipped, because a `# comment` inside a shell block is a
 * comment, not a heading, and a rail that lists it sends the reader nowhere.
 * Inline emphasis and code marks are stripped from the label so it reads as
 * plain text in the rail.
 *
 * Works on the source rather than the rendered tree so it can run wherever the
 * markdown is available, without a DOM or a compiled MDX module.
 */
export declare function extractHeadings(markdown: string): TocHeading[];
/**
 * Reading time in whole minutes, never below one.
 *
 * Computed from the text rather than stored alongside it. A hand-declared
 * `readingMinutes: 7` is correct exactly once — the first time it is written —
 * and silently wrong after the next edit.
 *
 * 200 wpm is the usual prose estimate. Code blocks are excluded: nobody reads a
 * config dump at prose speed, and counting it inflates every technical post.
 */
export declare function readingTime(source: string, wordsPerMinute?: number): number;
