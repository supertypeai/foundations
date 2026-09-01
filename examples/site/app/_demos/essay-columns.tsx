import { TypographyProse } from "@supertype.ai/foundations";
import { EssayColumns, TableOfContents } from "@supertype.ai/foundations/essay";

/** Prose at the measure with an index in the aside; your shell spans the page. */
export default function EssayColumnsDemo() {
  return (
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
        Use EssayColumns when the margin holds something other than a rail. For
        articles, ReadingLayout composes these columns with the reading rail
        already in the aside.
      </TypographyProse>
    </EssayColumns>
  );
}
