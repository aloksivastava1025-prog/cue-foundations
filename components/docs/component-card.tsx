import Link from "next/link"
import type { RegistryItem } from "@/lib/registry"
import { PREVIEW_MAP } from "@/lib/preview-map"
import { GridAutoMotion } from "@/components/docs/grid-auto-motion"

/**
 * Homepage grid card — Cue Foundations Design DNA (StackerBento).
 * Exact tokens applied:
 *   Outer card    → #FAFAFA, rounded-[4px], 32px padding (via inner
 *                    well + footer), subtle DNA shadow
 *   Inner well    → #FFFFFF, rounded-[4px] (structural, not bubbly),
 *                    thin #E5E7EB border, 260px tall
 *   Title (22/600) → #111827
 *   Description   → #6B7280, 13px, leading 1.5
 *   NEW pill      → #EFF2FF bg / #5C6DFF text, 9px uppercase wide
 */

const GRID_LIVE_SLUGS = new Set([
  "button-magnetic",
  "tilt-card",
  "theme-toggle",
  "tabs-pill",
])

export function ComponentCard({ item }: { item: RegistryItem }) {
  const Preview = PREVIEW_MAP[item.slug]
  const isLiveInGrid =
    item.previewMode === "live" && Preview && GRID_LIVE_SLUGS.has(item.slug)

  const previewContent = (() => {
    if (isLiveInGrid) {
      return (
        <GridAutoMotion>
          <Preview />
        </GridAutoMotion>
      )
    }
    if (item.videoSrc) {
      return (
        <video
          src={item.videoSrc}
          poster={item.posterSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      )
    }
    if (item.posterSrc) {
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          src={item.posterSrc}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      )
    }
    return (
      <div className="flex h-full items-center justify-center text-xs text-[#9CA3AF]">
        No preview
      </div>
    )
  })()

  return (
    <article
      className="group relative flex flex-col rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-3 transition-colors hover:border-[#D1D5DB]"
      style={{
        // DNA feature_card elevation — barely visible.
        boxShadow:
          "0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02)",
      }}
    >
      {/* Inner preview well */}
      <div
        className={`relative h-[260px] overflow-hidden rounded-[4px] border ${
          isLiveInGrid
            ? "border-transparent bg-transparent"
            : "border-[rgba(0,0,0,0.03)] bg-white"
        }`}
      >
        {previewContent}
      </div>

      {/* Footer — 32px-ish internal breathing (card p-3 outer + these) */}
      <div className="mt-4 px-2 pb-1">
        <div className="mb-1.5 flex items-center gap-3">
          <h3 className="text-[17px] font-semibold leading-[1.35] tracking-tight text-[#111827] group-hover:text-[#5C6DFF]">
            {item.name}
          </h3>
          {item.isNew && (
            <span className="mt-0.5 rounded-full border border-[#5C6DFF]/20 bg-[#EFF2FF] px-2 py-[1px] text-[9px] font-bold uppercase tracking-wide text-[#5C6DFF]">
              New
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-[13px] leading-[1.5] text-[#6B7280]">
          {item.description}
        </p>
      </div>

      <Link
        href={`/components/${item.slug}`}
        aria-label={item.name}
        className="absolute inset-0 z-10 rounded-[4px]"
      />
    </article>
  )
}
