import { Link } from "next-view-transitions";
import { Rail, RailLink } from "@supertype.ai/foundations/essay";

/**
 * `active` highlights an item, `nested` indents an h3 under the h2 above it,
 * and `render` swaps the anchor for a router link so a rail can point at
 * routes instead of fragments.
 */
export default function RailDemo() {
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Anchors, with depth
        </p>
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
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Routes, via render
        </p>
        <Rail>
          <RailLink href="/blocks" render={<Link href="/blocks" />}>
            Blocks
          </RailLink>
          <RailLink href="/essay" render={<Link href="/essay" />}>
            Essay
          </RailLink>
          <RailLink href="/essay/reference" active render={<Link href="/essay/reference" />}>
            Essay reference
          </RailLink>
        </Rail>
      </div>
    </div>
  );
}
