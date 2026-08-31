import {
  TypographyP,
  TypographyMuted,
  TypographyProse,
  TypographyList,
  TypographyProseList,
} from "@supertype.ai/foundations";

export default function Body() {
  return (
    <div className="space-y-4">
      <TypographyP>Interface copy, 13px.</TypographyP>
      <TypographyMuted>The same rung, secondary ink.</TypographyMuted>
      <TypographyProse>
        Reading copy: 18px, relaxed leading, balanced wrapping. Essays and docs
        pages set
        their body at this rung, and the heading ladder is a ratio to it.
      </TypographyProse>

      <TypographyList variant="ui">
        <li>The ui variant sets bullets at 13px, matching interface copy.</li>
        <li>Use it for lists inside cards, panels and tiers.</li>
      </TypographyList>

      <TypographyProseList ordered>
        <li>The prose variant sets bullets at reading size.</li>
        <li>Same measure as the prose above it.</li>
      </TypographyProseList>
    </div>
  );
}
