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
 * h2/h3 from raw markdown. Fenced code is skipped — a `# comment` in a shell
 * block is not a heading. Works on source, so it needs no DOM or compiled MDX.
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
 * Computed, never stored: a hand-declared `readingMinutes` is correct once.
 * 200 wpm, code blocks excluded — counting them inflates every technical post.
 */
export function readingTime(source: string, wordsPerMinute = 200): number {
  const prose = source.replace(/```[\s\S]*?```/g, " ");
  const words = prose.trim() ? prose.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
