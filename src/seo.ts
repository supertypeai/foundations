/**
 * Structured data and page metadata, as pure functions over a site config. No
 * `next` import, not even a type one: `buildMetadata` returns a structurally
 * compatible object a consumer assigns straight to `Metadata`.
 */

export interface SeoConfig {
  /** Absolute site origin, no trailing slash. e.g. "https://supertype.ai" */
  baseUrl: string;
  siteName: string;
  /** Absolute URL of the default social card. */
  defaultOgImage: string;
  /** Absolute URL of the publisher logo, for Article publisher nodes. */
  logoUrl?: string;
  /** Path prefix articles live under, no slashes. Defaults to "notes". */
  articleBasePath?: string;
  /** The publisher's own site, when it is not this one. Defaults to `baseUrl`. */
  publisherUrl?: string;
  /**
   * Routes served as directory indexes, as a static export with `trailingSlash`
   * does. Structured data then names the same URL the canonical does.
   */
  trailingSlash?: boolean;
}

export interface ArticleAuthor {
  name: string;
  url?: string;
  sameAs?: string[];
  /** The byline's role. Carries an authorship signal a name alone does not. */
  jobTitle?: string;
}

export interface ArticleOptions {
  /** Topic tags, emitted as the comma-separated string schema.org expects. */
  keywords?: string[];
  /** Reading time in minutes, emitted as an ISO-8601 duration. */
  readingMinutes?: number;
}

/** The subset of Next's Metadata this builds. Assignable to it structurally. */
export interface PageMetadata {
  title: string;
  description: string;
  alternates: { canonical: string };
  openGraph: {
    title: string;
    description: string;
    url: string;
    images: { url: string; width: number; height: number; alt: string }[];
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
    images: string[];
  };
}

export function createSeo(config: SeoConfig) {
  const {
    baseUrl,
    siteName,
    defaultOgImage,
    logoUrl,
    articleBasePath = "notes",
    publisherUrl,
    trailingSlash = false,
  } = config;

  /** Resolves a possibly-relative URL against the site origin. */
  const absolute = (url: string) =>
    url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;

  /**
   * Stable `@id` anchors for the site's core entities. Pages reference these
   * rather than re-declaring an Organization node, so crawlers merge them into
   * one entity instead of collecting near-duplicates.
   */
  /**
   * A page route in the shape this site actually serves. A URL already carrying
   * a query, a fragment or a file extension is left alone — only a route gets
   * the slash.
   */
  const route = (url: string) => {
    const abs = absolute(url);
    if (!trailingSlash || abs.endsWith("/") || /[#?]|\.[a-z0-9]+$/i.test(abs)) return abs;
    return `${abs}/`;
  };

  /** A schema.org Person from a name or a fuller author record. */
  const person = (a: string | ArticleAuthor) => {
    const author: ArticleAuthor = typeof a === "string" ? { name: a } : a;
    return {
      "@type": "Person",
      name: author.name,
      ...(author.url ? { url: absolute(author.url) } : {}),
      ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
      ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
    };
  };

  const ORG_ID = `${baseUrl}/#organization`;
  const WEBSITE_ID = `${baseUrl}/#website`;

  const publisher = {
    "@type": "Organization",
    name: siteName,
    url: publisherUrl ?? baseUrl,
    ...(logoUrl
      ? { logo: { "@type": "ImageObject", url: logoUrl } }
      : {}),
  };

  return {
    absolute,
    ORG_ID,
    WEBSITE_ID,

    /**
     * The canonical is a path; Next resolves it against `metadataBase`. Never set
     * one in the root layout — it merges into every page and declares them all
     * duplicates of the homepage.
     */
    buildMetadata(
      title: string,
      description: string,
      slug: string,
      ogImage?: string,
    ): PageMetadata {
      const image = ogImage ?? defaultOgImage;
      const path = slug ? `/${slug.replace(/^\//, "")}` : "/";
      return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
          title,
          description,
          url: path,
          images: [{ url: image, width: 1200, height: 628, alt: title }],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [image],
        },
      };
    },

    /** Schema.org BlogPosting for an article. */
    buildArticleJsonLd(
      title: string,
      description: string,
      slug: string,
      authors: Array<string | ArticleAuthor>,
      datePublished?: string,
      image?: string,
      dateModified?: string,
      { keywords, readingMinutes }: ArticleOptions = {},
    ) {
      const url = route(`${articleBasePath}/${slug}`);
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        url,
        image: image ?? defaultOgImage,
        datePublished,
        // Falls back to datePublished rather than omitting. To a crawler, an
        // article with no modified date reads as never revised.
        dateModified: dateModified ?? datePublished,
        author: authors.map(person),
        ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
        ...(readingMinutes ? { timeRequired: `PT${readingMinutes}M` } : {}),
        publisher,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      };
    },

    /** Schema.org BreadcrumbList. Item URLs may be relative. */
    buildBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: route(item.url),
        })),
      };
    },

    /** Schema.org ItemList, for an ordered collection such as a topic page. */
    buildItemListJsonLd(items: Array<{ name: string; url: string }>) {
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: route(item.url),
        })),
      };
    },

    /** Schema.org FAQPage from question/answer pairs. */
    buildFaqJsonLd(faq: Array<{ q: string; a: string }>) {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      };
    },

    /** Schema.org WebPage and its narrower types. */
    buildWebPageJsonLd(
      name: string,
      description: string,
      slug: string,
      type:
        | "WebPage"
        | "AboutPage"
        | "ContactPage"
        | "CollectionPage"
        | "WebSite" = "WebPage",
      /** A page carrying a byline says who wrote it, same as an article does. */
      author?: string | ArticleAuthor,
    ) {
      return {
        "@context": "https://schema.org",
        "@type": type,
        name,
        description,
        url: route(slug),
        ...(author ? { author: person(author) } : {}),
        publisher,
      };
    },
  };
}
