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
        lede="Pick a role and the ramp sets the size. Use the editorial switch above to see any component on the other surface — .editorial retunes all four heading sizes together."
      />

      <Section
        id="headings"
        title="Headings"
        note={
          <>
            <TypographyInlineCode>variant=&quot;display&quot;</TypographyInlineCode> sets a
            larger size at the same level, for a landing page heading that should outrank the
            docs. <TypographyInlineCode>divider</TypographyInlineCode> adds a rule underneath.
            The two props are independent.
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
            <TypographyInlineCode>tone</TypographyInlineCode> to muted and removes the prop
            from its type:{" "}
            <TypographyInlineCode>{`<TypographyMuted tone="default">`}</TypographyInlineCode>{" "}
            is a type error. Use <TypographyInlineCode>TypographyP</TypographyInlineCode> to
            set the tone yourself.
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
        note="Labels and captions share one size scale. They typically appear together as a key and its value, so match their sizes."
      >
        <Demo source="app/_demos/meta.tsx">
          <Meta />
        </Demo>
      </Section>

      <Section
        id="stats"
        title="Stats, code, highlight"
        note="The card, panel and page sizes ride the heading ladder, so a stat retunes with the heading beside it on an editorial surface. Use tabular figures wherever the number updates in place, and proportional for a headline figure."
      >
        <Demo source="app/_demos/stats.tsx">
          <Stats />
        </Demo>
      </Section>

      <Section
        id="links"
        title="Links"
        note="An href with a scheme renders a plain anchor and opens in a new tab with rel=noopener. Everything else routes through next-view-transitions. The decision comes from the href, not from the call site."
      >
        <Demo source="app/_demos/links.tsx">
          <Links />
        </Demo>
      </Section>

      <Section id="your-own" title="Rendering your own element">
        <TypographyProse className="mt-3">
          Two options, depending on whether you need a different tag or a different
          component.
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
        <Callout tone="accent" density="editorial" title="Use one of these two" className="mt-6">
          Hand-rolled <TypographyInlineCode>text-sm font-medium</TypographyInlineCode> stops
          matching the moment the ramp changes. The last time these were written by hand, the
          codebase collected five slightly different copies of the heading styles.
        </Callout>
      </Section>
    </WithToc>
  );
}
