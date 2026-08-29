import { TypographyProse, TypographyInlineCode } from "@supertype/foundations";
import { EssayMovements } from "@supertype/foundations/essay";

/** An ordered sequence of stages, each feeding the next. */
export default function MovementsDemo() {
  return (
    <EssayMovements
      items={[
        {
          title: "Read the source",
          body: (
            <TypographyProse>
              <TypographyInlineCode>extractHeadings</TypographyInlineCode> walks the raw
              markdown, so the index is ready before the MDX is compiled.
            </TypographyProse>
          ),
        },
        {
          title: "Slug every heading",
          body: (
            <TypographyProse>
              <TypographyInlineCode>createSlugger</TypographyInlineCode> follows the same
              algorithm as rehype-slug, so rail anchors match the ids on the headings.
            </TypographyProse>
          ),
        },
        {
          title: "Hand them to the rail",
          body: (
            <TypographyProse>
              <TypographyInlineCode>ReadingRail</TypographyInlineCode> takes the list as
              returned. The depth on each heading is what drives the indent.
            </TypographyProse>
          ),
        },
      ]}
    />
  );
}
