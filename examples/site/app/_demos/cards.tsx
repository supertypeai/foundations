import { TypographyStat } from "@supertype/foundations";
import {
  Cards,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@supertype/foundations/blocks";

export default function CardDemo() {
  return (
    <div className="space-y-6">
      {/* Shorthand, which is what an MDX author writes. An href links the whole card. */}
      <Cards>
        <Card
          href="/typography"
          title="Logical replication"
          description="Row-level changes, no schema coupling."
        />
        <Card
          href="https://www.postgresql.org/docs/current/sql-copy.html"
          title="COPY"
          description="Fastest bulk path. Leaves the app."
        />
      </Cards>

      {/* Composed, when the shorthand is not enough. */}
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Billing period to date</CardDescription>
        </CardHeader>
        <CardContent>
          <TypographyStat size="panel">18,204</TypographyStat>
        </CardContent>
      </Card>
    </div>
  );
}
