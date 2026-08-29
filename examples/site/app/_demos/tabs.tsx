"use client";

import { TypographyProse } from "@supertype.ai/foundations";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabGroup,
  Tab,
} from "@supertype.ai/foundations/blocks";

export default function TabsDemo() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="people">
        <TabsList>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="people">
          <TypographyProse>The default variant: a boxed segmented track.</TypographyProse>
        </TabsContent>
        <TabsContent value="revenue">
          <TypographyProse>
            Selection is managed state, so Tabs is a client component.
          </TypographyProse>
        </TabsContent>
      </Tabs>

      {/* TabGroup is the MDX shorthand. Children pair with `items` by position. */}
      <TabGroup items={["npm", "pnpm", "yarn"]}>
        <Tab value="npm">npx foundations doctor</Tab>
        <Tab value="pnpm">pnpm dlx foundations doctor</Tab>
        <Tab value="yarn">yarn foundations doctor</Tab>
      </TabGroup>
    </div>
  );
}
