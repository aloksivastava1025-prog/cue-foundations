"use client"

import { motion, useSpring } from "framer-motion"
import { useRef } from "react"

/**
 * Cue Foundations · Magnetic Button
 * ────────────────────────────────────────────
 * A button that follows the cursor within a 60px radius, springs
 * back on release. Editorial ease throughout. Respects
 * prefers-reduced-motion.
 *
 * AI Prompt used to design this (v0 / Bolt / Cursor / Framer AI):
 *
 *   Build a magnetic button in React + Framer Motion + Tailwind.
 *   Follow the cursor inside a 60px radius with spring physics
 *   (stiffness 150, damping 15). Snap back to origin when the
 *   cursor leaves. Respect prefers-reduced-motion. Rounded-full
 *   pill, black background, white text. Editorial ease.
 *
 * Awwwards-tier version (with magnetic-orbit + glow shader) →
 *   https://cuedesign.space/component/cue056
 *
 * Full library, prompts + React source → https://cuedesign.space
 * ────────────────────────────────────────────
 */
export function MagneticButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useSpring(0, { stiffness: 150, damping: 15 })
  const y = useSpring(0, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY
    const dist = Math.hypot(dx, dy)
    if (dist < 60) {
      x.set(dx * 0.4)
      y.set(dy * 0.4)
    }
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ x, y }}
      className={`inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 motion-reduce:transform-none ${className}`}
    >
      {children}
    </motion.button>
  )
}
