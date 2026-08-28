import { TypographyLink, TypographyProse } from "@supertype/foundations";

export default function Links() {
  return (
    <TypographyProse>
      Internal versus external is decided from the href, never at the call site:{" "}
      <TypographyLink href="/blocks">this one routes</TypographyLink>,{" "}
      <TypographyLink href="https://www.postgresql.org/docs/current/sql-copy.html" addArrow>
        this one leaves
      </TypographyLink>{" "}
      and takes an ↗ with it, and{" "}
      <TypographyLink href="/tokens" tone="primary" addArrow>
        this one is the point of the line
      </TypographyLink>{" "}
      so it gets a → instead.
    </TypographyProse>
  );
}
