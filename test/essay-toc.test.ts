import { describe, expect, it } from "vitest";
import { createSlugger, extractHeadings, readingTime } from "../dist/essay/toc.js";
import { formatPostDate } from "../dist/essay/layout.js";

describe("createSlugger", () => {
  it("lowercases, strips punctuation and hyphenates", () => {
    const slug = createSlugger();
    expect(slug("What we don't collect")).toBe("what-we-dont-collect");
  });

  it("suffixes a repeat rather than colliding", () => {
    const slug = createSlugger();
    expect(slug("Setup")).toBe("setup");
    expect(slug("Setup")).toBe("setup-1");
    expect(slug("Setup")).toBe("setup-2");
  });

  it("counts per slugger, so two documents do not interfere", () => {
    expect(createSlugger()("Setup")).toBe("setup");
    expect(createSlugger()("Setup")).toBe("setup");
  });
});

describe("extractHeadings", () => {
  it("takes h2 and h3, and leaves h1 and h4 alone", () => {
    const headings = extractHeadings(`# Title\n## Two\n### Three\n#### Four\n`);
    expect(headings).toEqual([
      { depth: 2, id: "two", label: "Two" },
      { depth: 3, id: "three", label: "Three" },
    ]);
  });

  it("ignores a # comment inside a fenced block", () => {
    const source = `## Real\n\n\`\`\`sh\n# not a heading\n## also not\n\`\`\`\n\n## Also real\n`;
    expect(extractHeadings(source).map((h) => h.label)).toEqual(["Real", "Also real"]);
  });

  it("handles tilde fences too", () => {
    expect(extractHeadings(`~~~\n## hidden\n~~~\n## shown\n`).map((h) => h.label)).toEqual(["shown"]);
  });

  it("strips inline markup from the label but keeps the words", () => {
    const [heading] = extractHeadings("## The `slot` **matters**\n");
    expect(heading.label).toBe("The slot matters");
    expect(heading.id).toBe("the-slot-matters");
  });

  it("gives repeated headings distinct anchors", () => {
    expect(extractHeadings(`## Setup\n## Setup\n`).map((h) => h.id)).toEqual(["setup", "setup-1"]);
  });
});

describe("readingTime", () => {
  it("rounds to whole minutes at 200wpm", () => {
    expect(readingTime(Array(400).fill("word").join(" "))).toBe(2);
  });

  it("never returns zero", () => {
    expect(readingTime("three short words")).toBe(1);
    expect(readingTime("")).toBe(1);
  });

  it("excludes fenced code, which would inflate a technical post", () => {
    const prose = Array(200).fill("word").join(" ");
    const code = "```ts\n" + Array(2000).fill("const x = 1;").join("\n") + "\n```";
    expect(readingTime(`${prose}\n\n${code}`)).toBe(readingTime(prose));
  });

  it("takes a different rate", () => {
    expect(readingTime(Array(400).fill("word").join(" "), 400)).toBe(1);
  });
});

describe("formatPostDate", () => {
  it("is fixed to en-US so the server and client agree", () => {
    expect(formatPostDate("2026-03-14")).toBe("Mar 14, 2026");
    expect(formatPostDate("2026-03-14", "long")).toBe("March 14, 2026");
  });

  it("takes a Date as well as a string", () => {
    expect(formatPostDate(new Date("2026-03-14T00:00:00.000Z"))).toBe("Mar 14, 2026");
  });
});
