"use client";

import { TypographyProse } from "@supertype/foundations";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabGroup,
  Tab,
} from "@supertype/foundations/blocks";

export default function TabsDemo() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="people">
        <TabsList>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="people">
          <TypographyProse>The boxed segmented track — the default.</TypographyProse>
        </TabsContent>
        <TabsContent value="revenue">
          <TypographyProse>Selection is managed, so this is a client component.</TypographyProse>
        </TabsContent>
      </Tabs>

      {/* The shorthand an MDX author writes as <Tabs>. Children pair with
          `items` by position. */}
      <TabGroup items={["npm", "pnpm", "yarn"]}>
        <Tab value="npm">npx foundations doctor</Tab>
        <Tab value="pnpm">pnpm dlx foundations doctor</Tab>
        <Tab value="yarn">yarn foundations doctor</Tab>
      </TabGroup>
    </div>
  );
}
