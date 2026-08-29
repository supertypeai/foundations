import type { Metadata } from "next";
import {
  TypographyInlineCode,
  TypographyLink,
  TypographyProse,
} from "@supertype.ai/foundations";
import { Callout } from "@supertype.ai/foundations/blocks";
import { Code } from "../_components/code";
import { Section } from "../_components/section";
import { PageTitle } from "../_components/site-header";
import { WithToc } from "../_components/toc";
import {
  LLMS_ENTRY_POINTS,
  LLMS_LINES,
  LLMS_SECTIONS,
  llmsSection,
} from "../_components/llms";
import { pageMetadata } from "../_components/seo";

export const metadata: Metadata = pageMetadata("agents");

const SECTIONS = [
  { id: "pointer", label: "The one line" },
  { id: "contents", label: "What is in the file" },
  { id: "fresh", label: "Why it cannot go stale" },
  { id: "lint", label: "The lint rules" },
  { id: "ci", label: "doctor in CI" },
];

const POINTER = `# CLAUDE.md, AGENTS.md, or your agent's equivalent

@node_modules/@supertype.ai/foundations/llms.txt`;

const ESLINT = `// eslint.config.js
import { designConfig } from "@supertype.ai/foundations/eslint";

export default [
  ...designConfig({ accents: "the brand tints", weights: true }),
];`;

const CI = `- run: npx foundations doctor`;

export default function AgentsPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Setup"
        title="Coding agents"
        lede="An agent writing against this package will hand-roll text-sm text-muted-foreground unless it knows a primitive exists. The package ships the summary that stops it, plus two mechanisms that catch what the summary misses."
      />

      <Section
        id="pointer"
        title="The one line"
        note={
          <>
            <TypographyInlineCode>llms.txt</TypographyInlineCode> installs alongside{" "}
            <TypographyInlineCode>dist/</TypographyInlineCode>. Reference it from whatever
            file your agent reads at the start of a session:
          </>
        }
      >
        <div className="mt-4">
          <Code lang="markdown" code={POINTER} />
        </div>
        <TypographyProse className="mt-4">
          <TypographyInlineCode>npx foundations init</TypographyInlineCode> prints this line
          rather than writing it. The file it belongs in is yours, and it is one line.
        </TypographyProse>
      </Section>

      <Section
        id="contents"
        title="What is in the file"
        note={`${LLMS_LINES} lines, in ${LLMS_SECTIONS.length} sections: ${LLMS_SECTIONS.join(", ")}. It is written for an agent that has never seen the package, so it leads with the rules rather than the API.`}
      >
        <div className="mt-4">
          <Code lang="markdown" code={llmsSection("Rules")} />
        </div>
        <TypographyProse className="mt-6">
          Then a table mapping what you want to the component that does it, the entry point
          each one ships from, and the props worth knowing. The last section covers the
          mistakes that produce no error at all:
        </TypographyProse>
        <div className="mt-4">
          <Code lang="markdown" code={llmsSection("Common mistakes")} />
        </div>
      </Section>

      <Section
        id="fresh"
        title="Why it cannot go stale"
        note="The prose is hand-written, since the useful part is the guidance rather than a list of names. Coverage is not: a build-time check walks the real exports of every entry point and fails the build if any name is missing from the file."
      >
        <TypographyProse className="mt-4">
          <TypographyInlineCode>yarn build</TypographyInlineCode> runs the check across all{" "}
          {LLMS_ENTRY_POINTS} entry points in the exports map and reports the count it
          covered, so a component cannot ship without appearing here. The check cannot tell
          whether the advice is still true. Keep the guidance short enough to re-read.
        </TypographyProse>
      </Section>

      <Section
        id="lint"
        title="The lint rules"
        note={
          <>
            An agent can miss the summary. The same design rules ship as ESLint selectors
            from <TypographyInlineCode>@supertype.ai/foundations/eslint</TypographyInlineCode>,
            which fail a build instead of advising one:
          </>
        }
      >
        <div className="mt-4">
          <Code lang="javascript" code={ESLINT} />
        </div>
        <TypographyProse className="mt-4">
          They catch hand-rolled colour (<TypographyInlineCode>bg-zinc-800</TypographyInlineCode>,
          hex literals, <TypographyInlineCode>dark:</TypographyInlineCode> overrides of a
          token), a size class on a primitive that owns its size, and a surface token used as
          ink. Plain data, no plugin, ESM and CommonJS builds both. See{" "}
          <TypographyLink
            href="https://github.com/supertypeai/foundations/blob/main/docs/tooling.md#lint-rules"
            addArrow
          >
            the tooling docs
          </TypographyLink>
          .
        </TypographyProse>
      </Section>

      <Section
        id="ci"
        title="doctor in CI"
        note="The wiring an agent gets wrong is not in the JSX. A missing @source line, imports in the wrong order, a font bound with .className: all silent, none of them lint errors."
      >
        <div className="mt-4">
          <Code lang="yaml" code={CI} />
        </div>
        <Callout tone="accent" density="editorial" title="Three layers" className="mt-6">
          <TypographyInlineCode>llms.txt</TypographyInlineCode> tells the agent what to write.
          The lint rules catch what it wrote anyway.{" "}
          <TypographyInlineCode>doctor</TypographyInlineCode> checks the wiring neither of
          them can see, and exits non-zero on a real problem.
        </Callout>
      </Section>
    </WithToc>
  );
}
