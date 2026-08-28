import type { Metadata } from "next";
import { TypographyProse, TypographyInlineCode } from "@supertype/foundations";
import { Callout } from "@supertype/foundations/blocks";
import { Demo } from "../_components/demo";
import { Section } from "../_components/section";
import { PageTitle } from "../_components/site-header";
import { WithToc } from "../_components/toc";
import { Code } from "../_components/code";
import Headings from "../_demos/headings";
import Body from "../_demos/body";
import Meta from "../_demos/meta";
import Stats from "../_demos/stats";
import Links from "../_demos/links";

export const metadata: Metadata = { title: "Typography" };

const SECTIONS = [
  { id: "headings", label: "Headings" },
  { id: "body", label: "Body copy" },
  { id: "meta", label: "Meta and labels" },
  { id: "stats", label: "Stats, code, highlight" },
  { id: "links", label: "Links" },
  { id: "your-own", label: "Your own element" },
];

export default function TypographyPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Reference"
        title="Typography"
        lede="You pick a role and the type ramp picks the size. .editorial retunes all four heading sizes together, so turn on the editorial switch above to see what a component does on the other surface."
      />

      <Section
        id="headings"
        title="Headings"
        note={
          <>
            <TypographyInlineCode>variant=&quot;display&quot;</TypographyInlineCode> is for a
            heading that has to outrank the same level elsewhere, like a landing page against
            the docs. <TypographyInlineCode>divider</TypographyInlineCode> is a separate prop
            so you can pick a size without also committing to a border.
          </>
        }
      >
        <Demo source="app/_demos/headings.tsx">
          <Headings />
        </Demo>
      </Section>

      <Section
        id="body"
        title="Body copy"
        note={
          <>
            <TypographyInlineCode>TypographyMuted</TypographyInlineCode> pins{" "}
            <TypographyInlineCode>tone</TypographyInlineCode> to muted and drops the prop from
            its type, so{" "}
            <TypographyInlineCode>{`<TypographyMuted tone="default">`}</TypographyInlineCode>{" "}
            will not compile. Use <TypographyInlineCode>TypographyP</TypographyInlineCode> when
            you need to set the tone yourself.
          </>
        }
      >
        <Demo source="app/_demos/body.tsx">
          <Body />
        </Demo>
      </Section>

      <Section
        id="meta"
        title="Meta and labels"
        note="Labels and captions share one size scale, because they usually appear together as a key and its value. Setting them at different sizes is almost always a mistake."
      >
        <Demo source="app/_demos/meta.tsx">
          <Meta />
        </Demo>
      </Section>

      <Section
        id="stats"
        title="Stats, code, highlight"
        note="The card, panel and page stat sizes ride the heading ladder, so a stat retunes along with the heading next to it on an editorial surface. Keep figures tabular anywhere the number updates in place; a headline figure looks better proportional."
      >
        <Demo source="app/_demos/stats.tsx">
          <Stats />
        </Demo>
      </Section>

      <Section
        id="links"
        title="Links"
        note="The href decides whether a link is internal or external, so call sites cannot get it wrong. Anything with a scheme renders a plain anchor and opens in a new tab with rel=noopener; everything else routes through next-view-transitions."
      >
        <Demo source="app/_demos/links.tsx">
          <Links />
        </Demo>
      </Section>

      <Section id="your-own" title="Rendering your own element">
        <TypographyProse className="mt-3">
          Two options, depending on whether you need a different tag or a different component.
        </TypographyProse>
        <div className="mt-4">
          <Code
            code={`// A different tag: the classes stay the same
<TypographyEyebrow as="h2">Pricing</TypographyEyebrow>

// A different component: take the classes as a string
<motion.h2 layoutId={id} className={cn(headingClass(), "text-2xl")}>
<Dialog.Title className={eyebrowClass("label")}>`}
          />
        </div>
        <Callout tone="accent" density="editorial" title="Please use one of these two" className="mt-6">
          Hand-rolling <TypographyInlineCode>text-sm font-medium</TypographyInlineCode> works
          until someone changes the ramp. Last time we ended up with five slightly different
          copies of the heading styles.
        </Callout>
      </Section>
    </WithToc>
  );
}
