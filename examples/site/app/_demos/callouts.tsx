import { TypographyLink } from "@supertype/foundations";
import { Callout } from "@supertype/foundations/blocks";

export default function Callouts() {
  return (
    <div className="space-y-4">
      <Callout tone="warn" title="Rotate the key first">
        The old one stops working the moment the new one is issued.
      </Callout>

      <Callout tone="destructive" title="This deletes the slot">
        An abandoned replication slot holds WAL until the disk fills.
      </Callout>

      {/* The docs form, with reading-size body and an accent rail. */}
      <Callout density="editorial" tone="accent" title="Why this is safe">
        Replication slots are consumed in order — see{" "}
        <TypographyLink href="/typography" addArrow>
          slot hygiene
        </TypographyLink>
        .
      </Callout>

      <Callout>Muted is the default, and the quietest thing in the set.</Callout>
    </div>
  );
}
