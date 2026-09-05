import type { Metadata } from "next";
import { createSeo } from "@supertype.ai/foundations/seo";
import { HOME, PAGES } from "./pages";

/**
 * Origin and base path kept apart: `metadataBase` must be the bare origin, since
 * Next prefixes the base path onto the card URLs itself.
 */
export const SITE_ORIGIN = (
  process.env.FOUNDATIONS_SITE_ORIGIN ?? "https://supertypeai.github.io"
).replace(/\/$/, "");

export const BASE_PATH = (process.env.FOUNDATIONS_BASE_PATH ?? "").replace(
  /\/$/,
  "",
);

/** The absolute URL of the site root. Used where a full URL is required outright. */
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

export const SITE_NAME = "Foundations";
export const SITE_TITLE = HOME.title;
export const SITE_DESCRIPTION = HOME.description;

/** A route as served: under the base path, with the trailing slash the export resolves at. */
export const canonicalPath = (path: string) =>
  `${BASE_PATH}/${path === "/" ? "" : `${path.replace(/^\/|\/$/g, "")}/`}`;

/** The card for a route, absolute; a static host resolves no base path for us. */
const cardUrl = (card: string) => `${SITE_URL}/og/${card}.png`;

const card = (alt: string, name: string) => [
  { url: cardUrl(name), width: 1200, height: 630, alt },
];

/** The package's SEO entry point, pointed at this site. Only the JSON-LD builders are used. */
export const seo = createSeo({
  baseUrl: SITE_URL,
  // The publisher in the JSON-LD is the org, so it carries the org's own URL
  // wherever these docs happen to sit.
  siteName: "Supertype",
  publisherUrl: "https://supertype.ai",
  // next.config.ts sets trailingSlash for the static export, and canonicalPath
  // below builds the same shape. Structured data has to agree with both.
  trailingSlash: true,
  defaultOgImage: cardUrl("home"),
});

/**
 * One page's metadata by slug, so the tab, the card and the nav print the same
 * title. It goes out bare; the layout's templates append the site name.
 */
export function pageMetadata(slug: string): Metadata {
  const page = PAGES.find((p) => p.slug === slug);
  if (!page)
    throw new Error(
      `No page copy for "${slug}": add it to app/_components/pages.ts`,
    );
  const { title, description } = page;
  const url = canonicalPath(slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    // Next replaces `openGraph` wholesale instead of merging it into the
    // layout's, so the constants are repeated here.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      url,
      images: card(`${title} · ${SITE_NAME}`, slug),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cardUrl(slug)],
    },
  };
}

/** The homepage sets no title, so the layout's untemplated `default` stands. */
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
export const ROUTES = PAGES.map(
  ({ slug, title }) => [`/${slug}`, title] as const,
);

/** The same list for the header, where the shorter labels are used. */
export const NAV = PAGES.map(
  ({ slug, title, nav }) => [`/${slug}`, nav ?? title] as const,
);
