import { TypographyProse } from "@supertype.ai/foundations";
import { ReadingLayout } from "@supertype.ai/foundations/essay";

/** `EssayColumns` with the scroll-spied rail pinned in the margin. */
export default function ReadingLayoutDemo() {
  return (
    <ReadingLayout
      className="px-0 pb-0 sm:pb-0"
      headings={[
        { depth: 2, id: "rail", label: "The rail" },
        { depth: 2, id: "contents", label: "The margin index" },
        { depth: 3, id: "progress", label: "The progress bar" },
      ]}
    >
      <TypographyProse>
        Use ReadingLayout when the body arrives as prose or MDX. Pass the
        headings extracted from the markdown, and the rail, sticky offset, and
        headingless case are handled for you.
      </TypographyProse>
    </ReadingLayout>
  );
}
