import type { Metadata } from "next";
import {
  TypographyInlineCode,
  TypographyLink,
  TypographyProse,
  TypographyList,
} from "@supertype.ai/foundations";
import { Callout } from "@supertype.ai/foundations/blocks";
import { Code } from "../_components/code";
import { Section } from "../_components/section";
import { PageTitle } from "../_components/site-header";
import { WithToc } from "../_components/toc";
import { pageMetadata } from "../_components/seo";

export const metadata: Metadata = pageMetadata("upgrading");

const SECTIONS = [
  { id: "command", label: "The upgrade command" },
  { id: "v0-4", label: "0.4: marks" },
  { id: "v0-4-one-way", label: "0.4: one way each" },
];

const COMMAND = `npx foundations upgrade --dry-run   # list what it would move
npx foundations upgrade             # move it
npx foundations upgrade src/app     # only these paths`;

const BEFORE_AFTER = `// 0.3
<TypographyCaption className="flex items-center gap-1">
  <Icons.Clock className="size-3" /> 44d ago
</TypographyCaption>

// 0.4
<TypographyCaption mark={<Icons.Clock />}>44d ago</TypographyCaption>`;

const code = (s: string) => <TypographyInlineCode>{s}</TypographyInlineCode>;

export default function UpgradingPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Reference"
        title="Upgrading"
        lede="What each release changes in your code, and the command that makes most of those changes for you."
      />

      <Section
        id="command"
        title="The upgrade command"
        note="Bump the package, then run upgrade from your app's root. It rewrites source written for an older version and lists what it could not move safely."
      >
        <div className="mt-4">
          <Code lang="bash" code={COMMAND} />
        </div>
        <TypographyProse className="mt-4">
          Each migration ships in the release that removed what it replaces,
          and changes nothing on code already migrated, so upgrade runs all of
          them and never needs to know the version you came from. It reads your{" "}
          {code(".tsx")} and {code(".jsx")} with your app&apos;s own TypeScript
          and edits exact ranges, so it leaves your formatting alone and a file
          it moves nothing in is not written at all. An import it needs joins
          your existing one from the package, or follows your last import, in
          your file&apos;s own quotes and semicolons.
        </TypographyProse>
        <Callout tone="primary" density="editorial" title="A clean tree first" className="mt-6">
          upgrade writes only when git has no uncommitted changes to tracked
          files, so {code("git diff")} shows exactly what it did and is the
          undo. {code("--force")} writes anyway. After it runs, your lint names
          anything left, and {code("npx foundations doctor")} stops counting
          files written for an older version.
        </Callout>
      </Section>

      <Section
        id="v0-4"
        title="0.4: marks"
        note="One way to put an icon, checkbox or dot beside words, in place of five. The slot seats every mark on the middle of the capitals, within half a pixel at any size, leading or zoom."
      >
        <div className="mt-4">
          <Code code={BEFORE_AFTER} />
        </div>

        <TypographyProse className="mt-6">Removed, and what replaces each:</TypographyProse>
        <TypographyList variant="prose" className="mt-2">
          <li>{code("ON_FIRST_LINE")}: the words&apos; {code("mark")} prop, or {code("<Marked mark title>")} for a title with lines under it.</li>
          <li>{code("ON_BASELINE")}: {code("items-baseline")} for words at two sizes, and the icon in the words&apos; {code("mark")}.</li>
          <li>{code("icon-inline")}, and the caption sizing a loose {code("svg")}: a glyph in a mark is one em of the words.</li>
          <li>{code("CAP_TRIM")} on a label beside an icon: the label&apos;s {code("mark")}. {code("CAP_TRIM")} stays for text centred in a box of its own, or beside an object taller than the line.</li>
          <li>{code("inline")} with {code("align-middle")} or a top margin on an icon: {code("<Mark>")} around it.</li>
        </TypographyList>

        <TypographyProse className="mt-6">What upgrade moves for you:</TypographyProse>
        <TypographyList variant="prose" className="mt-2">
          <li>a glyph first or last inside a text role into {code("mark")} or {code("markEnd")};</li>
          <li>a glyph beside a text role in a flex row into that role&apos;s {code("mark")}, unwrapping the row when nothing else is left in it;</li>
          <li>an inline glyph held with {code("align-middle")} or a top margin into {code("<Mark>")}, which it imports.</li>
        </TypographyList>

        <TypographyProse className="mt-6">
          What to check by hand afterwards: a glyph that took its colour from
          the row it left, words that a flex gap used to separate and now need
          a space, centred or right-aligned words, where an inline{" "}
          {code("<Mark>")} keeps the glyph beside them, and an avatar or
          anything else taller than the line, which is not a mark: the words
          centre on it with {code("CAP_TRIM")}.
        </TypographyProse>

        <TypographyProse className="mt-6">
          What looks different on purpose: every glyph beside words is one em of
          them, so caption icons grow from 0.8em and oversized ones shrink.
          Controls size a glyph that is their direct child, so one you wrap in
          an element of your own keeps the size you give it.{" "}
          {code("Badge")} no longer forces a 12px icon into its 10px size, and
          the design lint now flags a loose icon in a text role, a size class on
          a glyph in a mark or a control, and a glyph nudged into line. The{" "}
          <TypographyLink href="/typography#marks">Marks section</TypographyLink>{" "}
          shows every placement live.
        </TypographyProse>
      </Section>

      <Section
        id="v0-4-one-way"
        title="0.4: one way to do each thing"
        note="Every name this release removes was a second way to do something the package already did. Each has one spelling now."
      >
        <TypographyList variant="prose" className="mt-4">
          <li>{code("TypographySmall")}: {code("TypographyCaption")}, {code('as="small"')} for small print or {code('as="p"')} for a note. upgrade writes {code('as="p"')}, which keeps the block the old one rendered.</li>
          <li>{code("TypographyProseList")}: {code('<TypographyList variant="prose">')}. upgrade renames it.</li>
          <li>{code("Accordion")} and its three parts: {code("DisclosureGroup")} and {code("Disclosure")}, which now animate open and closed where the browser supports it. upgrade moves them, a literal {code("defaultValue")} included. Open state the app keeps is {code("open")} and {code("onToggle")} on each {code("Disclosure")}, which {code("<details>")} supports natively.</li>
          <li>{code("Tabs")}, {code("TabsList")}, {code("TabsTrigger")} and {code("TabsContent")}: {code("TabGroup")}, built with {code(".map")} when the tabs are data. From 0.4.1 a strip with no panels is a {code("TabGroup")} picker and a compact one is {code('size="sm"')}. upgrade moves them.</li>
          <li>{code("DISCLOSURE")}: {code("Disclosure")}, whose surfaces are its own.</li>
          <li>{code("INK_ON_CARD")}, {code("INK_ON_POPOVER")} and {code("INK_ON_SIDEBAR")}: {code('style={inkOnSurfaceStyle("--card-foreground")}')}, and the same for any surface. upgrade moves one in a className.</li>
        </TypographyList>

        <TypographyProse className="mt-6">
          upgrade marks each thing it could not move with a ✖ and the reason,
          and each move worth a second look with a !: a panel&apos;s spacing
          under {code("TabGroup")}, a glyph&apos;s colour. Take 0.4.1 or later,
          whose upgrade moves the accordions, tabs and inks that 0.4.0&apos;s
          left to you.
        </TypographyProse>

        <TypographyProse className="mt-6">
          What looks different on purpose: a {code("TypographyLink")} with no{" "}
          {code("tone")} takes the ink around it, which on a page is what{" "}
          {code("muted")} gave and on a filled surface is legible where{" "}
          {code("muted")} was not. Its {code("addArrow")} glyph is a mark, one
          em of the link.
        </TypographyProse>
      </Section>
    </WithToc>
  );
}
