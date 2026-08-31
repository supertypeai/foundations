import {
  TypographyEyebrow,
  TypographyLabel,
  TypographyCaption,
  TypographySmall,
} from "@supertype.ai/foundations";

export default function Meta() {
  return (
    <div className="space-y-5">
      <div>
        <TypographyEyebrow>Case study</TypographyEyebrow>
        <TypographyCaption as="p" className="mt-1">
          tone=&quot;heading&quot;: primary ink, for an eyebrow above a section
        </TypographyCaption>
      </div>

      <div>
        <TypographyEyebrow tone="label">Monthly revenue</TypographyEyebrow>
        <TypographyCaption as="p" className="mt-1">
          tone=&quot;label&quot;: quiet ink, for a card where the figure leads
        </TypographyCaption>
      </div>

      {/* A key and its value share one size. */}
      <div className="flex items-baseline gap-3">
        <TypographyLabel as="p" size="xs">
          Workspace
        </TypographyLabel>
        <TypographyCaption size="xs">Updated 3 minutes ago</TypographyCaption>
      </div>

      <TypographySmall>Rates exclude tax.</TypographySmall>
    </div>
  );
}
