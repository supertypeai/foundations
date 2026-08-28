import type { Metadata } from "next";
import { TypographyProse, TypographyLink } from "@supertype/foundations";
import {
  EssayHeader,
  EssayLayout,
  EssaySection,
  EssayPullQuote,
  EssayFigure,
  EssayColumns,
  PostMetaRow,
  PostDate,
  MetaDot,
  ReadTime,
  TagPills,
  TableOfContents,
} from "@supertype/foundations/essay";

export const metadata: Metadata = { title: "The essay shell" };

/**
 * The undecorated bindings, imported by name. `createEssay({ Reveal, Glow })` is
 * there for an app with its own motion and gradient. This page has neither, so
 * it gets the same markup, rendered statically.
 */
const INDEX = [
  { id: "queue", label: "The queue" },
  { id: "measure", label: "The measure" },
  { id: "rail", label: "The rail" },
];

export default function EssayPage() {
  return (
    <article className="pt-10">
      <EssayHeader
        eyebrow="Engineering"
        title="What we learned shipping to forty workspaces"
        lede="Three months, one migration, and a queue that would not drain."
        byline="Samuel Chan · for teams running their own infrastructure"
      />

      <EssayLayout index={INDEX}>
        <PostMetaRow>
          <PostDate date="2026-03-14" format="long" />
          <MetaDot />
          <ReadTime minutes={7} />
          <MetaDot />
          <TagPills tags={["infrastructure", "postgres"]} />
        </PostMetaRow>

        <EssaySection id="queue" heading="The queue">
          <TypographyProse>
            The shell gives you one measure, one body size, and a margin index built from
            the sections themselves rather than kept in a list beside them. Keeping a
            separate list is how a renamed section ends up with a rail link to nowhere.
          </TypographyProse>
          <TypographyProse>
            Turn on the editorial switch in the header to see what this page is designed for.
            The heading ladder retunes against an 18px body, and the serif takes the heading
            role at weight 400, because Average has exactly one.
          </TypographyProse>

          <EssayPullQuote>
            One per essay. A page with three has decided nothing.
          </EssayPullQuote>
        </EssaySection>

        <EssaySection id="measure" heading="The measure">
          <TypographyProse>
            <TypographyLink href="/tokens">EssayColumns</TypographyLink> is three tracks with
            the third empty. Two would push the prose off-centre the moment an aside appeared,
            setting body copy on a different axis per page.
          </TypographyProse>

          <EssayFigure caption="Backlog, by hour — the figure slot takes any node">
            <div className="flex h-32 items-end gap-1 rounded-md bg-muted p-3">
              {[18, 34, 52, 41, 66, 88, 74, 49, 30, 22, 15, 9].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </EssayFigure>
        </EssaySection>

        <EssaySection id="rail" heading="The rail">
          <TypographyProse>
            An MDX article composes the pieces instead of using the shell whole:{" "}
            <TypographyLink href="/blocks">EssayColumns</TypographyLink> with a{" "}
            <TypographyLink href="/blocks">ReadingRail</TypographyLink> in the aside, its
            headings from <TypographyLink href="/blocks">extractHeadings(source)</TypographyLink>.
            Both the rail and the progress bar read shared stores, so mounting both costs one
            scroll subscription rather than two.
          </TypographyProse>
        </EssaySection>
      </EssayLayout>

      <div className="mt-16 border-t border-border pt-8">
        <EssayColumns aside={<TableOfContents sections={INDEX} />}>
          <TypographyProse>
            The same content in EssayColumns with a static margin index, which is how an
            MDX route composes it when the sections come from the markdown.
          </TypographyProse>
        </EssayColumns>
      </div>
    </article>
  );
}
