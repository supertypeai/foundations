import { ReadingRail } from "@supertype.ai/foundations/essay";

/** Pointed at this page's sections, so the donut fills as you scroll. Depth 3
indents. */
export default function ReadingRailDemo() {
  return (
    <ReadingRail
      headings={[
        { depth: 2, id: "rail", label: "The rail" },
        { depth: 2, id: "contents", label: "The margin index" },
        { depth: 2, id: "reading", label: "The reading rail" },
        { depth: 3, id: "progress", label: "The progress bar" },
        { depth: 2, id: "markdown", label: "Headings from markdown" },
      ]}
      className="max-w-xs"
    />
  );
}
