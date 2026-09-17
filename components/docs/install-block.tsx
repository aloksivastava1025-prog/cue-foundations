"use client"

import { useState } from "react"

/**
 * Install block — CLI / Manual toggle + package-manager tabs.
 * Mirrors beUI's install UI so users can grab the shadcn command
 * in whichever manager their project runs on.
 */
export function InstallBlock({
  slug,
  sourceContent,
}: {
  slug: string
  /** Raw .tsx source, shown under the "Manual" tab. */
  sourceContent: string
}) {
  const [mode, setMode] = useState<"cli" | "manual">("cli")
  const [pm, setPm] = useState<"bun" | "npm" | "pnpm" | "yarn">("bun")
  const [copied, setCopied] = useState(false)

  const jsonUrl = `https://foundations.cuedesign.space/r/${slug}.json`
  const cliCmd = {
    bun: `bunx --bun shadcn add ${jsonUrl}`,
    npm: `npx shadcn@latest add ${jsonUrl}`,
    pnpm: `pnpm dlx shadcn@latest add ${jsonUrl}`,
    yarn: `yarn dlx shadcn@latest add ${jsonUrl}`,
  }[pm]

  const textToCopy = mode === "cli" ? cliCmd : sourceContent

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <div>
      {/* CLI / Manual toggle */}
      <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1 text-[11px]">
        {(["cli", "manual"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              mode === m
                ? "bg-[#1A1A1A] text-white"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {m === "cli" ? "CLI" : "Manual"}
          </button>
        ))}
      </div>

      <div
        className="overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA]"
        style={{
          boxShadow: "0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02)",
        }}
      >
        {mode === "cli" && (
          <div className="flex items-center gap-4 border-b border-[#E5E7EB] px-4 pt-3 text-[13px]">
            {(["bun", "npm", "pnpm", "yarn"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPm(p)}
                className={`pb-2 transition-colors ${
                  pm === p
                    ? "border-b-2 border-[#5C6DFF] text-[#111827]"
                    : "border-b-2 border-transparent text-[#9CA3AF] hover:text-[#6B7280]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={copy}
              aria-label="Copy install command"
              className="ml-auto pb-2 text-[#9CA3AF] hover:text-[#111827]"
            >
              {copied ? "✓" : "⧉"}
            </button>
          </div>
        )}

        <div className="relative">
          {mode === "cli" ? (
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.5] text-[#111827]">
              <span className="text-[#9CA3AF]">$ </span>
              {cliCmd.split(/(shadcn|add|@?bunx|npx|pnpm|yarn|--bun|@latest|dlx)/).map((part, i) => {
                const isKeyword = /^(bunx|npx|pnpm|yarn|shadcn|add|--bun|@latest|dlx)$/.test(part)
                return (
                  <span key={i} className={isKeyword ? "text-[#5C6DFF]" : ""}>
                    {part}
                  </span>
                )
              })}
            </pre>
          ) : (
            <>
              <button
                type="button"
                onClick={copy}
                className="absolute right-3 top-3 rounded-[4px] border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <pre className="max-h-[400px] overflow-auto p-4 font-mono text-xs leading-[1.5] text-[#111827]">
                {sourceContent}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
