"use client";

import { TabGroup } from "@supertype.ai/foundations/blocks";

import { Icons } from "../_components/icons";

export default function TabsDemo() {
  return (
    // Two variants of one component, not two ways to draw a tab strip. Composing
    // Tabs/TabsList/TabsTrigger/TabsContent by hand renders exactly this, which is
    // why it is not shown here: a demo that draws the same strip twice reads as a
    // choice, and there isn't one to make.
    <div className="space-y-8">
      {/* default: the boxed segmented track. */}
      <TabGroup
        tabs={[
          { value: "npm", label: "npm", content: "npx foundations doctor" },
          { value: "pnpm", label: "pnpm", content: "pnpm dlx foundations doctor" },
          { value: "yarn", label: "yarn", content: "yarn foundations doctor" },
        ]}
      />

      {/* line: no surface, a toned underline, and room for an icon. The tone inks
          the underline and the active tab's icon; labels stay in the page's ink. */}
      <TabGroup
        variant="line"
        tone="brand"
        defaultValue="speakers"
        tabs={[
          {
            value: "gallery",
            label: "Gallery",
            icon: <Icons.Award />,
            content: "An icon sits in the label's own gap rather than being margined onto it.",
          },
          {
            value: "speakers",
            label: "Speakers",
            icon: <Icons.Mic />,
            content: "The active tab's icon takes the list's tone — the same seven a Button has.",
          },
          { value: "venue", label: "Venue", content: "An icon is optional, per tab." },
        ]}
      />
    </div>
  );
}
