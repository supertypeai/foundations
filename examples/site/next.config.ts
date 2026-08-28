import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/**
 * Nothing here is required by the package — this app is deliberately the
 * smallest Next config that can render it, so anything that breaks here is the
 * package's doing and not the example's.
 *
 * The one setting: this app has its own lockfile inside the package's repo, and
 * without a root Next picks the outer one and traces the wrong tree.
 */
const nextConfig: NextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
};

export default nextConfig;
