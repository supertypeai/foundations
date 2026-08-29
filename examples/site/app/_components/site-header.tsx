import { Link } from "next-view-transitions";
import {
  TypographyCaption,
  TypographyEyebrow,
  TypographyH1,
  TypographyLabel,
  TypographyLink,
  TypographyProse,
} from "@supertype.ai/foundations";
import { NAV } from "./seo";
import { REPO_SLUG, REPO_URL, StarButton } from "./star";
import { SurfaceSwitches } from "./surface";

/** From the one record that holds every page, so a new route reaches the nav by existing. */
const PAGES = NAV;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:gap-x-5">
        <Link href="/" className="shrink-0">
          <TypographyLabel as="span" size="xs" className="font-mono">
            foundations
          </TypographyLabel>
        </Link>

        <nav className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 md:flex-1 md:justify-center">
          {PAGES.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-sm px-1.5 py-1 text-muted-foreground transition-colors duration-150 hover:bg-muted/50 hover:text-foreground"
            >
              <TypographyLabel as="span" size="xs">
                {label}
              </TypographyLabel>
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 md:ml-auto">
          <SurfaceSwitches />
          <StarButton />
        </div>
      </div>
    </header>
  );
}

/** The standard page opening. Uses the primitives rather than raw classes. */
export function PageTitle({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
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
        <TypographyCaption>MIT licensed by Supertype.</TypographyCaption>
        <div className="flex flex-wrap items-center gap-4">
          <TypographyCaption className="font-mono">
            <TypographyLink href={REPO_URL} addArrow>
              {REPO_SLUG}
            </TypographyLink>{" "}
            {version}
          </TypographyCaption>
          <StarButton label="Star on GitHub" />
        </div>
      </div>
    </footer>
  );
}
