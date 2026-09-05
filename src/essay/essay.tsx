import type { ComponentProps, ComponentType, ReactNode } from "react";

import { cn } from "../cn.js";
import {
  headingFace,
  TypographyEyebrow,
  TypographyH1,
  TypographyH2,
  TypographyH3,
} from "../typography/header.js";
import {
  TypographyCaption,
  TypographyMuted,
  TypographyProse,
} from "../typography/paragraph.js";
import { EssayAside, EssayBody, EssayColumns, PostMetaRow } from "./layout.js";
import { TableOfContents } from "./contents.js";

/**
 * The long-form reading surface: a page read from the top, not scanned.
 * `EssayColumns` sets the measure, `EssayHeader` the opening, `EssayDocument`
 * the whole of a page whose sections are just heading and prose.
 */

/** One entry in the margin index, matching the `id` of the section it points at. */
export type EssayIndexEntry = { id: string; label: string };

/**
 * Motion and gradient belong to an app, not the package. Both default to
 * nothing, so a consumer supplying neither gets the same markup, statically.
 */
export interface EssayDecorations {
  /** `"scale"` is the only variant named, so a narrower union still satisfies it. */
  Reveal?: ComponentType<{
    children: ReactNode;
    className?: string;
    eager?: boolean;
    variant?: "scale";
  }>;
  /** A backdrop behind the header. Rendered before the content, positioned by class. */
  Glow?: ComponentType<{ className?: string; intensity?: number }>;
}

/** Pass-through: keeps the className the shell relies on for layout. */
const PlainReveal: NonNullable<EssayDecorations["Reveal"]> = ({
  children,
  className,
}) => <div className={className}>{children}</div>;

const NoGlow: NonNullable<EssayDecorations["Glow"]> = () => null;

// Apostrophes are dropped rather than treated as a separator, so "What we don't
// collect" anchors at `what-we-dont-collect` the way a reader would type it.
const slugify = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Resolved for the whole document, since only the full list settles two cases:
 * a heading with no ASCII slugs to "" (which `useScrollSpy` discards), and two
 * differing only in case collide. An explicit `id` is always honoured.
 */
const anchorIds = (sections: readonly EssayDocSection[]): string[] => {
  const seen = new Map<string, number>();
  return sections.map((section, i) => {
    const base = section.id ?? (slugify(section.heading) || `section-${i + 1}`);
    const taken = seen.get(base) ?? 0;
    seen.set(base, taken + 1);
    return taken ? `${base}-${taken + 1}` : base;
  });
};

/** One section of a reference document: a heading, and the prose under it. */
export type EssayDocSection = {
  heading: string;
  /** A string is set as one paragraph. Pass a node for anything longer. */
  body: string | ReactNode;
  /** Only when the anchor has to outlive a retitling, since it is a public URL. */
  id?: string;
};

/** One step of a sequence: an ordinal, a title, and the prose under it. */
export type EssayMovement = { title: string; body: ReactNode };

