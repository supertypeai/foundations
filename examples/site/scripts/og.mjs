#!/usr/bin/env node
/**
 * Renders the social cards to public/og/*.png before the build.
 *
 * Next's `opengraph-image` file convention would be less code, but under
 * `output: export` it writes the card as an extensionless file, and a static
 * host serves that as application/octet-stream — which the crawlers that read
 * these tags refuse. A real .png in public/ is served as one.
 *
 * The card itself is the package's `ogCard`: an element tree, never an image,
 * so `next/og` is imported here and not there. The copy comes from the same
 * record the pages take their titles from, so the two cannot drift — this
 * imports that .ts file directly, which needs Node 22.18 or newer (type
 * stripping, on by default). Node warns that it had to reparse a file with no
 * package type; the scripts that run this pass --disable-warning for it.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";
import { ogCard, OG_SIZE } from "@supertype.ai/foundations/og";
import { HOME, PAGES } from "../app/_components/pages.ts";

const outDir = fileURLToPath(new URL("../public/og/", import.meta.url));
mkdirSync(outDir, { recursive: true });

/** The dark theme's colours, read off theme.css, so a shared link looks like the site it opens. */
const PALETTE = {
  accent: "#81A789",
  background: "#141210",
  foreground: "#EFECE7",
  muted: "#A39C92",
};

const cards = [
  { slug: "home", cardTitle: HOME.cardTitle, description: HOME.description },
  ...PAGES,
];

for (const { slug, title, cardTitle, description } of cards) {
  const response = new ImageResponse(
    ogCard({ title: cardTitle ?? title, description, site: "@supertype.ai/foundations", ...PALETTE }),
    OG_SIZE,
  );
  const png = Buffer.from(await response.arrayBuffer());
  writeFileSync(`${outDir}${slug}.png`, png);
  console.log(`og → public/og/${slug}.png  (${png.length} bytes)`);
}
