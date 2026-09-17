"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

/**
 * Cue Foundations · Tilt Card
 * ────────────────────────────────────────────
 * A card that tilts on 3D axes as the cursor moves across it, with
 * a glare that follows the cursor. Editorial ease. Respects
 * prefers-reduced-motion.
 *
 * AI Prompt used → see /prompts/tilt-card.md
 *
 * Full library → https://cuedesign.space
 * ────────────────────────────────────────────
 */
export function TiltCard({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 160, damping: 18 })
  const rotY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 160, damping: 18 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const reset = () => { mx.set(0.5); my.set(0.5) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 text-white motion-reduce:transform-none ${className}`}
    >
      <motion.div
        aria-hidden="true"
        style={{
          background: useTransform(
            [mx, my],
            ([x, y]) =>
              `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(255,255,255,0.14), transparent 55%)`,
          ),
        }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative z-10">
        {children ?? (
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-white/40">PREMIUM</div>
            <div className="font-serif text-3xl italic">Tilt me</div>
            <p className="mt-2 max-w-[220px] text-sm text-white/60">
              Move your cursor across the card to see 3D tilt + glare.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
