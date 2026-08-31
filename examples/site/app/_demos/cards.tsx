import { TypographyStat } from "@supertype.ai/foundations";
import {
  Cards,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@supertype.ai/foundations/blocks";

import { Icons } from "../_components/icons";

export default function CardDemo() {
  return (
    <div className="space-y-6">
      {/* Shorthand: title and description as props, href links the card. */}
      <Cards>
        <Card
          href="/typography"
          icon={<Icons.Database />}
          title="Logical replication"
          description="Row-level changes, no schema coupling."
        />
        <Card
          href="https://www.postgresql.org/docs/current/sql-copy.html"
          icon={<Icons.Copy />}
          title="COPY"
          description="Fastest bulk path. Leaves the app."
        />
      </Cards>

      {/* Composed from slots, for content beyond title and description. */}
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
