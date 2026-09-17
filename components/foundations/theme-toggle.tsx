"use client"

import { motion } from "framer-motion"
import { useState } from "react"

/**
 * Cue Foundations · Theme Toggle
 * ────────────────────────────────────────────
 * Pill-style light/dark toggle with a spring-animated thumb.
 * Purely visual demo — wire it to your theme store in production.
 * ────────────────────────────────────────────
 */
export function ThemeToggle({ initial = "dark" }: { initial?: "light" | "dark" }) {
  const [mode, setMode] = useState<"light" | "dark">(initial)

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] p-1">
      {(["light", "dark"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          className={`relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            mode === m ? "text-white" : "text-white/50 hover:text-white/70"
          }`}
        >
          {mode === m && (
            <motion.span
              layoutId="theme-toggle-thumb"
              className="absolute inset-0 -z-10 rounded-full bg-white/10"
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            />
          )}
          {m === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  )
}
