"use client"

import { useState } from "react"

type Pm = "bun" | "npm" | "pnpm" | "yarn"

/**
 * Hero install chip — compact package-manager selector + one-line
 * install command. Click the copy icon to grab the full command.
 * Visual layout: [pm dropdown] | [command] [copy]
 */
export function HeroInstallChip() {
  const [pm, setPm] = useState<Pm>("npm")
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const jsonUrl =
    "https://kit.cuedesign.space/r/phantom-infinite-gallery.json"

  const commands: Record<Pm, string> = {
    bun: `bunx --bun shadcn add ${jsonUrl}`,
    npm: `npx shadcn@latest add ${jsonUrl}`,
    pnpm: `pnpm dlx shadcn@latest add ${jsonUrl}`,
    yarn: `yarn dlx shadcn@latest add ${jsonUrl}`,
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(commands[pm])
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <div className="relative inline-flex max-w-full items-center overflow-visible rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] py-1 pl-1 pr-2 font-mono text-[11px] text-[#111827] md:text-[13px]">
      {/* Package manager dropdown */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-[4px] bg-white border border-[#E5E7EB] px-2 py-1 text-[#111827] transition-colors hover:border-[#D1D5DB]"
      >
        <span>{pm}</span>
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Divider */}
      <span className="mx-2 h-4 w-px bg-[#E5E7EB]" />

      {/* Command — truncates, full text still gets copied */}
      <span className="max-w-[240px] truncate text-[#6B7280] sm:max-w-[380px] md:max-w-[520px]">
        {commands[pm].replace(jsonUrl, "kit.cuedesign.space/r/…")}
      </span>

      {/* Copy button */}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        className="ml-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] text-[#9CA3AF] transition-colors hover:bg-white hover:text-[#111827]"
      >
        {copied ? (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute left-1 top-full z-20 mt-1 min-w-[110px] rounded-[8px] border border-[#E5E7EB] bg-white p-1 shadow-lg">
          {(["bun", "npm", "pnpm", "yarn"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPm(p)
                setOpen(false)
              }}
              className={`block w-full rounded-[4px] px-2.5 py-1.5 text-left text-[12px] transition-colors ${
                pm === p
                  ? "bg-[#F3F4F6] font-semibold text-[#111827]"
                  : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
