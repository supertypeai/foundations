import {
  TypographyP,
  TypographyMuted,
  TypographyProse,
  TypographyList,
  TypographyProseList,
} from "@supertype/foundations";

export default function Body() {
  return (
    <div className="space-y-4">
      <TypographyP>Interface copy, 13px.</TypographyP>
      <TypographyMuted>The same rung, secondary ink.</TypographyMuted>
      <TypographyProse>
        Reading copy — 18px, relaxed leading, balanced wrapping. This is the rung an essay
        or a docs page sets its body at, and the rung the heading ladder is a ratio to.
      </TypographyProse>

      <TypographyList variant="ui">
        <li>A list inside a tier card, on the same rung as the copy beside it.</li>
        <li>Which is the whole reason the variant exists.</li>
      </TypographyList>

      <TypographyProseList ordered>
        <li>Reading-size, numbered.</li>
        <li>Same measure as the prose above it.</li>
      </TypographyProseList>
    </div>
  );
}
