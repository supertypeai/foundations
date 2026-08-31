import {
  TypographyInlineCode,
  TypographyLink,
  TypographyProse,
} from "@supertype.ai/foundations";

export default function Links() {
  return (
    <TypographyProse>
      The href decides whether a link routes or leaves.{" "}
      <TypographyLink href="/blocks">An internal href</TypographyLink> routes
      through
      next-view-transitions elsewhere.{" "}
      <TypographyLink
        href="https://www.postgresql.org/docs/current/sql-copy.html"
        addArrow
      >
        An external one
      </TypographyLink>{" "}
      opens in a new tab, and
      <TypographyInlineCode>addArrow</TypographyInlineCode> marks it
      with an outbound glyph. On{" "}
      <TypographyLink href="/tokens" tone="primary" addArrow>
        an internal link
      </TypographyLink>{" "}
      the same prop points along the page instead. Both are rendered above, so
      compare them
      in place.
    </TypographyProse>
  );
}
