import {
  TypographyEyebrow,
  TypographyH1,
  TypographyH2,
  TypographyProse,
  TypographyHighlight,
  TypographyLabel,
  TypographyLink,
} from "@supertype/foundations";
import { Cards, Card } from "@supertype/foundations/blocks";

/**
 * A landing section. It only decides layout; the sizes, weights and colours all
 * come from the ramp, so the same file works on a product surface and on an
 * editorial one without a conditional.
 */
export default function MarketingHero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <TypographyEyebrow>Warehouse sync</TypographyEyebrow>

      {/* `display` for a heading that has to outrank the same level elsewhere. */}
      <TypographyH1 variant="display" className="mt-3 text-balance">
        Your data, in the warehouse, before anyone asks for it
      </TypographyH1>

      <TypographyProse className="mt-5">
        Change capture from Postgres to your warehouse with{" "}
        <TypographyHighlight tone="sage">no schema coupling</TypographyHighlight> and no
        nightly window to miss. Point it at a database and it keeps up.
      </TypographyProse>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="/signup"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90"
        >
          <TypographyLabel as="span" size="sm">
            Start a sync
          </TypographyLabel>
        </a>
        <TypographyLink href="/docs/replication" tone="primary" addArrow>
          Read how it works
        </TypographyLink>
      </div>

      <TypographyH2 divider className="mt-16">
        Three ways in
      </TypographyH2>

      <Cards className="mt-6">
        <Card
          href="/docs/logical-replication"
          title="Logical replication"
          description="Row-level changes, no schema coupling, no polling."
        />
        <Card
          href="/docs/copy"
          title="Bulk COPY"
          description="The fastest first load. Leaves the app untouched."
        />
      </Cards>
    </section>
  );
}
