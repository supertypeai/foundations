"use client";

import { TypographyEyebrow } from "@supertype.ai/foundations";
import { Rail, RailLink, useScrollSpy } from "@supertype.ai/foundations/essay";

export type TocGroup = {
  id: string;
  label: string;
  entries: readonly { id: string; label: string }[];
};

/**
 * A margin index for a page with more sections than one flat list can carry,
 * over the same `Rail`, `RailLink` and `useScrollSpy` as `TableOfContents`.
 */
export function GroupedToc({ groups }: { groups: readonly TocGroup[] }) {
  const active = useScrollSpy([
    ...groups.flatMap((g) => [g.id, ...g.entries.map((e) => e.id)]),
  ]);

  if (groups.length === 0) return null;

  return (
    <nav aria-label="Page sections">
      <TypographyEyebrow as="p" tone="muted" className="mb-4">
        On this page
      </TypographyEyebrow>
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
