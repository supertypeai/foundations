import { Link } from "next-view-transitions";
import {
  TypographyCaption,
  TypographyEyebrow,
  TypographyH1,
  TypographyLabel,
  TypographyLink,
  TypographyProse,
} from "@supertype/foundations";
import { SurfaceSwitches } from "./surface";

const PAGES = [
  ["/recipes", "Recipes"],
  ["/typography", "Typography"],
  ["/blocks", "Blocks"],
  ["/tokens", "Tokens"],
  ["/essay", "Essay"],
  ["/agents", "Agents"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3">
        <Link href="/">
          <TypographyLabel as="span" size="xs" className="font-mono">
            foundations
          </TypographyLabel>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-4">
          {PAGES.map(([href, label]) => (
            <Link key={href} href={href} className="text-muted-foreground hover:text-foreground">
              <TypographyLabel as="span" size="xs">
                {label}
              </TypographyLabel>
            </Link>
          ))}
        </nav>
        <SurfaceSwitches />
      </div>
    </header>
  );
}

/** The standard page opening. Uses the primitives rather than raw classes. */
export function PageTitle({ eyebrow, title, lede }: { eyebrow: string; title: string; lede: string }) {
  return (
    <div className="pt-16">
      <TypographyEyebrow>{eyebrow}</TypographyEyebrow>
      <TypographyH1 variant="display" className="mt-2 text-balance">
        {title}
      </TypographyH1>
      <TypographyProse className="mt-4">{lede}</TypographyProse>
    </div>
  );
}

/** Site footer: the licence and the tag this site is running. */
export function SiteFooter({ version }: { version: string }) {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-8">
        <TypographyCaption>
          MIT licensed. Copyright © 2026 Supertype.
        </TypographyCaption>
        <TypographyCaption className="font-mono">
          <TypographyLink href="https://github.com/supertypeai/foundations" addArrow>
            supertypeai/foundations
          </TypographyLink>{" "}
          {version}
        </TypographyCaption>
      </div>
    </footer>
  );
}
