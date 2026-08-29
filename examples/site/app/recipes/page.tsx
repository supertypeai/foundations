import type { Metadata } from "next";
import { TypographyProse, TypographyInlineCode } from "@supertype.ai/foundations";
import { Callout } from "@supertype.ai/foundations/blocks";
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
import { pageMetadata } from "../_components/seo";

export const metadata: Metadata = pageMetadata("recipes");

/** The three files that wire the MDX map up. Nothing to preview — this is config. */
const MDX_COMPONENTS = `// mdx-components.tsx — the file convention @next/mdx calls with no arguments
import type { MDXComponents } from "mdx/types";
import { proseMdxComponents } from "@supertype.ai/foundations/mdx";

export function useMDXComponents(): MDXComponents {
  return proseMdxComponents as MDXComponents;
}`;

const MDX_SOURCE_CONFIG = `// source.config.ts — runs in bare Node, so it must not reach React
import { rehypeProseCode } from "@supertype.ai/foundations/rehype";

export default defineConfig({
  mdxOptions: { rehypePlugins: [rehypeProseCode] },
});`;

const MDX_ARTICLE = `// app/notes/[slug]/page.tsx — the article shell around compiled MDX
import { extractHeadings, readingTime, EssayHeader, EssayColumns,
         ReadingRail, PostMetaRow, PostDate, ReadTime, TagPills,
         MetaDot } from "@supertype.ai/foundations/essay";

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
        lede="Whole pages, not single components. Each recipe is a complete file importing only from the package, so it compiles as soon as you paste it into your app."
      />

      <Callout
        tone="accent"
        density="editorial"
        title="The code tab is the file itself"
        className="mt-8"
      >
        Each recipe is read off disk at build time, from the same file that rendered the
        preview beside it. The code you copy is the code that ran.
      </Callout>

      <Section
        id="marketing-hero"
        title="Marketing hero"
        note="An eyebrow, a display heading, a lede and a feature grid. The file sets layout only — every size, weight and colour comes from the ramp, so it renders correctly on both surfaces with no conditional."
      >
        <Demo source="app/_recipes/marketing-hero.tsx" className="p-0">
          <MarketingHero />
        </Demo>
      </Section>

      <Section
        id="stat-panel"
        title="Metrics panel"
        note="Tabular figures wherever a value updates in place, proportional for the headline. The panel size rides the heading ladder, so these stats retune with the headings beside them."
      >
        <Demo source="app/_recipes/stat-panel.tsx">
          <StatPanel />
        </Demo>
      </Section>

      <Section
        id="pricing"
        title="Pricing tiers"
        note={
          <>
            Each tier&apos;s feature list uses{" "}
            <TypographyInlineCode>{`TypographyList variant="ui"`}</TypographyInlineCode> to
            match the 13px card copy around it. The prose variant would set the bullets at
            reading size and put two body sizes on one surface.
          </>
        }
      >
        <Demo source="app/_recipes/pricing.tsx" className="p-0">
          <Pricing />
        </Demo>
      </Section>

      <Section
        id="docs-page"
        title="Docs page"
        note="Steps, a callout, a prose list and an FAQ, shipping no JavaScript. The FAQ uses Disclosure, which works before hydration. Switch to Accordion when you need animation or managed selection."
      >
        <Demo source="app/_recipes/docs-page.tsx" className="p-0">
          <DocsPage />
        </Demo>
      </Section>

      <Section
        id="post-index"
        title="Article index"
        note="The meta row is what pulls /essay into a listing page. PostDate formats through formatPostDate, the same function to call when generating an OG image, so a card and its social preview print the same date."
      >
        <Demo source="app/_recipes/post-index.tsx" className="p-0">
          <PostIndex />
        </Demo>
      </Section>

      <Section
        id="mdx"
        title="An MDX article"
        note="Three files, no preview: this is configuration rather than markup. The article shell composes the essay pieces individually, since its sections come from the markdown headings."
      >
        <TypographyProse className="mt-4">
          First the element map. It is a plain object — the router and the image component
          ship with the package, so there is nothing to inject.
        </TypographyProse>
        <div className="mt-4">
          <Code code={MDX_COMPONENTS} />
        </div>

        <TypographyProse className="mt-6">
          Then the code fences. <TypographyInlineCode>rehypeProseCode</TypographyInlineCode>{" "}
          writes <TypographyInlineCode>--shiki-light</TypographyInlineCode> and{" "}
          <TypographyInlineCode>--shiki-dark</TypographyInlineCode> on every token rather than
          a fixed colour. One compiled document then serves both themes, with{" "}
          <TypographyInlineCode>shiki.css</TypographyInlineCode> selecting which applies.
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
          where React cannot be resolved. The plugin ships from its own entry point so it can
          be imported there.
        </Callout>
      </Section>
    </WithToc>
  );
}
