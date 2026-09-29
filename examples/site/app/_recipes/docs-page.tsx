import {
  ProseFlow,
  TypographyEyebrow,
  TypographyH1,
  TypographyH2,
  TypographyProse,
  TypographyList,
  TypographyInlineCode,
  TypographyLink,
  TypographyCaption,
} from "@supertype.ai/foundations";
import {
  Steps,
  Step,
  Callout,
  DisclosureGroup,
  Disclosure,
  Cards,
  Card,
} from "@supertype.ai/foundations/blocks";

/** Roughly what an MDX article compiles to. Static: the FAQ is <details>. */
export default function DocsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <TypographyEyebrow>Guides</TypographyEyebrow>
      <TypographyH1 className="mt-2 text-balance">
        Getting data out of Postgres
      </TypographyH1>

      <ProseFlow className="mt-4">
        <TypographyProse>
          Three approaches, ordered by how much of your schema they need to
          know. All of them assume a role with{" "}
          <TypographyInlineCode>REPLICATION</TypographyInlineCode> and a
          reachable host.
        </TypographyProse>

        <TypographyH2 divider>Set up a slot</TypographyH2>

        <Steps>
          <Step title="Create the publication">
            <TypographyProse>
              One publication per destination. Naming it after the destination
              is what stops two syncs from quietly sharing a slot.
            </TypographyProse>
          </Step>
          <Step title="Create the replication slot">
            <TypographyProse>
              Slots are per-database, and the name has to be unique across the
              cluster.
            </TypographyProse>
          </Step>
          <Step title="Point the connector at it">
            <TypographyProse>
              The first read is a snapshot; everything after is the WAL stream.
            </TypographyProse>
          </Step>
        </Steps>

        <Callout tone="warn" title="Before you start">
          Replication slots hold WAL until they are consumed, and an abandoned
          slot fills the disk. See{" "}
          <TypographyLink href="/ops/slots" addArrow>
            slot hygiene
          </TypographyLink>
          .
        </Callout>

        <TypographyH2 divider>What you get</TypographyH2>

        <TypographyList variant="prose">
          <li>Row-level inserts, updates and deletes, in commit order.</li>
          <li>Schema changes as DDL events, ahead of the rows using them.</li>
          <li>A resumable position, so a restart picks up where it stopped.</li>
        </TypographyList>

        <TypographyH2 divider>Common questions</TypographyH2>

        <DisclosureGroup type="single">
          <Disclosure title="Does this lock the table?">
            The snapshot takes a brief ACCESS SHARE lock, leaving writes
            running.
          </Disclosure>
          <Disclosure title="What happens if the destination is down?">
            The slot holds the WAL and the connector resumes from its last
            position.
          </Disclosure>
          <Disclosure title="Can two syncs share a slot?">
            No. Each consumer advances the slot, so sharing one loses data for
            the other.
          </Disclosure>
        </DisclosureGroup>

        <TypographyH2 divider>Next</TypographyH2>

        <Cards>
          <Card
            href="/docs/copy"
            title="Bulk COPY"
            description="For the first load."
          />
          <Card
            href="/ops/slots"
            title="Slot hygiene"
            description="Before the disk fills."
          />
        </Cards>

        <TypographyCaption as="p" className="mt-10">
          Last reviewed March 2026
        </TypographyCaption>
      </ProseFlow>
    </article>
  );
}
