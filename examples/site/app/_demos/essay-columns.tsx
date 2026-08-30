import { TypographyProse } from "@supertype.ai/foundations";
import { EssayColumns, TableOfContents } from "@supertype.ai/foundations/essay";

/**
 * Prose at the measure, with an index in the aside column.
 *
 * The reveal is a container query at 72rem, so the frame below is scaffolding:
 * this demo sits in a column narrower than that, and without a wide container
 * to measure the aside would never appear. In your own app the shell spans the
 * page and no wrapper is needed.
 */
export default function EssayColumnsDemo() {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="w-[72rem]">
        <EssayColumns
          className="px-0"
          aside={
            <TableOfContents
              sections={[
                { id: "rail", label: "The rail" },
                { id: "contents", label: "The margin index" },
              ]}
            />
          }
        >
          <TypographyProse>
            Reach for EssayColumns directly when the margin holds something that
            is not a rail. For an article it is ReadingLayout that composes these
            columns with the reading rail already in the aside.
          </TypographyProse>
        </EssayColumns>
      </div>
    </div>
  );
}
