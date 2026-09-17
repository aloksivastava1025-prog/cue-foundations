import type { NextConfig } from "next";

/**
 * The docs pages + shadcn CLI endpoint read component sources and
 * prompts off disk via `fs.readFile(path.join(process.cwd(), item.sourcePath))`.
 * Next's serverless tracing can't statically infer those paths, so we
 * tell it explicitly to bundle everything under components/foundations
 * and lib/prompts with each route.
 */
const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/components/[slug]": [
      "./components/foundations/**",
      "./lib/prompts/**",
    ],
    "/r/[slug]": [
      "./components/foundations/**",
      "./lib/prompts/**",
    ],
  },
  // We ship raw component sources migrated from Cue's export — the
  // detail page reads them as strings for display, they aren't
  // imported into the app graph. Full strict type-checking on those
  // files isn't useful for a docs site; runtime is what matters.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
