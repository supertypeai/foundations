import type { ReactNode } from "react";

import { cn } from "../cn.js";
import { Button } from "./button.js";
import {
  Bulletin,
  EDITORIAL_INKS,
  Ribbon,
  type BulletinPoint,
} from "./bulletin.js";

// A compact statement block for a footer, a section, or a page. The layout is
// Bulletin's; the copy here is the package's own preset. The panel uses the
// editorial inks and the row the same mark in a tighter layout.

/** Where the mark points. Exported for the cases where a footer wants the bare
 *  href — a `<link rel="…">`, a sitemap entry, an analytics label. */
export const FOUNDATIONS_URL = "https://github.com/supertypeai/foundations";

/**
 * The two claims, each paired with a hue from the ribbon above it.
 *
 * They are short statements about how the package is built and how the system
 * is checked.
 */
const CLAIMS: readonly BulletinPoint[] = [
  {
    mark: "bg-terracotta",
    ink: "text-terracotta-ink",
    title: "Decisions live in one place",
    body: "Utility classes are for styling. The actual decision belongs in the design system. Every type style, tone, and divider on this page comes from one package, so a change is one diff instead of a search through the app.",
  },
  {
    mark: "bg-sage",
    ink: "text-sage-ink",
    title: "Every colour is measured twice",
    body: "WCAG tells us whether a colour passes the audit. APCA's Lc tells us how it feels in context, since the same contrast can read differently on different backgrounds. Both checks run against the shipped stylesheet in light and dark mode, so CI catches anything that slips.",
  },
];

const HEADLINE = "Designed with intention and mathematical rigor.";

/** The panel has a paragraph's room under its headline. */
const LEDE =
  "Typography primitives, semantic tokens, the essay shell, and contrast checks in one package, enforced in CI.";

/** The row has a line. Sharing `LEDE` with the panel put a paragraph in a
 *  footer, where it wrapped under the ribbon and stopped being a row. */
const NOTE = "Colors, typography, and blocks, tested and measured.";

const FOOTNOTE = "Open source design system by Supertype. MIT licensed.";

/**
 * The palette reduced to a small chip. It is small enough for a footer row and
 * still recognisable from the full panel.
 */
export function FoundationsMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-4 shrink-0 grid-cols-4 grid-rows-2 overflow-hidden rounded-[3px]",
        className,
      )}
    >
      {EDITORIAL_INKS.map(({ name, fill }) => (
        <span key={name} className={fill} />
      ))}
    </span>
  );
}

/**
 * The trailing arrow. It sits just under the text and keeps the link visually
 * aligned with the other controls.
 */
function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3 opacity-60 transition-opacity group-hover:opacity-100"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

/**
 * The standalone link. It is meant for a footer row or another layout that
 * already has its own structure. Use `Colophon` when the block itself is the
 * thing being placed.
 */
export function BuiltWithFoundations({
  label = "Built with Foundations",
  className,
}: {
  label?: ReactNode;
  className?: string;
}) {
  return (
    <Button
      href={FOUNDATIONS_URL}
      variant="outline"
      size="sm"
      className={cn("group gap-2", className)}
    >
      <FoundationsMark className="size-3.5" />
      {label}
      <Arrow />
    </Button>
  );
}

export interface ColophonProps {
  /**
   * `card` is the full panel and `line` is the compact row.
   */
  variant?: "card" | "line";
  /**
   * The link label. Use this for translations or a different wording.
   */
  label?: ReactNode;
  /**
   * Extra content for the panel, such as a short note about the site or the
   * people behind it.
   */
  children?: ReactNode;
  className?: string;
}

/**
 * A preset built on top of `Bulletin`.
 *
 * ```tsx
 * <Colophon />                 // the panel
 * <Colophon variant="line" />  // the compact row
 * ```
 *
 * Use `BuiltWithFoundations` for the standalone link, and `Bulletin` if you
 * want the same layout with different copy.
 */
export function Colophon({
  variant = "card",
  label,
  children,
  className,
}: ColophonProps) {
  const line = variant === "line";
  return (
    <Bulletin
      variant={variant}
      accent={
        <Ribbon
          className={line ? "h-1 min-w-20 flex-1 rounded-full" : "h-1.5 w-full"}
        />
      }
      eyebrow="Colophon"
      headline={HEADLINE}
      lede={line ? NOTE : LEDE}
      points={CLAIMS}
      action={<BuiltWithFoundations label={label} />}
      footnote={FOOTNOTE}
      className={className}
    >
      {children}
    </Bulletin>
  );
}
