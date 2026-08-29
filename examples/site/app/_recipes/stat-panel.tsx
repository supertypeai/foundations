import { TypographyStat, TypographyLabel, TypographyCaption } from "@supertype.ai/foundations";
import { Cards, Card, CardHeader, CardTitle, CardContent } from "@supertype.ai/foundations/blocks";

/**
 * A metrics row for a product surface. Two things worth copying:
 *
 *  - `figures="tabular"` (the default) keeps digits from shifting when a value
 *    updates in place. The headline figure opts out and uses proportional.
 *  - `size="panel"` rides the heading ladder, so these stats retune along with
 *    the headings around them on an editorial surface.
 */
const METRICS = [
  { label: "Rows synced", value: "18,204", delta: "+12% vs last week" },
  { label: "Lag", value: "1.4s", delta: "p95, last hour" },
  { label: "Slots", value: "3", delta: "1 idle for 6 days" },
];

export default function StatPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>This billing period</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyStat size="display" figures="proportional">
            2.4M
          </TypographyStat>
          <TypographyCaption as="p" size="xs" className="mt-1">
            events, across 40 workspaces
          </TypographyCaption>
        </CardContent>
      </Card>

      <Cards className="sm:grid-cols-3">
        {METRICS.map(({ label, value, delta }) => (
          <Card key={label}>
            <CardContent>
              <TypographyLabel as="p" size="2xs">
                {label}
              </TypographyLabel>
              <TypographyStat size="panel" className="mt-1 block">
                {value}
              </TypographyStat>
              <TypographyCaption as="p" size="2xs" className="mt-1">
                {delta}
              </TypographyCaption>
            </CardContent>
          </Card>
        ))}
      </Cards>
    </div>
  );
}
