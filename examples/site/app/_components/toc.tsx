import type { ReactNode } from "react";
import { Link } from "next-view-transitions";
import {
  EssayAside,
  Rail,
  RailLink,
  TableOfContents,
} from "@supertype.ai/foundations/essay";
import { GroupedToc, type TocGroup } from "./grouped-toc";

export type TocEntry = { id: string; label: string };

/**
 * The shell every reference page uses: a body column and a sticky rail that
 * drops below `lg`. The width is set here, leaving `main` free for the essays.
 */
function WithRail({ aside, children }: { aside: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
      <div className="min-w-0">{children}</div>
      <aside className="hidden lg:block">
        <EssayAside className="pt-20">{aside}</EssayAside>
      </aside>
    </div>
  );
}

/** Page body plus the package's scroll-spied `TableOfContents` in the margin. */
export function WithToc({ sections, children }: { sections: readonly TocEntry[]; children: ReactNode }) {
  return <WithRail aside={<TableOfContents sections={sections} />}>{children}</WithRail>;
}

/** The same rail pointing at routes: `RailLink`'s `render` keeps the router's Link. */
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
