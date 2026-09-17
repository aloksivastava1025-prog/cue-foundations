"use client"

import { useState } from "react"
import type { RegistryItem } from "@/lib/registry"
import { SAFE_LIVE_SLUGS } from "@/lib/preview-map"
import { ComponentCard } from "@/components/docs/component-card"

/**
 * Client-side grid with a "Live preview only" filter chip. Default
 * shows every component; toggle the chip and the grid narrows to
 * just the components that have a live-interactive preview on their
 * detail page (Video ⇄ Live toggle available).
 *
 * When the filter is on, live-enabled components are what remains,
 * so they naturally read as "at the top" — no separate sort needed.
 */
export function ComponentsGrid({ items }: { items: RegistryItem[] }) {
  const [liveOnly, setLiveOnly] = useState(false)

  const filtered = liveOnly
    ? items.filter((it) => SAFE_LIVE_SLUGS.has(it.slug) && !!it.videoSrc)
    : items

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLiveOnly((v) => !v)}
          aria-pressed={liveOnly}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
            liveOnly
              ? "border-[#10B981]/25 bg-[#DCFCE7] text-[#10B981]"
              : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#D1D5DB] hover:text-[#111827]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              liveOnly ? "bg-[#10B981]" : "bg-[#9CA3AF]"
            }`}
          />
          Live preview only
          <span
            className={`ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
              liveOnly
                ? "bg-white/60 text-[#10B981]"
                : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            {items.filter((it) => SAFE_LIVE_SLUGS.has(it.slug) && !!it.videoSrc).length}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ComponentCard key={item.slug} item={item} />
        ))}
      </div>
    </>
  )
}