export function createEssay({
  Reveal = PlainReveal,
  Glow = NoGlow,
}: EssayDecorations = {}) {
  /** Left aligned: the eye has to reach the first line of prose either way. */
  function EssayHeader({
    eyebrow,
    title,
    lede,
    byline,
  }: {
    eyebrow: ReactNode;
    title: ReactNode;
    /** The standfirst. Optional: a short piece can open on its title alone. */
    lede?: ReactNode;
    /** The signature line under the lede: who wrote it, and who it is written for. */
    byline?: ReactNode;
  }) {
    return (
      <header className="relative overflow-hidden pb-12 pt-16 sm:pt-24">
        <Glow className="-top-40 left-1/2 -translate-x-1/2" intensity={0.16} />
        <EssayColumns>
          <Reveal eager className="flex flex-col gap-6">
            <TypographyEyebrow>{eyebrow}</TypographyEyebrow>
            <TypographyH1 variant="display" className="text-balance">
              {title}
            </TypographyH1>
            {lede && (
              <TypographyMuted className="text-pretty text-xl leading-relaxed">
                {lede}
              </TypographyMuted>
            )}
            {/* The same meta row an article sets under its title, so a byline reads one
                way across the package. It rules nothing: the seam is `EssayBody`'s. */}
            {byline && <PostMetaRow>{byline}</PostMetaRow>}
          </Reveal>
        </EssayColumns>
      </header>
    );
  }

  /** The reading column, with the sticky index sitting in its left margin. */
  function EssayLayout({
    index,
    children,
  }: {
    index: readonly EssayIndexEntry[];
    children: ReactNode;
  }) {
    return (
      <EssayColumns
        className="pb-16 sm:pb-24"
        aside={
          <EssayAside>
            <TableOfContents sections={index} />
          </EssayAside>
        }
      >
        <EssayBody className="flex flex-col gap-16">{children}</EssayBody>
      </EssayColumns>
    );
  }

  /** The heading carries the anchor, offset so it lands under the sticky nav. */
  function EssaySection({
    id,
    heading,
    children,
  }: {
    id: string;
    heading: ReactNode;
    children: ReactNode;
  }) {
    return (
      <section id={id} className="scroll-mt-24">
        <Reveal className="flex flex-col gap-5">
          <TypographyH2 className="text-balance">
            {heading}
          </TypographyH2>
          {children}
        </Reveal>
      </section>
    );
  }

  /**
   * One per essay: a page with three has decided nothing. The face and a rung
   * rather than the whole ramp, and `text-pretty` over `text-balance`, since this
   * is prose set large. The rung is the section heading's, so the two retune
   * together under `.editorial`.
   */
  function EssayPullQuote({ children }: { children: ReactNode }) {
    return (
      <Reveal>
        <blockquote
          className={cn(
            headingFace,
            "text-h2 leading-snug text-foreground text-pretty",
            "border-l-2 border-primary/40 py-1 pl-6",
          )}
        >
          {children}
        </blockquote>
      </Reveal>
    );
  }

  /** Generic on purpose: a page hands it anything; this decides only the fit. */
  function EssayFigure({
    children,
    caption,
  }: {
    children: ReactNode;
    caption: ReactNode;
  }) {
    return (
      <Reveal variant="scale">
        <figure className="flex flex-col gap-3">
          {children}
          <TypographyCaption className="text-pretty">{caption}</TypographyCaption>
        </figure>
      </Reveal>
    );
  }

/**
   * A grid says the items are interchangeable; these hand output to each other.
   * An ordered list says that without an arrow — the ordinal is the ornament.
   */
  function EssayMovements({ items }: { items: readonly EssayMovement[] }) {
    return (
      <ol className="flex flex-col">
        {items.map(({ title, body }, i) => (
          <li
            key={title}
            className="border-t border-border/60 py-8 first:border-t-0 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-6"
          >
            <TypographyCaption className="block pt-2 font-mono tabular-nums text-primary-ink max-sm:mb-2">
              {String(i + 1).padStart(2, "0")}
            </TypographyCaption>
            <div className="flex flex-col gap-3">
              <TypographyH3>{title}</TypographyH3>
              {body}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  /**
   * A reference document as data: the index derives from the sections, so a
   * retitling cannot leave the rail scrolling to nothing.
   */
  function EssayDocument({
    sections,
    ...header
  }: ComponentProps<typeof EssayHeader> & {
    sections: readonly EssayDocSection[];
  }) {
    // Resolved once and shared, so the index and the sections cannot disagree
    // about what a section is called.
    const ids = anchorIds(sections);

    return (
      <article>
        <EssayHeader {...header} />
        <EssayLayout
          index={sections.map((s, i) => ({ id: ids[i], label: s.heading }))}
        >
          {sections.map((s, i) => (
            <EssaySection key={ids[i]} id={ids[i]} heading={s.heading}>
              {typeof s.body === "string" ? (
                <TypographyProse>{s.body}</TypographyProse>
              ) : (
                s.body
              )}
            </EssaySection>
          ))}
        </EssayLayout>
      </article>
    );
  }

  return {
    EssayHeader,
    EssayLayout,
    EssaySection,
    EssayPullQuote,
    EssayFigure,
    EssayMovements,
    EssayDocument,
  };
}

/**
 * The undecorated shell, bound once, so a consumer without decorations imports
 * these by name. `createEssay` stays for the consumers that do decorate. Module
 * scope is not incidental: the factory defines its components per call, so one
 * made during a render hands React a new type and remounts everything under it.
 */
export const {
  EssayHeader,
  EssayLayout,
  EssaySection,
  EssayPullQuote,
  EssayFigure,
  EssayMovements,
  EssayDocument,
} = createEssay();
