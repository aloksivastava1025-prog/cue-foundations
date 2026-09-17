"use client"

import { motion } from "framer-motion"
import { useState } from "react"

/**
 * Cue Foundations · Pill Tabs
 * ────────────────────────────────────────────
 * Spring-underlined tab bar. The active indicator glides between
 * tabs using layoutId — the shared-motion trick.
 * ────────────────────────────────────────────
 */
export function PillTabs({
  tabs = ["Overview", "Activity", "Settings"],
  initial = 0,
}: {
  tabs?: string[]
  initial?: number
}) {
  const [active, setActive] = useState(initial)

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setActive(i)}
          className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === i ? "text-white" : "text-white/50 hover:text-white/70"
          }`}
        >
          {active === i && (
            <motion.span
              layoutId="pill-tab-thumb"
              className="absolute inset-0 -z-10 rounded-full bg-white/10"
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            />
          )}
          {t}
        </button>
      ))}
    </div>
  )
}
