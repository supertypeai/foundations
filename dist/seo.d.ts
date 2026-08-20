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
}
export interface ArticleAuthor {
    name: string;
    url?: string;
    sameAs?: string[];
    /** The byline's role, which is the authorship signal a name alone does not carry. */
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
    alternates: {
        canonical: string;
    };
    openGraph: {
        title: string;
        description: string;
        url: string;
        images: {
            url: string;
            width: number;
            height: number;
            alt: string;
        }[];
    };
    twitter: {
        card: "summary_large_image";
        title: string;
        description: string;
        images: string[];
    };
}
export declare function createSeo(config: SeoConfig): {
    absolute: (url: string) => string;
    ORG_ID: string;
    WEBSITE_ID: string;
    /**
     * The canonical is a path; Next resolves it against `metadataBase`. Never set
     * one in the root layout — it merges into every page and declares them all
     * duplicates of the homepage.
     */
    buildMetadata(title: string, description: string, slug: string, ogImage?: string): PageMetadata;
    /** Schema.org BlogPosting for an article. */
    buildArticleJsonLd(title: string, description: string, slug: string, authors: Array<string | ArticleAuthor>, datePublished?: string, image?: string, dateModified?: string, { keywords, readingMinutes }?: ArticleOptions): {
        publisher: {
            logo?: {
                "@type": string;
                url: string;
            } | undefined;
            "@type": string;
            name: string;
            url: string;
        };
        mainEntityOfPage: {
            "@type": string;
            "@id": string;
        };
        timeRequired?: string | undefined;
        keywords?: string | undefined;
        "@context": string;
        "@type": string;
        headline: string;
        description: string;
        url: string;
        image: string;
        datePublished: string | undefined;
        dateModified: string | undefined;
        author: {
            jobTitle?: string | undefined;
            sameAs?: string[] | undefined;
            url?: string | undefined;
            "@type": string;
            name: string;
        }[];
    };
    /** Schema.org BreadcrumbList. Item URLs may be relative. */
    buildBreadcrumbJsonLd(items: Array<{
        name: string;
        url: string;
    }>): {
        "@context": string;
        "@type": string;
        itemListElement: {
            "@type": string;
            position: number;
            name: string;
            item: string;
        }[];
    };
    /** Schema.org ItemList, for an ordered collection such as a topic page. */
    buildItemListJsonLd(items: Array<{
        name: string;
        url: string;
    }>): {
        "@context": string;
        "@type": string;
        numberOfItems: number;
        itemListElement: {
            "@type": string;
            position: number;
            name: string;
            url: string;
        }[];
    };
    /** Schema.org FAQPage from question/answer pairs. */
    buildFaqJsonLd(faq: Array<{
        q: string;
        a: string;
    }>): {
        "@context": string;
        "@type": string;
        mainEntity: {
            "@type": string;
            name: string;
            acceptedAnswer: {
                "@type": string;
                text: string;
            };
        }[];
    };
    /** Schema.org WebPage and its narrower types. */
    buildWebPageJsonLd(name: string, description: string, slug: string, type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "WebSite"): {
        "@context": string;
        "@type": "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "WebSite";
        name: string;
        description: string;
        url: string;
        publisher: {
            "@type": string;
            name: string;
            url: string;
        };
    };
};
