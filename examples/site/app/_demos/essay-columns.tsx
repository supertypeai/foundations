import { TypographyProse } from "@supertype/foundations";
import { EssayColumns, TableOfContents } from "@supertype/foundations/essay";

/**
 * Prose at the measure, with an index in the aside column. The aside is hidden
 * below `lg`; the prose stays on the same axis either way.
 */
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
        Use EssayColumns directly when your content is MDX. The columns set the
        measure, and the index you built from the markdown goes in the aside.
      </TypographyProse>
    </EssayColumns>
  );
}
