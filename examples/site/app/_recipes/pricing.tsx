import {
  TypographyEyebrow,
  TypographyH2,
  TypographyStat,
  TypographyList,
  TypographyCaption,
  TypographyMuted,
} from "@supertype.ai/foundations";
import {
  Button,
  Cards,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Callout,
} from "@supertype.ai/foundations/blocks";

/** The feature list takes `variant="ui"` to match the 13px card copy. */
const TIERS = [
  {
    name: "Solo",
    price: "$0",
    cadence: "forever",
    description: "One database, one destination.",
    features: ["1 source", "Daily sync", "Community support"],
  },
  {
    name: "Team",
    price: "$79",
    cadence: "per month",
    description: "Everything a small data team needs.",
    features: ["10 sources", "Streaming sync", "Slack alerts", "Audit log"],
  },
];

export default function Pricing() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <TypographyEyebrow>Pricing</TypographyEyebrow>
      <TypographyH2 className="mt-2">Priced per source</TypographyH2>
      <TypographyMuted className="mt-2">
        No egress charges, no surprise invoice.
      </TypographyMuted>

      <Cards className="mt-8">
        {TIERS.map((tier, index) => (
          <Card key={tier.name}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <TypographyStat size="panel" figures="proportional">
                  {tier.price}
                </TypographyStat>
                <TypographyCaption size="xs">{tier.cadence}</TypographyCaption>
              </div>

              <TypographyList variant="ui" className="mt-4">
                {tier.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </TypographyList>

              <Button
                variant={index === 0 ? "soft" : "solid"}
                className="mt-5 w-full"
                href={`/signup?tier=${tier.name.toLowerCase()}`}
              >
                Choose {tier.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Cards>

      <Callout
        tone="muted"
        title="Both tiers include the full connector set"
        className="mt-8"
      >
        Sources are counted by database, not by table.
      </Callout>
    </section>
  );
}
