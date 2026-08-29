import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "./_components/seo";

/**
 * Written out at build time, static export and all. The URLs are absolute and
 * carry the trailing slash the export actually serves, so they match the
 * canonicals rather than competing with them.
 *
 * No `lastModified`: every build would stamp today's date on every page, which
 * is a claim the site cannot back up, and a lastmod a crawler learns to distrust
 * is worse than none.
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
