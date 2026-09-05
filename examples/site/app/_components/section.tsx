import type { ReactNode } from "react";
import {
  TypographyCaption,
  TypographyH2,
  TypographyH3,
  TypographyProse,
} from "@supertype.ai/foundations";

/** A linkable heading, an optional note, and whatever the section shows. */
export function Section({
  id,
  title,
  children,
  note,
  from,
}: {
  id: string;
  title: string;
  note?: ReactNode;
  /** Subpath the section's exports come from, e.g. `@supertype.ai/foundations/essay`. */
  from?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-14">
      <TypographyH2 divider>{title}</TypographyH2>
      {from ? (
        <TypographyCaption as="p" size="xs" className="mt-2 font-mono">{from}</TypographyCaption>
      ) : null}
      {note ? <TypographyProse className="mt-3">{note}</TypographyProse> : null}
      {children}
    </section>
  );
}

/** The band above a run of sections, stating the group's import path once. */
export function SectionGroup({
  id,
  title,
  from,
  note,
}: {
  id: string;
  title: string;
  from: string;
  note: ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 pt-20">
      <div className="rounded-lg border border-border bg-muted/30 p-6">
        <TypographyH3>{title}</TypographyH3>
        <TypographyCaption as="p" size="xs" className="mt-1 font-mono">{from}</TypographyCaption>
        <TypographyProse className="mt-3">{note}</TypographyProse>
      </div>
    </div>
  );
}
