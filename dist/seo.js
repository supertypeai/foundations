/**
 * Structured data and page metadata.
 *
 * Built from ssite's `lib/seo.ts`, which was the better of the two
 * implementations across the projects — the other declared BlogPosting and
 * BreadcrumbList inline in the page component, so the schemas drifted per page
 * and could not be tested.
 *
 * Everything here is a pure function over a site config. No `next` import, not
 * even a type one: `buildMetadata` returns a structurally-compatible object that
 * a consumer assigns straight to Next's `Metadata`, which keeps the package free
 * of a framework dependency for the sake of one interface.
 */
export function createSeo(config) {
    const { baseUrl, siteName, defaultOgImage, logoUrl, articleBasePath = "notes", } = config;
    /** Resolves a possibly-relative URL against the site origin. */
    const absolute = (url) => url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
    /**
     * Stable `@id` anchors for the site's core entities. Pages reference these
     * rather than re-declaring an Organization node, so crawlers merge them into
     * one entity instead of collecting near-duplicates.
     */
    const ORG_ID = `${baseUrl}/#organization`;
    const WEBSITE_ID = `${baseUrl}/#website`;
    const publisher = {
        "@type": "Organization",
        name: siteName,
        url: baseUrl,
        ...(logoUrl
            ? { logo: { "@type": "ImageObject", url: logoUrl } }
            : {}),
    };
    return {
        absolute,
        ORG_ID,
        WEBSITE_ID,
        /**
         * Page-level metadata with OpenGraph, Twitter card and canonical.
         *
         * The canonical is a path, not an absolute URL — Next resolves it against
         * `metadataBase`. Note that root-layout metadata merges into every page, so
         * a site must never set a canonical at the root: it would quietly declare
         * every page a duplicate of the homepage.
         */
        buildMetadata(title, description, slug, ogImage) {
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
        buildArticleJsonLd(title, description, slug, authors, datePublished, image, dateModified, { keywords, readingMinutes } = {}) {
            const url = `${baseUrl}/${articleBasePath}/${slug}`;
            return {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: title,
                description,
                url,
                image: image ?? defaultOgImage,
                datePublished,
                // Falls back to datePublished rather than omitting: an article with no
                // modified date reads to a crawler as never revised, which is worse than
                // saying it was last touched when it was written.
                dateModified: dateModified ?? datePublished,
                author: authors.map((a) => {
                    const author = typeof a === "string" ? { name: a } : a;
                    return {
                        "@type": "Person",
                        name: author.name,
                        ...(author.url ? { url: absolute(author.url) } : {}),
                        ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
                        ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
                    };
                }),
                ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
                ...(readingMinutes ? { timeRequired: `PT${readingMinutes}M` } : {}),
                publisher,
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
            };
        },
        /** Schema.org BreadcrumbList. Item URLs may be relative. */
        buildBreadcrumbJsonLd(items) {
            return {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: items.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.name,
                    item: absolute(item.url),
                })),
            };
        },
        /** Schema.org ItemList, for an ordered collection such as a topic page. */
        buildItemListJsonLd(items) {
            return {
                "@context": "https://schema.org",
                "@type": "ItemList",
                numberOfItems: items.length,
                itemListElement: items.map((item, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: item.name,
                    url: absolute(item.url),
                })),
            };
        },
        /** Schema.org FAQPage from question/answer pairs. */
        buildFaqJsonLd(faq) {
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
        buildWebPageJsonLd(name, description, slug, type = "WebPage") {
            return {
                "@context": "https://schema.org",
                "@type": type,
                name,
                description,
                url: `${baseUrl}/${slug.replace(/^\//, "")}`,
                publisher: { "@type": "Organization", name: siteName, url: baseUrl },
            };
        },
    };
}
