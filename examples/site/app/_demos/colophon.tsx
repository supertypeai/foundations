import { TypographyCaption, TypographyLink } from "@supertype.ai/foundations";
import {
  BuiltWithFoundations,
  Bulletin,
  Button,
  Colophon,
  Ribbon,
} from "@supertype.ai/foundations/blocks";

const RELEASE = [
  {
    mark: "bg-fern",
    ink: "text-fern-ink",
    title: "Scheduled exports",
    body: "Pick a cron schedule and the report lands in your inbox on the hour. We run backfills from the same query, so a resend matches the original.",
  },
  {
    mark: "bg-stone",
    ink: "text-stone-ink",
    title: "Faster cold starts",
    body: "The worker pool now warms up on deploy instead of waiting for the first request. The slowest page in the app dropped from 1.9s to 240ms at the median.",
  },
];

export default function ColophonDemo() {
  return (
    <div className="space-y-10">
      <div>
        <TypographyCaption as="p" className="mb-4">
          The default panel. This is just{" "}
          <code className="font-mono">&lt;Colophon /&gt;</code>. Hover over any
          of the hues to expand it.
        </TypographyCaption>
        <Colophon />
      </div>

      <div>
        <TypographyCaption as="p" className="mb-4">
          The compact row for a footer that only has room for one line.
        </TypographyCaption>
        <Colophon variant="line" />
      </div>

      <div>
        <TypographyCaption as="p" className="mb-4">
          Use <code className="font-mono">children</code> for your own copy. It
          appears under the rule, where you would usually place a short note
          about the site or the people behind it.
        </TypographyCaption>
        <Colophon>
          Set in Ubuntu Sans and Average.{" "}
          <TypographyLink href="https://github.com/supertypeai/foundations">
            Open-source
          </TypographyLink>{" "}
          design system by Supertype.
        </Colophon>
      </div>

      <div>
        <TypographyCaption as="p" className="mb-4">
          <code className="font-mono">Bulletin</code> uses the same structure
          without the content. It works well for announcements, release notes,
          or status updates. Every slot is optional.
        </TypographyCaption>
        <Bulletin
          accent={<Ribbon hues={RELEASE_HUES} className="h-1.5 w-full" />}
          eyebrow="Release 4.2"
          headline="Exports run on a schedule now."
          lede="Two things shipped this week, and one of them changes how you set up a recurring report."
          points={RELEASE}
          action={
            <Button href="/recipes" variant="outline" size="sm">
              Read the notes
            </Button>
          }
          footnote="Rolling out to all workspaces through Friday."
        />
      </div>

      <div>
        <TypographyCaption as="p" className="mb-4">
          <code className="font-mono">BuiltWithFoundations</code> is the
          standalone link. Use it when the link sits inside another layout, such
          as a footer row with other links.
        </TypographyCaption>
        <BuiltWithFoundations />
      </div>
    </div>
  );
}

/** Four of the eight, in the app's own order. `Ribbon` takes whatever list you
 *  give it; the classes have to be literals in your source, as they are here. */
const RELEASE_HUES = [
  { name: "fern", fill: "bg-fern" },
  { name: "sage", fill: "bg-sage" },
  { name: "stone", fill: "bg-stone" },
  { name: "fig", fill: "bg-fig" },
];
