"use client"

import { useState } from "react"

/**
 * Scrollable code/prompt block with a Copy button — DNA-light.
 * Surface: #FAFAFA card with thin #E5E7EB border; label uses the
 * 9px uppercase metadata treatment.
 */
export function CopyBlock({
  content,
  label,
  className = "",
  bodyClassName = "",
}: {
  content: string
  label?: string
  className?: string
  bodyClassName?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <div className={className}>
      {label && (
        <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
          {label}
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label ?? "content"}`}
          className="absolute right-3 top-3 z-10 rounded-[4px] border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] font-semibold text-[#6B7280] transition-colors hover:text-[#111827]"
        >
          {copied ? "✓ Copied" : "⧉ Copy"}
        </button>
        <pre
          className={`overflow-auto rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-6 text-[13px] leading-[1.5] text-[#111827] ${bodyClassName}`}
          style={{
            boxShadow: "0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02)",
          }}
        >
          {content}
        </pre>
      </div>
    </div>
  )
}
