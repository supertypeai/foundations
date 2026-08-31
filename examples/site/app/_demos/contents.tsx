import { TableOfContents } from "@supertype.ai/foundations/essay";

const SECTIONS = [
  { id: "rail", label: "The rail" },
  { id: "contents", label: "The margin index" },
  { id: "reading", label: "The reading rail" },
];

/** Both spy on this page's sections. The second hides its heading. */
export default function ContentsDemo() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <TableOfContents sections={SECTIONS} />
      <TableOfContents sections={SECTIONS} label={null} />
    </div>
  );
}
