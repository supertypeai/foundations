import type { Metadata } from "next";
import { TypographyInlineCode } from "@supertype/foundations";
import { Demo } from "../_components/demo";
import { Section } from "../_components/section";
import { PageTitle } from "../_components/site-header";
import { WithToc } from "../_components/toc";
import CardDemo from "../_demos/cards";
import Callouts from "../_demos/callouts";
import StepsDemo from "../_demos/steps";
import TabsDemo from "../_demos/tabs";
import AccordionDemo from "../_demos/accordion";
import DisclosureDemo from "../_demos/disclosure";

export const metadata: Metadata = { title: "Blocks" };

const SECTIONS = [
  { id: "card", label: "Card" },
  { id: "callout", label: "Callout" },
  { id: "steps", label: "Steps" },
  { id: "disclosure", label: "Disclosure" },
  { id: "accordion", label: "Accordion" },
  { id: "tabs", label: "Tabs" },
];

export default function BlocksPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Reference"
        title="Blocks"
        lede="Content blocks from @supertype/foundations/blocks. Tabs and Accordion are Base UI clients; the rest render on the server."
      />

      <Section
        id="card"
        title="Card"
        note="Pass title and description for the common case, or compose the slots yourself when you need more. Adding an href turns the whole card into a link, and an href with a scheme opens in a new tab."
      >
        <Demo source="app/_demos/cards.tsx">
          <CardDemo />
        </Demo>
      </Section>

      <Section
        id="callout"
        title="Callout"
        note={
          <>
            <TypographyInlineCode>compact</TypographyInlineCode> is the product form, sized to
            sit inside a panel. <TypographyInlineCode>editorial</TypographyInlineCode> sets its
            body at reading size and adds an accent rail, which suits a docs page better.
          </>
        }
      >
        <Demo source="app/_demos/callouts.tsx">
          <Callouts />
        </Demo>
      </Section>

      <Section
        id="steps"
        title="Steps"
        note="The numbers come from a CSS counter rather than markup, so reordering the steps renumbers them, and the digits stay out of the accessibility tree and out of anything you copy."
      >
        <Demo source="app/_demos/steps.tsx">
          <StepsDemo />
        </Demo>
      </Section>

      <Section
        id="disclosure"
        title="Disclosure"
        note="A <details> element, so it works without JavaScript and is correct before hydration. Single-open mode uses the shared name attribute that browsers implement natively, which costs no state."
      >
        <Demo source="app/_demos/disclosure.tsx">
          <DisclosureDemo />
        </Demo>
      </Section>

      <Section
        id="accordion"
        title="Accordion"
        note="Reach for this when you need animation or managed selection; otherwise Disclosure is cheaper. It needs theme.css for its open and close keyframes, and without it the panels just snap open."
      >
        <Demo source="app/_demos/accordion.tsx">
          <AccordionDemo />
        </Demo>
      </Section>

      <Section
        id="tabs"
        title="Tabs"
        note="TabsList takes a variant: default draws a boxed segmented track, line drops the surface and marks the active tab with an underline. The preview and code switcher on this page uses line."
      >
        <Demo source="app/_demos/tabs.tsx">
          <TabsDemo />
        </Demo>
      </Section>
    </WithToc>
  );
}
