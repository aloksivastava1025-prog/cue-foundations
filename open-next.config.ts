import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache"

// Kit is fully prerendered at build time (generateStaticParams on every
// dynamic route), so the prerendered pages can be served straight from
// Workers static assets — no R2/KV cache needed.
//
// Cache interception is left OFF on purpose: it answers Next 16's
// segment-prefetch requests (Next-Router-Segment-Prefetch) with the
// full page payload, which makes the client router retry prefetches
// in a loop. Going through the Next server keeps prefetch behaviour
// identical to `next start`.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
})
