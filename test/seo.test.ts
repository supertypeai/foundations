import { describe, expect, it } from "vitest";

import { createSeo } from "../src/seo";

const BASE = "https://supertype.ai";

const seo = createSeo({
  baseUrl: BASE,
  siteName: "Supertype",
  defaultOgImage: `${BASE}/og.png`,
  logoUrl: `${BASE}/logo.png`,
});

/**
 * The publisher node is the one place a corpus of pages can quietly fragment an
 * entity: every article carries a copy of it, so an un-`@id`'d node means a
 * crawler sees one Organization per article rather than the single one the site
 * declares from its root layout.
 */
describe("publisher identity", () => {
  it("points the article publisher at the canonical Organization", () => {
    const article = seo.buildArticleJsonLd("T", "D", "notes/a", ["Someone"]);
    expect(article.publisher["@id"]).toBe(seo.ORG_ID);
    expect(seo.ORG_ID).toBe(`${BASE}/#organization`);
  });

  it("points the web-page publisher at the same node", () => {
    const page = seo.buildWebPageJsonLd("T", "D", "about", "AboutPage");
    expect(page.publisher["@id"]).toBe(seo.ORG_ID);
  });

  it("keeps the descriptive fields alongside the @id", () => {
    const { publisher } = seo.buildArticleJsonLd("T", "D", "notes/a", ["S"]);
    expect(publisher).toMatchObject({
      "@type": "Organization",
      name: "Supertype",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
    });
  });

  it("withholds the @id when the publisher is a different site", () => {
    // ORG_ID is derived from baseUrl, so stamping it on a third-party publisher
    // would merge someone else's Organization into this site's entity.
    const syndicated = createSeo({
      baseUrl: BASE,
      siteName: "Elsewhere",
      defaultOgImage: `${BASE}/og.png`,
      publisherUrl: "https://elsewhere.example",
    });
    const article = syndicated.buildArticleJsonLd("T", "D", "notes/a", ["S"]);
    expect(article.publisher).not.toHaveProperty("@id");
    expect(article.publisher.url).toBe("https://elsewhere.example");
  });
});
