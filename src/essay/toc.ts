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
export function createSlugger() {
  const seen = new Map<string, number>();
  return (value: string) => {
    const base = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

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
export function extractHeadings(markdown: string): TocHeading[] {
  const slug = createSlugger();
  const headings: TocHeading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const label = match[2].replace(/[*_`]/g, "").trim();
    headings.push({ depth, id: slug(label), label });
  }

  return headings;
}

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
export function readingTime(source: string, wordsPerMinute = 200): number {
  const prose = source.replace(/```[\s\S]*?```/g, " ");
  const words = prose.trim() ? prose.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
