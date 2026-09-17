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
      <div className="mb-6 hidden items-center gap-3 md:flex">
        <label className="inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-[#6B7280] hover:text-[#111827]">
          <span className="font-medium">Live preview only</span>
          <span className="rounded-full bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-semibold text-[#6B7280]">
            {items.filter((it) => SAFE_LIVE_SLUGS.has(it.slug) && !!it.videoSrc).length}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={liveOnly}
            onClick={() => setLiveOnly((v) => !v)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
              liveOnly ? "bg-[#1A1A1A]" : "bg-[#E5E7EB]"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                liveOnly ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ComponentCard key={item.slug} item={item} />
        ))}
      </div>
    </>
  )
}
