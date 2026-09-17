"use client"

import { useState } from "react"
import Link from "next/link"
import { registry, type RegistryItem } from "@/lib/registry"

/**
 * Left navigation for the docs — grouped by category with a hero
 * "Interactive" section at the top surfacing components that mount
 * live on their detail page (as opposed to video-only previews).
 * The current slug renders in the DNA accent on soft indigo.
 */

const CATEGORY_LABEL: Record<RegistryItem["category"], string> = {
  buttons: "Buttons",
  inputs: "Inputs",
  cards: "Cards",
  layouts: "Layouts",
  motion: "Motion",
  overlays: "Overlays",
  charts: "Charts",
  typography: "Typography",
}

const CATEGORY_ORDER: RegistryItem["category"][] = [
  "layouts",
  "motion",
  "cards",
  "typography",
  "overlays",
  "buttons",
  "inputs",
  "charts",
]

/** Components that mount live on the detail page. Kept in sync with
 *  the docs page's PREVIEW_MAP whitelist. */
const INTERACTIVE_SLUGS = new Set([
  "button-magnetic",
  "tilt-card",
  "theme-toggle",
  "tabs-pill",
])

function isInteractive(item: RegistryItem) {
  return INTERACTIVE_SLUGS.has(item.slug)
}

function SidebarLink({
  slug,
  name,
  isActive,
  interactive,
}: {
  slug: string
  name: string
  isActive: boolean
  interactive?: boolean
}) {
  return (
    <li>
      <Link
        href={`/components/${slug}`}
        className={`flex items-center justify-between gap-2 rounded-[4px] px-2 py-1.5 text-[13px] transition-colors ${
          isActive
            ? "bg-[#EFF2FF] font-semibold text-[#5C6DFF]"
            : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
        }`}
      >
        <span className="truncate">{name}</span>
        {interactive && (
          <span
            aria-label="Interactive"
            title="Interactive on the detail page"
            className="shrink-0 rounded-full bg-[#EFF2FF] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#5C6DFF]"
          >
            Live
          </span>
        )}
      </Link>
    </li>
  )
}

export function DocsSidebar({ activeSlug }: { activeSlug: string }) {
  const [open, setOpen] = useState(true)

  const interactiveItems = registry.filter(isInteractive)

  const byCategory = new Map<RegistryItem["category"], RegistryItem[]>()
  for (const item of registry) {
    if (isInteractive(item)) continue
    if (!byCategory.has(item.category)) byCategory.set(item.category, [])
    byCategory.get(item.category)!.push(item)
  }

  // Collapsed state — render a slim vertical rail with just a
  // "chevron right" button to reopen. Takes ~40px of column width so
  // the detail-page content flexes to fill the freed space.
  if (!open) {
    return (
      <aside className="hidden shrink-0 md:block md:w-[36px]">
        <div className="sticky top-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
            title="Open sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#E5E7EB] bg-white text-[#6B7280] transition-colors hover:border-[#D1D5DB] hover:text-[#111827]"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="hidden shrink-0 md:block md:w-[220px]">
      {/* Independent scroll: sidebar pinned to viewport top, own
          overflow-y-auto so scrolling the main content never moves
          the sidebar and vice versa. */}
      <nav className="sticky top-0 -mt-8 h-screen overflow-y-auto py-8 pr-3">
        {/* Collapse toggle — sits above the Intro group so users can
            reclaim the ~220px column for wide-component previews. */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Docs
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        <div className="mb-5">
          <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Intro
          </div>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/"
                className="block rounded-[4px] px-2 py-1.5 text-[13px] text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
              >
                Home
              </Link>
            </li>
          </ul>
        </div>

        {interactiveItems.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-widest text-[#5C6DFF]">
              <span>Interactive</span>
              <span className="rounded-full bg-[#EFF2FF] px-1.5 py-0.5 text-[9px] font-semibold text-[#5C6DFF]">
                {interactiveItems.length}
              </span>
            </div>
            <ul className="space-y-0.5">
              {interactiveItems.map((item) => (
                <SidebarLink
                  key={item.slug}
                  slug={item.slug}
                  name={item.name}
                  isActive={item.slug === activeSlug}
                  interactive
                />
              ))}
            </ul>
          </div>
        )}

        {CATEGORY_ORDER.map((cat) => {
          const items = byCategory.get(cat)
          if (!items || items.length === 0) return null
          return (
            <div key={cat} className="mb-5">
              <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
                <span>{CATEGORY_LABEL[cat]}</span>
                <span className="rounded-full bg-[#F3F4F6] px-1.5 py-0.5 text-[9px] font-semibold text-[#9CA3AF]">
                  {items.length}
                </span>
              </div>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <SidebarLink
                    key={item.slug}
                    slug={item.slug}
                    name={item.name}
                    isActive={item.slug === activeSlug}
                  />
                ))}
              </ul>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
