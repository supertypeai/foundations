"use client";

import { TabGroup } from "@supertype.ai/foundations/blocks";

import { Icons } from "../_components/icons";

export default function TabsDemo() {
  return (
    <div className="space-y-8">
      {/* default: the boxed segmented track. */}
      <TabGroup
        tabs={[
          { value: "npm", label: "npm", content: "npx foundations doctor" },
          { value: "pnpm", label: "pnpm", content: "pnpm dlx foundations" },
          { value: "yarn", label: "yarn", content: "yarn foundations doctor" },
        ]}
      />

      {/* line: no surface, a toned underline, and room for an icon. */}
      <TabGroup
        variant="line"
        tone="brand"
        defaultValue="speakers"
        tabs={[
          {
            value: "gallery",
            label: "Gallery",
            icon: <Icons.Award />,
            content: "An icon sits in the label's own gap.",
          },
          {
            value: "speakers",
            label: "Speakers",
            icon: <Icons.Mic />,
            content: "The active icon takes the list's tone.",
          },
          { value: "venue", label: "Venue", content: "Icons are optional." },
        ]}
      />

      {/* No content: a picker, the strip alone, compact for a toolbar. */}
      <TabGroup
        size="sm"
        defaultValue="30d"
        tabs={[
          { value: "7d", label: "7d" },
          { value: "30d", label: "30d" },
          { value: "90d", label: "90d" },
        ]}
      />
    </div>
  );
}
