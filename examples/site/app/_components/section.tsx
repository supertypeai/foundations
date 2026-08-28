import type { ReactNode } from "react";
import { TypographyH2, TypographyProse } from "@supertype/foundations";

/** A linkable heading, an optional note, and whatever the section shows. */
export function Section({
  id,
  title,
  children,
  note,
}: {
  id: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-14">
      <TypographyH2 divider>{title}</TypographyH2>
      {note ? <TypographyProse className="mt-3">{note}</TypographyProse> : null}
      {children}
    </section>
  );
}
