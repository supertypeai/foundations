import {
  TypographyStat,
  TypographyInlineCode,
  TypographyHighlight,
  TypographyLabel,
  TypographyProse,
} from "@supertype/foundations";

export default function Stats() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-8">
        <div>
          <TypographyLabel as="p" size="2xs">
            Events
          </TypographyLabel>
          <TypographyStat size="display">2.4M</TypographyStat>
        </div>
        <div>
          <TypographyLabel as="p" size="2xs">
            Uptime
          </TypographyLabel>
          {/* proportional for a headline figure; tabular where a value updates in place */}
          <TypographyStat size="panel" figures="proportional">
            98%
          </TypographyStat>
        </div>
      </div>

      <TypographyProse>
        Run <TypographyInlineCode>npx foundations doctor</TypographyInlineCode> before
        reporting a styling bug. It checks{" "}
        <TypographyHighlight tone="sage">import order, fonts and peers</TypographyHighlight>,
        which is where most of them come from. Changing{" "}
        <TypographyInlineCode>seed</TypographyInlineCode> gives{" "}
        <TypographyHighlight tone="terracotta" seed={7}>
          a different swipe
        </TypographyHighlight>{" "}
        from the same tone.
      </TypographyProse>
    </div>
  );
}
