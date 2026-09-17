import type { MetadataRoute } from "next"
import { registry } from "@/lib/registry"

const BASE = "https://kit.cuedesign.space"

/**
 * Dynamic sitemap — homepage + one entry per component. Updates
 * automatically when a new component lands in the registry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const home: MetadataRoute.Sitemap[number] = {
    url: `${BASE}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  }

  const components = registry.map((item) => ({
    url: `${BASE}/components/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [home, ...components]
}
