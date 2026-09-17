"use client"

import { useState } from "react"

type Tab = "preview" | "usage" | "code"

/**
 * Preview / Usage / Code tabs — DNA-styled pill selector.
 * Active tab: dark #1A1A1A anchor per DNA button spec.
 */
export function PreviewTabs({
  preview,
  usage,
  code,
}: {
  preview: React.ReactNode
  usage: React.ReactNode
  code: React.ReactNode
}) {
  const [tab, setTab] = useState<Tab>("preview")

  return (
    <div>
      <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1 text-[13px]">
        {([
          ["preview", "Preview"],
          ["usage", "Prompt"],
          ["code", "Code"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-1.5 font-semibold transition-colors ${
              tab === id
                ? "bg-[#1A1A1A] text-white"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "preview" && preview}
      {tab === "usage" && usage}
      {tab === "code" && code}
    </div>
  )
}
