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
          {/* proportional for a headline figure, tabular where a value updates in place */}
          <TypographyStat size="panel" figures="proportional">
            98%
          </TypographyStat>
        </div>
      </div>

      <TypographyProse>
        Run <TypographyInlineCode>npx foundations doctor</TypographyInlineCode> before you
        report a styling bug — it catches{" "}
        <TypographyHighlight tone="sage">the part that matters</TypographyHighlight> more
        often than not, and a <TypographyHighlight tone="terracotta" seed={7}>
          different swipe
        </TypographyHighlight>{" "}
        comes out of the same tone with another seed.
      </TypographyProse>
    </div>
  );
}
