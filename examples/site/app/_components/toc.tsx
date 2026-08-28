import type { ReactNode } from "react";
import { Link } from "next-view-transitions";
import { Rail, RailLink, TableOfContents } from "@supertype/foundations/essay";

export type TocEntry = { id: string; label: string };

/**
 * Page body plus a sticky index in the margin. The index is the package's own
 * TableOfContents, which tracks the section you are reading with a scroll spy.
 * It drops out below `lg`, where there is no margin to put it in.
 */
export function WithToc({ sections, children }: { sections: readonly TocEntry[]; children: ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
      <div className="min-w-0">{children}</div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 pt-20">
          <TableOfContents sections={sections} />
        </div>
      </aside>
    </div>
  );
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
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
      <div className="min-w-0">{children}</div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 pt-20">
          <RouteRail label={label} routes={routes} />
        </div>
      </aside>
    </div>
  );
}
