import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "./_components/seo";

/**
 * Absolute URLs carrying the trailing slash the export serves, so they match the
 * canonicals. No `lastModified`: every build would restamp every page.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...ROUTES.map(([path]) => ({
      url: `${SITE_URL}${path}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
