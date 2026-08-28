import type { Metadata } from "next";
import { TypographyProse, TypographyInlineCode } from "@supertype/foundations";
import { Callout } from "@supertype/foundations/blocks";
import { Demo } from "../_components/demo";
import { Section } from "../_components/section";
import { WithToc } from "../_components/toc";
import { PageTitle } from "../_components/site-header";
import { Code } from "../_components/code";
import MarketingHero from "../_recipes/marketing-hero";
import StatPanel from "../_recipes/stat-panel";
import Pricing from "../_recipes/pricing";
import DocsPage from "../_recipes/docs-page";
import PostIndex from "../_recipes/post-index";

export const metadata: Metadata = { title: "Recipes" };

/** The three files that wire the MDX map up. Nothing to preview — this is config. */
const MDX_COMPONENTS = `// mdx-components.tsx — the file convention @next/mdx calls with no arguments
import type { MDXComponents } from "mdx/types";
import { proseMdxComponents } from "@supertype/foundations/mdx";

export function useMDXComponents(): MDXComponents {
  return proseMdxComponents as MDXComponents;
}`;

const MDX_SOURCE_CONFIG = `// source.config.ts — runs in bare Node, so it must not reach React
import { rehypeProseCode } from "@supertype/foundations/rehype";

export default defineConfig({
  mdxOptions: { rehypePlugins: [rehypeProseCode] },
});`;

const MDX_ARTICLE = `// app/notes/[slug]/page.tsx — the article shell around compiled MDX
import { extractHeadings, readingTime, EssayHeader, EssayColumns,
         ReadingRail, PostMetaRow, PostDate, ReadTime, TagPills,
         MetaDot } from "@supertype/foundations/essay";

const headings = extractHeadings(source);   // TocHeading[] — { id, label, depth }
const minutes = readingTime(source);        // words / 200, rounded up

<EssayHeader eyebrow="Notes" title={frontmatter.title} />
<EssayColumns aside={<div className="sticky top-24"><ReadingRail headings={headings} /></div>}>
  <PostMetaRow>
    <PostDate date={frontmatter.date} format="long" />
    <MetaDot />
    <ReadTime minutes={minutes} />
    <MetaDot />
    <TagPills tags={frontmatter.tags} />
  </PostMetaRow>
  {content}
</EssayColumns>`;

const SECTIONS = [
  { id: "marketing-hero", label: "Marketing hero" },
  { id: "stat-panel", label: "Metrics panel" },
  { id: "pricing", label: "Pricing tiers" },
  { id: "docs-page", label: "Docs page" },
  { id: "post-index", label: "Article index" },
  { id: "mdx", label: "An MDX article" },
];

export default function RecipesPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Copy and paste"
        title="Recipes"
        lede="Whole pages rather than single components. Each one is a complete file that only imports from the package, so you can copy it into your app and it will compile."
      />

      <Callout
        tone="accent"
        density="editorial"
        title="The code tab is the file itself"
        className="mt-8"
      >
        Each recipe is read off disk at build time, from the same file that rendered the
        preview next to it. There is no second copy to go stale.
      </Callout>

      <Section
        id="marketing-hero"
        title="Marketing hero"
        note="An eyebrow, a display heading, a lede and a feature grid. The file only decides layout; every size, weight and colour comes from the ramp, so it reads correctly on both surfaces without a conditional."
      >
        <Demo source="app/_recipes/marketing-hero.tsx" className="p-0">
          <MarketingHero />
        </Demo>
      </Section>

      <Section
        id="stat-panel"
        title="Metrics panel"
        note="Tabular figures wherever a value updates in place, proportional for the headline. The panel size rides the heading ladder, so these stats retune along with the headings next to them."
      >
        <Demo source="app/_recipes/stat-panel.tsx">
          <StatPanel />
        </Demo>
      </Section>

      <Section
        id="pricing"
        title="Pricing tiers"
        note="The list inside each tier uses the ui variant. It sits next to 13px card copy, and reading-size bullets there would put two different body sizes on the same surface."
      >
        <Demo source="app/_recipes/pricing.tsx" className="p-0">
          <Pricing />
        </Demo>
      </Section>

      <Section
        id="docs-page"
        title="Docs page"
        note="Steps, a callout, a prose list and an FAQ, and it ships no JavaScript. The FAQ uses Disclosure rather than Accordion, so it works before hydration. Use Accordion when you need animation or managed selection."
      >
        <Demo source="app/_recipes/docs-page.tsx" className="p-0">
          <DocsPage />
        </Demo>
      </Section>

      <Section
        id="post-index"
        title="Article index"
        note="The meta row is the reason to import from /essay here. PostDate uses formatPostDate, the same function an OG image would call, so a card and its social preview cannot print different dates."
      >
        <Demo source="app/_recipes/post-index.tsx" className="p-0">
          <PostIndex />
        </Demo>
      </Section>

      <Section
        id="mdx"
        title="An MDX article"
        note="Three files and no preview, since this is configuration rather than markup. The article shell composes the essay pieces individually, because its sections come from the markdown headings."
      >
        <TypographyProse className="mt-4">
          First the element map. It is a plain object: the router and the image component
          come from the package, so there is nothing to inject.
        </TypographyProse>
        <div className="mt-4">
          <Code code={MDX_COMPONENTS} />
        </div>

        <TypographyProse className="mt-6">
          Then the code fences. <TypographyInlineCode>rehypeProseCode</TypographyInlineCode>{" "}
          writes <TypographyInlineCode>--shiki-light</TypographyInlineCode> and{" "}
          <TypographyInlineCode>--shiki-dark</TypographyInlineCode> on every token instead of a
          fixed colour, so one compiled document works in both themes and{" "}
          <TypographyInlineCode>shiki.css</TypographyInlineCode> picks which one applies.
        </TypographyProse>
        <div className="mt-4">
          <Code lang="typescript" code={MDX_SOURCE_CONFIG} />
        </div>

        <TypographyProse className="mt-6">
          Then the page around the compiled content.
        </TypographyProse>
        <div className="mt-4">
          <Code code={MDX_ARTICLE} />
        </div>

        <Callout tone="warn" title="Import rehypeProseCode from /rehype, not the root" className="mt-6">
          <TypographyInlineCode>source.config.ts</TypographyInlineCode> runs in plain Node,
          where React cannot be resolved. That is why the plugin has its own entry point.
        </Callout>
      </Section>
    </WithToc>
  );
}
