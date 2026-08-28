import {
  TypographyEyebrow,
  TypographyLabel,
  TypographyCaption,
  TypographySmall,
} from "@supertype/foundations";

export default function Meta() {
  return (
    <div className="space-y-5">
      <div>
        <TypographyEyebrow>Case study</TypographyEyebrow>
        <TypographyCaption as="p" className="mt-1">
          tone=&quot;heading&quot; — an eyebrow names the section under it
        </TypographyCaption>
      </div>

      <div>
        <TypographyEyebrow tone="label">Monthly revenue</TypographyEyebrow>
        <TypographyCaption as="p" className="mt-1">
          tone=&quot;label&quot; — the stat-card inversion, where the figure is the headline
        </TypographyCaption>
      </div>

      {/* A key and its value, on the same size scale. */}
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
