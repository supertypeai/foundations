import type { ReactNode } from "react";
import { Link } from "next-view-transitions";
import { Rail, RailLink, TableOfContents } from "@supertype.ai/foundations/essay";
import { GroupedToc, type TocGroup } from "./grouped-toc";

export type TocEntry = { id: string; label: string };

/**
 * The shell every reference page on this site uses: a body column and a sticky
 * rail in the margin, which drops out below `lg` where there is no margin to
 * put it in.
 *
 * The page's width is decided here rather than on `main`, because it is a
 * property of *this* layout and not of the site. The essay routes bring their
 * own three-track measure and need roughly 72rem to place a rail in it; inside
 * a `main` capped at 64rem their margin collapsed to 88px against the 208px
 * this one gives.
 */
function WithRail({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
      <div className="min-w-0">{children}</div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 pt-20">{aside}</div>
      </aside>
    </div>
  );
}

/**
 * Page body plus a sticky index of the sections in it. The index is the
 * package's own TableOfContents, which tracks the section you are reading with
 * a scroll spy.
 */
export function WithToc({ sections, children }: { sections: readonly TocEntry[]; children: ReactNode }) {
  return <WithRail aside={<TableOfContents sections={sections} />}>{children}</WithRail>;
}

/**
 * The same rail, pointing at other pages instead of anchors. `RailLink` takes a
 * `render` prop for exactly this, so the router's Link keeps the view
 * transition and the rail keeps its styling.
 */
export function RouteRail({
  label,
  routes,
}: {
  label: string;
  routes: readonly (readonly [string, string])[];
}) {
  return (
    <nav aria-label={label}>
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <Rail>
        {routes.map(([href, text]) => (
          <RailLink key={href} render={<Link href={href} />}>
            {text}
          </RailLink>
        ))}
      </Rail>
    </nav>
  );
}

/** Page body plus the cross-page rail, for the index page. */
export function WithRouteRail({
  label,
  routes,
  children,
}: {
  label: string;
  routes: readonly (readonly [string, string])[];
  children: ReactNode;
}) {
  return <WithRail aside={<RouteRail label={label} routes={routes} />}>{children}</WithRail>;
}

/** Page body plus a grouped index, for a reference page too long for a flat list. */
export function WithGroupedToc({
  groups,
  children,
}: {
  groups: readonly TocGroup[];
  children: ReactNode;
}) {
  return <WithRail aside={<GroupedToc groups={groups} />}>{children}</WithRail>;
}

export type { TocGroup };
