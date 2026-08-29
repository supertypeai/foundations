import type { Metadata } from "next";
import { TypographyProse, TypographyInlineCode, TypographyHighlight } from "@supertype/foundations";
import { Callout } from "@supertype/foundations/blocks";
import { Section } from "../_components/section";
import { WithToc } from "../_components/toc";
import { PageTitle } from "../_components/site-header";
import { SwatchGrid, PairGrid } from "../_components/swatches";
import { Code } from "../_components/code";

export const metadata: Metadata = { title: "Tokens" };

/** Named for meaning, not hue: a `success` a project renders blue still reads correctly. */
const STRUCTURAL = [
  "background",
  "foreground",
  "card",
  "muted",
  "muted-foreground",
  "primary",
  "secondary",
  "accent",
  "border",
  "input",
  "ring",
] as const;

const STATUS = [
  ["success", "success-foreground"],
  ["warn", "warn-foreground"],
  ["info", "info-foreground"],
  ["destructive", "destructive-foreground"],
] as const;

const EDITORIAL = ["secondary-ink", "subtle-foreground", "ochre", "terracotta", "sage", "fig"] as const;

const SECTIONS = [
  { id: "structural", label: "Structural roles" },
  { id: "status", label: "Status" },
  { id: "editorial", label: "Editorial inks" },
  { id: "repaint", label: "Repainting" },
  { id: "editorial-surface", label: "The .editorial surface" },
];

export default function TokensPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Reference"
        title="Tokens and theming"
        lede="The package defines structural roles, not brand colours. Every swatch below reads its colour through a variable, so the dark switch in the header re-points all of them at once."
      />

      <Section
        id="structural"
        title="Structural roles"
        note="tokens.css names the roles. theme.css assigns them the house latte and espresso palette. Swapping the palette leaves every call site untouched."
      >
        <SwatchGrid tokens={STRUCTURAL} />
      </Section>

      <Section
        id="status"
        title="Status"
        note="Each role paired with the ink meant to sit on it. danger is an alias for destructive."
      >
        <PairGrid pairs={STATUS} />
      </Section>

      <Section
        id="editorial"
        title="Editorial inks"
        note="Defined in theme.css and nowhere else. Skip that import and the marker tones, the secondary link colour and the accordion keyframes resolve to nothing, with no error."
      >
        <SwatchGrid tokens={EDITORIAL} />
        <TypographyProse className="mt-6">
          The four earth tones are the palette{" "}
          <TypographyHighlight tone="ochre">the marker highlight</TypographyHighlight> paints
          with. They carry emphasis, not status, so there is no{" "}
          <TypographyInlineCode>warn</TypographyInlineCode>,{" "}
          <TypographyInlineCode>info</TypographyInlineCode> or{" "}
          <TypographyInlineCode>destructive</TypographyInlineCode> tone here.
        </TypographyProse>
      </Section>

      <Section
        id="repaint"
        title="Repainting"
        note="Override the raw variables after the imports. Do not patch the utility classes — the package owns its classnames, and overriding them breaks the single point of control."
      >
        <div className="mt-4">
          <Code
            lang="css"
            code={`:root  { --primary: hsl(24 60% 42%); }
.dark  { --primary: hsl(24 70% 62%); }`}
          />
        </div>
        <Callout tone="warn" title="The dark variant is bound to a class, not the OS" className="mt-6">
          <TypographyInlineCode>tokens.css</TypographyInlineCode> declares{" "}
          <TypographyInlineCode>@custom-variant dark</TypographyInlineCode> against{" "}
          <TypographyInlineCode>.dark</TypographyInlineCode>. Without that import, Tailwind v4
          follows <TypographyInlineCode>prefers-color-scheme</TypographyInlineCode> instead and
          quietly ignores your toggle.
        </Callout>
      </Section>

      <Section
        id="editorial-surface"
        title="The .editorial surface"
        note="Assigns the heading role to the serif, drops the heading weight to 400, and retunes the heading ladder. Heading sizes are a ratio to the body text beneath them, and the two surfaces set body at different sizes: 13px in the product, 18px on .editorial."
      >
        <div className="mt-4">
          <Code code={`<div className="editorial">…</div>   {/* or on <html> for an editorial site */}`} />
        </div>
        <TypographyProse className="mt-4">
          The switch in the header applies it to{" "}
          <TypographyInlineCode>&lt;html&gt;</TypographyInlineCode>. Turn it on and revisit the
          typography page: the heading sizes move, the body size stays put.
        </TypographyProse>
      </Section>
    </WithToc>
  );
}
