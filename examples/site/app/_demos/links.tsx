import { TypographyInlineCode, TypographyLink, TypographyProse } from "@supertype.ai/foundations";

export default function Links() {
  return (
    <TypographyProse>
      The href decides whether a link routes or leaves.{" "}
      <TypographyLink href="/blocks">An internal href</TypographyLink> routes through
      next-view-transitions.{" "}
      <TypographyLink href="https://www.postgresql.org/docs/current/sql-copy.html" addArrow>
        An external one
      </TypographyLink>{" "}
      opens in a new tab, and <TypographyInlineCode>addArrow</TypographyInlineCode> gives it
      an ↗. On{" "}
      <TypographyLink href="/tokens" tone="primary" addArrow>
        an internal link
      </TypographyLink>{" "}
      the same prop gives a →.
    </TypographyProse>
  );
}
