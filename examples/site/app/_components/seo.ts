import type { Metadata } from "next";
import { createSeo } from "@supertype.ai/foundations/seo";
import { HOME, PAGES } from "./pages";

/**
 * Where this site is actually served from, kept as origin and base path
 * separately because Next wants them that way: `metadataBase` must be the bare
 * origin, since Next already prefixes the deploy's base path onto the URLs it
 * generates for the `opengraph-image` files, and a base path in both places
 * lands the card at /foundations/foundations/….
 *
 * The base path is the same variable next.config.ts reads, so the two cannot
 * disagree: empty means this build is served at the root, and the canonicals
 * then correctly say so.
 */
export const SITE_ORIGIN = (
  process.env.FOUNDATIONS_SITE_ORIGIN ?? "https://supertypeai.github.io"
).replace(/\/$/, "");

export const BASE_PATH = (process.env.FOUNDATIONS_BASE_PATH ?? "").replace(/\/$/, "");

/** The absolute URL of the site root. Used where a full URL is required outright. */
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export const SITE_NAME = "Foundations";
export const SITE_TITLE = HOME.title;
export const SITE_DESCRIPTION = HOME.description;


/**
 * A route as it is actually served: under the deploy's base path, and with the
 * trailing slash the static export's directory indexes resolve at.
 */
export const canonicalPath = (path: string) =>
  `${BASE_PATH}/${path === "/" ? "" : `${path.replace(/^\/|\/$/g, "")}/`}`;

/**
 * The card for a route, rendered to public/og by scripts/og.mjs before the
 * build. Absolute, because a static host will not resolve a base path for us.
 */
const cardUrl = (card: string) => `${SITE_URL}/og/${card}.png`;

const card = (alt: string, name: string) => [
  { url: cardUrl(name), width: 1200, height: 630, alt },
];

/**
 * The package's own SEO entry point, pointed at this site. Only the JSON-LD
 * builders are used here: `buildMetadata` assumes one shared card, and this
 * site renders one per page.
 */
export const seo = createSeo({
  baseUrl: SITE_URL,
  // The publisher in the JSON-LD, which is the org and not the package — so it
  // carries the org's own URL rather than wherever these docs happen to sit.
  siteName: "Supertype",
  publisherUrl: "https://supertype.ai",
  // next.config.ts sets trailingSlash for the static export, and canonicalPath
  // below builds the same shape. Structured data has to agree with both.
  trailingSlash: true,
  defaultOgImage: cardUrl("home"),
});

/**
 * One page's metadata, looked up by slug so the title a tab shows, the one a
 * card shows, and the one the nav shows are all the same string. The title goes
 * out bare: the templates in the root layout append the site name to it, for
 * the tab and for the card alike.
 */
export function pageMetadata(slug: string): Metadata {
  const page = PAGES.find((p) => p.slug === slug);
  if (!page) throw new Error(`No page copy for "${slug}" — add it to app/_components/pages.ts`);
  const { title, description } = page;
  const url = canonicalPath(slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    // Next replaces `openGraph` wholesale rather than merging it into the
    // layout's, so the constants come back here rather than being inherited.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      url,
      images: card(`${title} · ${SITE_NAME}`, slug),
    },
    twitter: { card: "summary_large_image", title, description, images: [cardUrl(slug)] },
  };
}

/**
 * The homepage's own metadata. It sets no title, so the layout's untemplated
 * `default` stands: the site name is already inside it, and "%s · Foundations"
 * would say it twice.
 */
export const homeMetadata: Metadata = {
  alternates: { canonical: canonicalPath("/") },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: canonicalPath("/"),
    images: card(SITE_TITLE, "home"),
  },
  twitter: { card: "summary_large_image", images: [cardUrl("home")] },
};

/** The pages this site publishes, in order. Drives the sitemap and the home rail. */
export const ROUTES = PAGES.map(({ slug, title }) => [`/${slug}`, title] as const);

/** The same list for the header, where the shorter labels are used. */
export const NAV = PAGES.map(({ slug, title, nav }) => [`/${slug}`, nav ?? title] as const);
