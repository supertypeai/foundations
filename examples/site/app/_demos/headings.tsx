import { TypographyH1, TypographyH2, TypographyH3, TypographyH4 } from "@supertype.ai/foundations";

export default function Headings() {
  return (
    <div className="space-y-6">
      <TypographyH1>Settings</TypographyH1>
      <TypographyH1 variant="display">Ship faster with less ceremony</TypographyH1>

      <TypographyH2 divider>Billing</TypographyH2>

      <TypographyH3 variant="display">Featured post</TypographyH3>
      <TypographyH4>Connected accounts</TypographyH4>
    </div>
  );
}
