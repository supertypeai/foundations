import type { Metadata } from "next";
import {
  TypographyProse,
  TypographyInlineCode,
  TypographyHighlight,
  TypographyH3,
} from "@supertype.ai/foundations";
import { Callout } from "@supertype.ai/foundations/blocks";
import { Section } from "../_components/section";
import { WithToc } from "../_components/toc";
import { PageTitle } from "../_components/site-header";
import { TokenGrid } from "../_components/swatches";
import { ToneLedger, ToneAliases } from "../_components/tone-ledger";
import { Code } from "../_components/code";
import { Demo } from "../_components/demo";
import EditorialInks from "../_demos/editorial-inks";
import { pageMetadata } from "../_components/seo";

export const metadata: Metadata = pageMetadata("tokens");

/** Named for meaning, not hue: a `success` a project renders blue still reads correctly. */
const STRUCTURAL = [
  "background",
  "foreground",
  "card",
  "muted",
  "muted-foreground",
  "subtle-foreground",
  "primary",
  "secondary",
  "accent",
  "border",
  "input",
  "ring",
] as const;

/** Status, plus the one of them that really is a label on a fill. Which is which
 *  is not stated here — `TokenGrid` asks the package. */
const SIGNALS = ["success", "warn", "info", "destructive"] as const;

/** The categorical palette, in full. Every one carries an ink as well as a fill,
 *  which the page used to hide by listing four of them as bare squares. */
const EDITORIAL = [
  "terracotta",
  "ochre",
  "moss",
  "fern",
  "sage",
  "stone",
  "fig",
  "cocoa",
] as const;

