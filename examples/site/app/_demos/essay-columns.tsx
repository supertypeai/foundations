import { TypographyProse } from "@supertype.ai/foundations";
import { EssayColumns, TableOfContents } from "@supertype.ai/foundations/essay";

/**
 * Prose at the measure with an index in the aside. The 72rem frame is
 * scaffolding for the container query; your own shell spans the page.
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
            Reach for EssayColumns directly when the margin holds something
            other than a rail. For an article, ReadingLayout composes these
            columns with the reading rail already in the aside.
          </TypographyProse>
        </EssayColumns>
      </div>
    </div>
  );
}
