"use client";

import { useState } from "react";

import { TabGroup, type TabItem } from "@supertype.ai/foundations/blocks";

import { Icons } from "../_components/icons";

type Range = "7d" | "30d" | "90d";

const RANGES: readonly TabItem<Range>[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
];

export default function TabsDemo() {
  const [range, setRange] = useState<Range>("30d");
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

      {/* No content: a picker, compact for a toolbar. The values' type flows to setRange, so no cast. */}
      <TabGroup
        size="sm"
        value={range}
        onValueChange={setRange}
        tabs={RANGES}
      />
    </div>
  );
}
