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
  { id: "fresh", label: "How it stays current" },
  { id: "lint", label: "The lint rules" },
  { id: "ci", label: "doctor in CI" },
];

const POINTER = `# CLAUDE.md, AGENTS.md, or your agent's equivalent

@node_modules/@supertype.ai/foundations/llms.txt`;

const ESLINT = `// eslint.config.js
import { designRules } from "@supertype.ai/foundations/eslint";

export default [
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...designRules({ accents: "the brand tints", weights: true }),
      ],
    },
  },
];`;

const CI = `- run: npx foundations doctor`;

export default function AgentsPage() {
  return (
    <WithToc sections={SECTIONS}>
      <PageTitle
        eyebrow="Setup"
        title="Coding agents"
        lede="A new agent usually writes text-sm text-muted-foreground until it learns the primitive exists. This package ships a summary for that, plus two checks that catch the gaps the summary misses."
      />

      <Section
        id="pointer"
        title="The one line"
        note={
          <>
            <TypographyInlineCode>llms.txt</TypographyInlineCode> installs
            alongside <TypographyInlineCode>dist/</TypographyInlineCode>.
            Reference it from whatever file your agent reads at the start of a
            session:
          </>
        }
      >
        <div className="mt-4">
          <Code lang="markdown" code={POINTER} />
        </div>
        <TypographyProse className="mt-4">
          <TypographyInlineCode>npx foundations init</TypographyInlineCode>{" "}
          prints this line for you to paste. The file it belongs in is yours.
        </TypographyProse>
      </Section>

      <Section
        id="contents"
        title="What is in the file"
        note={`${LLMS_LINES} lines, in ${LLMS_SECTIONS.length} sections: ${LLMS_SECTIONS.join(", ")}. It is written for a first-time agent, so it leads with the rules and gets to the API afterward.`}
      >
        <div className="mt-4">
          <Code lang="markdown" code={llmsSection("Rules")} />
        </div>
        <TypographyProse className="mt-6">
          Then a table mapping what you want to the component that does it, the
          entry point each one ships from, and the props worth knowing. A
          section on writing copy sets the register for the words themselves,
          and one on common mistakes covers what goes through silently:
        </TypographyProse>
        <div className="mt-4">
          <Code lang="markdown" code={llmsSection("Common mistakes")} />
        </div>
      </Section>

      <Section
        id="fresh"
        title="How it stays current"
        note="The prose is hand-written, since the guidance is the useful part. Coverage is mechanical: a build-time check walks the real exports of every entry point and fails the build when a name is missing from the file."
      >
        <TypographyProse className="mt-4">
          <TypographyInlineCode>yarn build</TypographyInlineCode> runs the check
          across all {LLMS_ENTRY_POINTS} entry points in the exports map and
          reports the count it covered, so every component that ships appears
          here. Judging whether the advice still holds stays a human job, so
          keep the guidance short enough to re-read.
        </TypographyProse>
      </Section>

      <Section
        id="lint"
        title="The lint rules"
        note={
          <>
            An agent can miss the summary. The same design rules ship as ESLint
            selectors from{" "}
            <TypographyInlineCode>
              @supertype.ai/foundations/eslint
            </TypographyInlineCode>
            , which fail a build where the summary only advises:
          </>
        }
      >
        <div className="mt-4">
          <Code lang="javascript" code={ESLINT} />
        </div>
        <TypographyProse className="mt-4">
          An agent reaches for a utility class before a primitive, so the rules
          are written around that habit. They catch hand-rolled colour (
          <TypographyInlineCode>bg-zinc-800</TypographyInlineCode>, a hex, a{" "}
          <TypographyInlineCode>dark:</TypographyInlineCode> override of a
          token), a type style written out on a{" "}
          <TypographyInlineCode>&lt;p&gt;</TypographyInlineCode> where a
          primitive exists, a size class on a component that owns its size, a
          surface token printed as ink, and a margin nudging an icon into line.
          Plain data, no plugin, ESM and CommonJS builds both. The{" "}
          <TypographyLink href="/philosophy#silent" addArrow>
            philosophy
          </TypographyLink>{" "}
          page has the full set and why each one is there. See{" "}
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
        note="The wiring an agent gets wrong sits outside the JSX. A missing @source line, imports in the wrong order, a font bound with .className: all silent, all invisible to a linter."
      >
        <div className="mt-4">
          <Code lang="yaml" code={CI} />
        </div>
        <Callout
          tone="primary"
          density="editorial"
          title="Three layers"
          className="mt-6"
        >
          <TypographyInlineCode>llms.txt</TypographyInlineCode> tells the agent
          what to write. The lint rules catch what it wrote anyway.{" "}
          <TypographyInlineCode>doctor</TypographyInlineCode> checks the wiring
          both of them are blind to, and exits non-zero on a real problem.
        </Callout>
      </Section>
    </WithToc>
  );
}
