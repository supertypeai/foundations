import { TypographyProse } from "@supertype.ai/foundations";
import { ReadingLayout } from "@supertype.ai/foundations/essay";

/**
 * The article shell: the same columns as `EssayColumns`, with the scroll-spied
 * rail already placed and pinned in the margin.
 *
 * As with the columns demo, the 72rem frame is scaffolding — the aside is a
 * container query, and this demo sits in a column narrower than the one the
 * three tracks were drawn for. In your own app the shell spans the page.
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
            Reach for ReadingLayout when the body is prose or MDX rather than
            declared sections. Pass the headings you pulled out of the markdown;
            the rail, its sticky offset, and the empty-headings case are handled.
          </TypographyProse>
        </ReadingLayout>
      </div>
    </div>
  );
}
