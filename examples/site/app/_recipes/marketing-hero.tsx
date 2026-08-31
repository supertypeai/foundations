import {
  TypographyEyebrow,
  TypographyH1,
  TypographyH2,
  TypographyProse,
  TypographyHighlight,
  TypographyLink,
} from "@supertype.ai/foundations";
import { Button, Cards, Card } from "@supertype.ai/foundations/blocks";

/**
 * A landing section that decides layout only. Sizes, weights and colours come
 * from the ramp, so one file works on both surfaces.
 */
export default function MarketingHero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <TypographyEyebrow>Warehouse sync</TypographyEyebrow>

      {/* `display` outranks the same level elsewhere on the site. */}
      <TypographyH1 variant="display" className="mt-3 text-balance">
        Your data, in the warehouse, before anyone asks for it
      </TypographyH1>

      <TypographyProse className="mt-5">
        Change capture from Postgres to your warehouse with{" "}
        <TypographyHighlight tone="sage">
          no schema coupling
        </TypographyHighlight>{" "}
        and no nightly window to miss. Supertype works with any Postgres
        instance out of the box.
      </TypographyProse>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button href="/recipes">Start a sync</Button>
        <TypographyLink href="/recipes" tone="primary" addArrow>
          Read how it works
        </TypographyLink>
      </div>

      <TypographyH2 className="mt-16">
        Use Supertype&apos;s postgres service either way.
      </TypographyH2>

      <Cards className="mt-6">
        <Card
          href="/recipes"
          title="Logical replication"
          description="Row-level changes, no schema coupling, no polling."
        />
        <Card
          href="/recipes"
          title="Bulk COPY"
          description="The fastest first load. Leaves the app untouched."
        />
      </Cards>
    </section>
  );
}
