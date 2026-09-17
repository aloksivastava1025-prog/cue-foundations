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
};

export default nextConfig;
