import { notFound } from "next/navigation"
import { getRegistryItem, registry } from "@/lib/registry"
import { PREVIEW_MAP, SAFE_LIVE_SLUGS } from "@/lib/preview-map"

/**
 * Isolated live-preview route. Renders the component alone inside
 * its own window — the detail page iframes this URL. Because it's
 * a full document, the component sees the iframe's own `window` /
 * scroll / resize events, so scroll-based components (ScrollTrigger,
 * IntersectionObserver against window) work as authored. Zero CSS
 * leak to the docs page: everything is scoped to the iframe.
 */
export async function generateStaticParams() {
  return registry
    .filter((it) => SAFE_LIVE_SLUGS.has(it.slug))
    .map((it) => ({ slug: it.slug }))
}

export default async function PreviewOnly({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getRegistryItem(slug)
  if (!item || !SAFE_LIVE_SLUGS.has(slug)) notFound()

  const Preview = PREVIEW_MAP[slug]
  if (!Preview) notFound()

  return <Preview />
}
