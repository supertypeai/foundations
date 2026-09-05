import { Link } from "next-view-transitions";
import { TypographyEyebrow } from "@supertype.ai/foundations";
import { Rail, RailLink } from "@supertype.ai/foundations/essay";

/** `active` highlights, `nested` indents, `render` swaps the anchor for a
router link. */
export default function RailDemo() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div>
        <TypographyEyebrow as="p" tone="muted" className="mb-4">
          Anchors, with depth
        </TypographyEyebrow>
        <Rail>
          <RailLink href="#rail">The rail</RailLink>
          <RailLink href="#contents" active>
            The margin index
          </RailLink>
          <RailLink href="#contents" nested>
            Its label slot
          </RailLink>
          <RailLink href="#reading">The reading rail</RailLink>
        </Rail>
      </div>

      <div>
        <TypographyEyebrow as="p" tone="muted" className="mb-4">
          Routes, via render
        </TypographyEyebrow>
        <Rail>
          <RailLink href="/blocks" render={<Link href="/blocks" />}>
            Blocks
          </RailLink>
          <RailLink href="/essay" render={<Link href="/essay" />}>
            Essay
          </RailLink>
          <RailLink
            href="/essay/reference"
            active
            render={<Link href="/essay/reference" />}
          >
            Essay reference
          </RailLink>
        </Rail>
      </div>
    </div>
  );
}