const SECTIONS = [
  { id: "structural", label: "Structural roles" },
  { id: "status", label: "Status" },
  { id: "tones", label: "The seven tones" },
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
        <TokenGrid tokens={STRUCTURAL} />
      </Section>

      <Section
        id="status"
        title="Status"
        note="Each status hue ships twice: the fill, held to 3:1 as a mark, and the ink, held to 4.5:1 as words on the page. Nothing prints a label on a status fill — orange carries white text at no lightness — so those three show their ink underneath instead. destructive is the exception, shadcn's pair, and it is the only card here with an Aa sitting on the colour. danger ships as an ink only."
      >
        <TokenGrid tokens={SIGNALS} />
      </Section>

      <Section
        id="tones"
        title="The seven tones"
        note="Buttons, badges, callouts and links all read colour off one list. A tone earns a place on it by having a token of its own — seven tones, seven tokens, one for one — and that rule is the only thing standing between a design system and forty names for six colours."
      >
        <ToneLedger />
        <TypographyProse className="mt-6">
          Three cuts per tone rather than one. A fill is a mark and clears 3:1;
          an ink is read and clears 4.5:1. Ask a single value to do both and it
          fails the job you were not looking at, which is what{" "}
          <TypographyInlineCode>checkSignals</TypographyInlineCode> is for. The
          wash is the fill at 10%, mixed at render rather than stored, so adding
          a tone means adding a row and nothing else.
        </TypographyProse>
        <TypographyProse className="mt-4">
          <TypographyInlineCode>brand</TypographyInlineCode> is the one token
          the package leaves undefined. It falls back to{" "}
          <TypographyInlineCode>--primary</TypographyInlineCode>, so an app with
          no identity colour of its own gets its principal one instead of an
          invisible control.
        </TypographyProse>

        <TypographyH3 className="mt-10">Spending a tone</TypographyH3>
        <TypographyProse className="mt-2">
          A tone is a prop, not a colour. Pass one and the component reads{" "}
          <TypographyInlineCode>--tone-fill</TypographyInlineCode>,{" "}
          <TypographyInlineCode>--tone-ink</TypographyInlineCode> and{" "}
          <TypographyInlineCode>--tone-hue</TypographyInlineCode> off it — no
          per-tone branch in <TypographyInlineCode>Button</TypographyInlineCode>,{" "}
          <TypographyInlineCode>Badge</TypographyInlineCode> or{" "}
          <TypographyInlineCode>Callout</TypographyInlineCode>.
        </TypographyProse>
        <div className="mt-4">
          <Code
            code={`<Button tone="destructive">Delete workspace</Button>
<Button tone="destructive" variant="soft">Delete workspace</Button>
<Badge tone="success" variant="soft">Deployed</Badge>
<Callout tone="warn" title="Rate limited">Retry in 30s.</Callout>`}
          />
        </div>
        <TypographyProse className="mt-4">
          To tone something the package does not ship, spend the same variables
          yourself. <TypographyInlineCode>toneClass</TypographyInlineCode>{" "}
          declares them on any element:
        </TypographyProse>
        <div className="mt-4">
          <Code
            code={`<div className={cn(toneClass("brand"), "bg-(--tone-wash) text-(color:--tone-hue)")}>
  Your own surface, painted from the same seven.
</div>`}
          />
        </div>

        <TypographyH3 className="mt-10">
          If the tone you reached for is not here
        </TypographyH3>
        <TypographyProse className="mt-2">
          Each of these is a type error at the call site. The tone to use
          instead:
        </TypographyProse>
        <ToneAliases />
      </Section>

      <Section
        id="editorial"
        title="Editorial inks"
        note="Defined in theme.css and nowhere else. Skip that import and the marker tones, the secondary link colour and the accordion keyframes resolve to nothing, with no error. Two cuts each, the same shape as the status hues above: the fill is a mark and the ink is the same hue as words. The ink is -ink; these eight shipped under -foreground until that was corrected, and the old spelling still resolves, so the lint rules are what stop it surviving the rename."
      >
        <TokenGrid tokens={EDITORIAL} />
        <TypographyProse className="mt-6">
          All eight are registered as Tailwind colours, so{" "}
          <TypographyInlineCode>bg-fern</TypographyInlineCode> and{" "}
          <TypographyInlineCode>text-fern-ink</TypographyInlineCode> work
          anywhere. Four of them —{" "}
          <TypographyInlineCode>ochre</TypographyInlineCode>,{" "}
          <TypographyInlineCode>terracotta</TypographyInlineCode>,{" "}
          <TypographyInlineCode>sage</TypographyInlineCode> and{" "}
          <TypographyInlineCode>fig</TypographyInlineCode> — are also{" "}
          <TypographyHighlight tone="ochre">
            marker highlight
          </TypographyHighlight>{" "}
          tones. The palette carries emphasis and identity, never status, so
          there is no <TypographyInlineCode>warn</TypographyInlineCode>,{" "}
          <TypographyInlineCode>info</TypographyInlineCode> or{" "}
          <TypographyInlineCode>destructive</TypographyInlineCode> hue here, and
          nothing in it tones a control — a{" "}
          <TypographyInlineCode>Button</TypographyInlineCode> reads the seven.
        </TypographyProse>

        <Demo source="app/_demos/editorial-inks.tsx" className="mt-6">
          <EditorialInks />
        </Demo>
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
        <Callout
          tone="warn"
          title="The dark variant is bound to a class, not the OS"
          className="mt-6"
        >
          <TypographyInlineCode>tokens.css</TypographyInlineCode> declares{" "}
          <TypographyInlineCode>@custom-variant dark</TypographyInlineCode>{" "}
          against <TypographyInlineCode>.dark</TypographyInlineCode>. Without
          that import, Tailwind v4 follows{" "}
          <TypographyInlineCode>prefers-color-scheme</TypographyInlineCode>{" "}
          instead and quietly ignores your toggle.
        </Callout>
      </Section>

      <Section
        id="editorial-surface"
        title="The .editorial surface"
        note="Assigns the heading role to the serif, drops the heading weight to 400, and retunes the heading ladder. Heading sizes are a ratio to the body text beneath them, and the two surfaces set body at different sizes: 13px in the product, 18px on .editorial."
      >
        <div className="mt-4">
          <Code
            code={`<div className="editorial">…</div>   {/* or on <html> for an editorial site */}`}
          />
        </div>
        <TypographyProse className="mt-4">
          The switch in the header applies it to{" "}
          <TypographyInlineCode>&lt;html&gt;</TypographyInlineCode>. Turn it on
          and revisit the typography page: the heading sizes move, the body size
          stays put.
        </TypographyProse>
      </Section>
    </WithToc>
  );
}
