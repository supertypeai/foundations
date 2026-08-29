import { TableOfContents } from "@supertype.ai/foundations/essay";

const SECTIONS = [
  { id: "rail", label: "The rail" },
  { id: "contents", label: "The margin index" },
  { id: "reading", label: "The reading rail" },
];

/**
 * Both instances spy on this page's real sections, so the marked item updates
 * as you scroll. The second one hides the rail heading with `label={null}`.
 */
export default function ContentsDemo() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <TableOfContents sections={SECTIONS} />
      <TableOfContents sections={SECTIONS} label={null} />
    </div>
  );
}
