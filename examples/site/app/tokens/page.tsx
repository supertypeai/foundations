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
import { ContrastHeadline, ContrastProof } from "../_components/contrast-proof";
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

/** Status, plus the one of them that really is a label on a fill. `TokenGrid`
 *  asks the package which is which. */
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
  { id: "measuring", label: "Two measures" },
  { id: "repaint", label: "Repainting" },
  { id: "editorial-classname", label: "The .editorial classname" },
];

export default function TokensPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Reference"
        title="Tokens and theming"
        lede="The package defines structural roles and leaves brand colours to your app. Every swatch below reads its colour through a variable, so the dark switch in the header re-points all of them at once."
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
        note="Three cuts each, and no exceptions left: the fill is a mark at 3:1, the ink is words on the page at 4.5:1, and the -foreground is the label printed on the fill at 4.5:1 against it. warn and success gained that third cut when a filled status button turned out to be a real thing rendering white on amber at 2.44:1. danger ships as an ink only."
      >
        <TokenGrid tokens={SIGNALS} />
      </Section>

      <Section
        id="tones"
        title="The seven tones"
        note="Buttons, badges, callouts, links and tab markers all read colour off one list. A tone earns its place by having a token of its own: seven tones, seven tokens, one for one. That rule is what keeps a design system from growing forty names for six colours."
      >
        <ToneLedger />
        <TypographyProse className="mt-6">
          Three cuts per tone. A fill is a mark and clears 3:1; an ink is read
          and clears 4.5:1.
        </TypographyProse>
        <TypographyProse className="mt-4">
          <TypographyInlineCode>brand</TypographyInlineCode> belongs to your
          project, so it ships undefined and falls back to{" "}
          <TypographyInlineCode>--primary</TypographyInlineCode>. An app that
          has yet to pick an identity colour gets its principal one.
        </TypographyProse>

        <TypographyH3 className="mt-10">
          <TypographyInlineCode>tone</TypographyInlineCode> over raw tailwind
          classes
        </TypographyH3>
        <TypographyProse className="mt-2">
          A tone is a prop. Passing one sets{" "}
          <TypographyInlineCode>--tone-fill</TypographyInlineCode>,{" "}
          <TypographyInlineCode>--tone-ink</TypographyInlineCode> and{" "}
          <TypographyInlineCode>--tone-hue</TypographyInlineCode> on the
          element. A solid button is then{" "}
          <TypographyInlineCode>
            bg-(--tone-fill) text-(color:--tone-ink)
          </TypographyInlineCode>{" "}
          whatever the tone is. Five components take the prop:{" "}
          <TypographyInlineCode>Button</TypographyInlineCode>,{" "}
          <TypographyInlineCode>Badge</TypographyInlineCode>,{" "}
          <TypographyInlineCode>Callout</TypographyInlineCode>,{" "}
          <TypographyInlineCode>TypographyLink</TypographyInlineCode> and{" "}
          <TypographyInlineCode>TabsList</TypographyInlineCode>.
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
          To tone something of your own, spend the same variables directly.{" "}
          <TypographyInlineCode>toneClass</TypographyInlineCode> declares them
          on any element:
        </TypographyProse>
        <div className="mt-4">
          <Code
            code={`<div className={cn(toneClass("brand"), "bg-(--tone-wash)")}>
  Your own surface, painted from the same seven.
</div>`}
          />
        </div>
        <TypographyProse className="mt-2">
          Reach for one of these and you get a type error at the call site. The
          tone to use instead:
        </TypographyProse>
        <ToneAliases />
      </Section>

      <Section
        id="editorial"
        title="Editorial inks"
        note="Defined in theme.css alone. Skip that import and the marker tones, the secondary link colour and the accordion keyframes resolve to nothing, silently. Two cuts each, the same shape as the status hues above: the fill is a mark, the ink is the same hue as words. The suffix is -ink; these eight shipped under -foreground until the rename, and the old spelling still resolves, so the lint rules are what retire it."
      >
        <TokenGrid tokens={EDITORIAL} />
        <TypographyProse className="mt-6">
          All eight are registered as Tailwind colours, so{" "}
          <TypographyInlineCode>bg-fern</TypographyInlineCode> and{" "}
          <TypographyInlineCode>text-fern-ink</TypographyInlineCode> work
          anywhere. Four of them,{" "}
          <TypographyInlineCode>ochre</TypographyInlineCode>,{" "}
          <TypographyInlineCode>terracotta</TypographyInlineCode>,{" "}
          <TypographyInlineCode>sage</TypographyInlineCode> and{" "}
          <TypographyInlineCode>fig</TypographyInlineCode>, double as{" "}
          <TypographyHighlight tone="ochre">
            marker highlight
          </TypographyHighlight>{" "}
          tones. The palette carries emphasis and identity, which is why it
          stops short of a <TypographyInlineCode>warn</TypographyInlineCode>,{" "}
          <TypographyInlineCode>info</TypographyInlineCode> or{" "}
          <TypographyInlineCode>destructive</TypographyInlineCode> hue.
        </TypographyProse>

        <Demo source="app/_demos/editorial-inks.tsx" className="mt-6">
          <EditorialInks />
        </Demo>
      </Section>

      <Section
        id="measuring"
        title="Two measures"
        note="WCAG is a ratio and APCA is a signed lightness contrast. The first gives us a pass/fail, and the second gives us a number to tune the ramp."
      >
        <ContrastHeadline />

        <TypographyProse className="mt-6">
          A WCAG ratio treats both directions the same, but in practice a dark
          theme tuned to match its light theme&rsquo;s numbers can still feel
          harder to read. A 4.5:1 ratio of black on white is crisp and easy to
          read; white on black is often thinner and more tiring. APCA lightness
          contrast uses two formulas, so it gives separate answers for light
          text on dark backgrounds and dark text on light backgrounds.
        </TypographyProse>

        <ContrastProof show="both" className="mt-6" />

        <TypographyProse className="mt-6">
          The difference is easy to see. Both samples clear WCAG AA at 4.5:1.
          The two columns below show this site&rsquo;s own contrast ramp from
          the active stylesheet. In the light theme, the ladder moves by 19 and
          then 20 Lc, which gives the even progression you wanted. In the dark
          theme, it moves by 18 and then 30, so its tertiary ink lands at 47.8
          Lc compared with 59.5 in the light theme.
          <br />
          That comes out to 6.75:1 versus 3.44:1. On raw contrast ratio, the
          dark step looks safer, even though the WCAG numbers are much closer.
        </TypographyProse>

        <TypographyH3 className="mt-10">
          What <TypographyInlineCode>Lc</TypographyInlineCode> actually computes
        </TypographyH3>
        <TypographyProse className="mt-2">
          <TypographyInlineCode>Lc</TypographyInlineCode> is the APCA lightness
          contrast score that WCAG 3 is based on. It starts with screen
          luminance measured against a perceptual curve, with a soft clamp near
          full-black where the model stops matching human perception. What
          matters here is that there are{" "}
          <TypographyHighlight tone="ochre">
            two different exponent pairs, one for each polarity
          </TypographyHighlight>
          . That asymmetry is why APCA works better than a single ratio when you
          are tuning a theme: a ratio uses one formula and gives one answer
          regardless of direction.
        </TypographyProse>
        <div className="mt-4">
          <Code
            code={`const s = yBackground > yText
  ? (yBackground ** 0.56 - yText ** 0.57) * 1.14   // dark text, light ground
  : (yBackground ** 0.65 - yText ** 0.62) * 1.14;  // light text, dark ground`}
          />
        </div>
        <TypographyProse className="mt-4">
          <TypographyInlineCode>Lc</TypographyInlineCode> is unbounded and
          signed, and <TypographyInlineCode>lc</TypographyInlineCode> returns
          the absolute value. The practical question at a call site is whether
          the text is legible, and the sign only tells you which direction the
          contrast is running.
        </TypographyProse>

        <TypographyH3 className="mt-10">What measures to use?</TypographyH3>
        <TypographyProse className="mt-2">
          Ratios are for compliance;{" "}
          <TypographyInlineCode>Lc</TypographyInlineCode> is for the ramp. An
          audit asks for AA, and that&apos;s what{" "}
          <TypographyInlineCode>checkLegibility</TypographyInlineCode> and{" "}
          <TypographyInlineCode>checkSignals</TypographyInlineCode> enforce:
          4.5:1 for readable text, 3:1 for a mark. If your secondary ink feels a
          bit quieter than the primary, and it stays that way in dark mode,
          that&apos;s an <TypographyInlineCode>Lc</TypographyInlineCode>{" "}
          question.
        </TypographyProse>
        <div className="mt-4">
          <Code
            code={`import { contrast, lc, parseColor, resolveTokens }
  from "@supertype.ai/foundations/contrast";

const tokens = resolveTokens(css, "dark");
const ink = parseColor(tokens["--muted-foreground"])!;
const page = parseColor(tokens["--background"])!;

contrast(ink, page);  // 4.79  — passes AA, says nothing about the ramp
lc(ink, page);        // 34.6  — the number that would have caught it`}
          />
        </div>
        <TypographyProse className="mt-4">
          The floors are yours to set, in your own suite. Legibility is contrast
          times size, and a dense product spending 13px wants more headroom than
          an essay set at 18px. The package gives you that measurement both ways
          round, from the stylesheet you ship.
        </TypographyProse>

        <Callout
          tone="secondary"
          title="Both run against the cascade, not the file"
          className="mt-6"
        >
          <TypographyInlineCode>resolveTokens</TypographyInlineCode> scores
          selectors before it answers, so a{" "}
          <TypographyInlineCode>.dark</TypographyInlineCode> block that ties
          with a later <TypographyInlineCode>:root</TypographyInlineCode> is
          measured the way a browser would paint it. Read the two blocks
          separately and you measure an intention, which is how a theme once
          tested at a healthy 15.7:1 while the page rendered white on white.
        </Callout>
      </Section>

      <Section
        id="repaint"
        title="Repainting"
        note="Override the raw variables after the imports, and leave the utility classes alone. The package owns its classnames, so patching them costs you the single point of control."
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
          against <TypographyInlineCode>.dark</TypographyInlineCode>. Drop that
          import and Tailwind v4 falls back to{" "}
          <TypographyInlineCode>prefers-color-scheme</TypographyInlineCode>,
          leaving your toggle inert.
        </Callout>
      </Section>

      <Section
        id="editorial-classname"
        title="The .editorial classname"
        note="Hands the heading role to the serif, drops the heading weight to 400, and retunes the ladder. Heading sizes are a ratio to the body text beneath them, and the two surfaces set body differently: 13px in the product, 18px on .editorial."
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
