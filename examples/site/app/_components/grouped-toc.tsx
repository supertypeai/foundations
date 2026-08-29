"use client";

import { Rail, RailLink, useScrollSpy } from "@supertype/foundations/essay";

export type TocGroup = {
  id: string;
  label: string;
  entries: readonly { id: string; label: string }[];
};

/**
 * A margin index for a page with more sections than one flat list can carry.
 *
 * The package's `TableOfContents` is the flat case and stays the default; this
 * is the same two primitives underneath — `Rail` for the line, `RailLink` with
 * `nested` for the entries — driven by the same `useScrollSpy`. Groups are the
 * one thing the package deliberately does not decide for you, since where a
 * page breaks is the page's business.
 */
export function GroupedToc({ groups }: { groups: readonly TocGroup[] }) {
  const active = useScrollSpy([
    ...groups.flatMap((g) => [g.id, ...g.entries.map((e) => e.id)]),
  ]);

  if (groups.length === 0) return null;

  return (
    <nav aria-label="Page sections">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <Rail>
        {groups.flatMap((group) => [
          <RailLink key={group.id} href={`#${group.id}`} active={active === group.id}>
            {group.label}
          </RailLink>,
          ...group.entries.map((entry) => (
            <RailLink
              key={entry.id}
              href={`#${entry.id}`}
              nested
              active={active === entry.id}
            >
              {entry.label}
            </RailLink>
          )),
        ])}
      </Rail>
    </nav>
  );
}
