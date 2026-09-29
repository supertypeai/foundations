import {
  ProseFlow,
  TypographyH2,
  TypographyH3,
  TypographyProse,
  TypographyProseList,
} from "@supertype.ai/foundations";

export default function ProseFlowDemo() {
  return (
    <ProseFlow>
      <TypographyProse>
        None of these elements sets a margin. ProseFlow spaces each one by the
        block before it.
      </TypographyProse>
      <TypographyProse>
        Two paragraphs get the base gap, which is --flow-space.
      </TypographyProse>
      <TypographyH2>A section heading</TypographyH2>
      <TypographyProse>
        A heading gets more room above it than below, so it groups with the text
        it introduces.
      </TypographyProse>
      <TypographyProseList>
        <li>Lists, fences, quotes and tables take the base gap.</li>
        <li>A margin utility on a child still wins.</li>
      </TypographyProseList>
      <TypographyH3>A subhead</TypographyH3>
      <TypographyProse>
        The gap above a heading is set in em, so it grows with the heading under
        .editorial.
      </TypographyProse>
    </ProseFlow>
  );
}
