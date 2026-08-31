import { TypographyProse } from "@supertype.ai/foundations";
import { ReadingLayout } from "@supertype.ai/foundations/essay";

/**
 * `EssayColumns` with the scroll-spied rail pinned in the margin. The 72rem
 * frame is scaffolding for the container query, as in the columns demo.
 */
export default function ReadingLayoutDemo() {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="w-[72rem]">
        <ReadingLayout
          className="px-0 pb-0 sm:pb-0"
          headings={[
            { depth: 2, id: "rail", label: "The rail" },
            { depth: 2, id: "contents", label: "The margin index" },
            { depth: 3, id: "progress", label: "The progress bar" },
          ]}
        >
          <TypographyProse>
            Reach for ReadingLayout when the body arrives as prose or MDX. Pass
            the headings you pulled out of the markdown, and the rail, its
            sticky
            offset and the headingless case are handled for you.
          </TypographyProse>
        </ReadingLayout>
      </div>
    </div>
  );
}
