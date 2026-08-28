import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/**
 * Nothing here is required by the package — this app is deliberately the
 * smallest Next config that can render it, so anything that breaks here is the
 * package's doing and not the example's.
 *
 * outputFileTracingRoot: this app has its own lockfile inside the package's
 * repo, and without a root Next picks the outer one and traces the wrong tree.
 *
 * The rest is the static-export path used by the docs deploy. `yarn dev` and a
 * plain `yarn build` are untouched; the export only turns on when
 * FOUNDATIONS_STATIC is set, so the local DX stays a normal Next app.
 *
 *   FOUNDATIONS_STATIC=1                        export to out/, served at /
 *   FOUNDATIONS_BASE_PATH=/foundations          export for a project Pages site
 *
 * trailingSlash makes every route a directory index (out/tokens/index.html), the
 * only shape a plain static host resolves without rewrite rules.
 */
const staticExport = process.env.FOUNDATIONS_STATIC === "1";
const basePath = process.env.FOUNDATIONS_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  ...(staticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {}),
};

export default nextConfig;
