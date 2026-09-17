"use client"

import { useState } from "react"

/**
 * Hero install-command chip. Click to copy a real, working shadcn
 * install command for a flagship component so a landing developer
 * can paste-and-verify in ~5 seconds without leaving the homepage.
 * Feedback flips to "Copied" for 1.4s.
 */
export function HeroInstallChip() {
  const [copied, setCopied] = useState(false)
  const cmd =
    "npx shadcn@latest add https://foundations.cuedesign.space/r/phantom-infinite-gallery.json"

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy shadcn install command"
      className="group inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-2 font-mono text-[11px] text-[#111827] transition-colors hover:border-[#5C6DFF]/40 hover:bg-white md:px-5 md:text-[13px]"
    >
      <span className="truncate">
        <span className="text-[#9CA3AF]">$ </span>
        npx shadcn@latest add{" "}
        <span className="text-[#5C6DFF]">
          https://foundations.cuedesign.space/r/phantom-infinite-gallery.json
        </span>
      </span>
      <span
        className={`shrink-0 rounded-[4px] border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
          copied
            ? "border-[#10B981]/30 bg-[#DCFCE7] text-[#10B981]"
            : "border-[#E5E7EB] bg-white text-[#6B7280] group-hover:text-[#111827]"
        }`}
      >
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  )
}
