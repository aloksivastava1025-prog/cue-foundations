"use client"

import { useEffect, useRef } from "react"

/**
 * Cue Kit hero headline — text reveal with a rainbow color-band
 * sweep. Ported from the Framer Dia_Text_Reveal module: left of the
 * moving band is solid #2D2D2D, the band itself flows through five
 * rainbow stops, and right of the band is transparent. On page load
 * the band travels from -17% to 117% across the text over ~2s using
 * a cubic-in-out easing, revealing the headline from left to right.
 *
 * Constants match the source verbatim so the visual identity stays
 * consistent if we ever ship a scroll-pinned variant later.
 */

const DEFAULT_COLORS = ["#c679c4", "#fa3d1d", "#ffb005", "#e1e1fe", "#0358f7"]
const BAND_HALF = 17
const SWEEP_START = -17
const SWEEP_END = 117
const TEXT_COLOR = "#2D2D2D"
// Medium pacing — 2.2s reads as intentional on desktop without
// dragging; 200ms delay lets hydration settle before the sweep
// starts so the reveal always begins from the very start.
const DURATION_MS = 2200
const START_DELAY_MS = 200

/** Framer's buildGradient — verbatim. */
function buildGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = pos - BAND_HALF
  const bandEnd = pos + BAND_HALF
  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`
  }
  const parts: string[] = []
  if (bandStart > 0) parts.push(`${textColor} 0%`, `${textColor} ${bandStart}%`)
  colors.forEach((c, i) => {
    const pct = bandStart + (i / (colors.length - 1)) * (BAND_HALF * 2)
    parts.push(`${c} ${pct}%`)
  })
  if (bandEnd < 100) parts.push(`transparent ${bandEnd}%`, `transparent 100%`)
  return `linear-gradient(90deg, ${parts.join(", ")})`
}

/** Cubic in-out — verbatim. */
const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2

export function HeroHeadingReveal({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Respect users who don't want motion — just paint the solid
    // color and skip the sweep.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      if (ref.current) {
        ref.current.style.backgroundImage = `linear-gradient(90deg, ${TEXT_COLOR}, ${TEXT_COLOR})`
      }
      return
    }

    let raf = 0
    let cancelled = false
    let startTs = 0

    // If the user scrolls while the reveal is playing, jump the
    // heading to the fully-revealed state immediately. Per-frame
    // backgroundImage writes + smooth scroll fight for the main
    // thread on some devices, which felt like the page was pinning.
    // Better to end the animation cleanly than to jank the scroll.
    const finish = () => {
      if (cancelled) return
      cancelled = true
      cancelAnimationFrame(raf)
      if (ref.current) {
        ref.current.style.backgroundImage = `linear-gradient(90deg, ${TEXT_COLOR}, ${TEXT_COLOR})`
      }
      window.removeEventListener("scroll", onScroll)
    }
    const onScroll = () => finish()

    const tick = (now: number) => {
      if (cancelled) return
      const t = Math.min(1, (now - startTs) / DURATION_MS)
      const eased = sweepEase(t)
      const pos = SWEEP_START + eased * (SWEEP_END - SWEEP_START)
      if (ref.current) {
        ref.current.style.backgroundImage = buildGradient(
          pos,
          DEFAULT_COLORS,
          TEXT_COLOR,
        )
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        window.removeEventListener("scroll", onScroll)
      }
    }

    // Wait for fonts to be ready (so the sweep doesn't fire while
    // metric-shifting from fallback → Inter is still happening), then
    // give the browser a beat to paint before starting.
    const kick = () => {
      if (cancelled) return
      startTs = performance.now()
      window.addEventListener("scroll", onScroll, { passive: true, once: true })
      raf = requestAnimationFrame(tick)
    }
    const fontsReady = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready
    if (fontsReady) {
      fontsReady.then(() => setTimeout(kick, START_DELAY_MS))
    } else {
      setTimeout(kick, START_DELAY_MS)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <h1
      ref={ref}
      className="mb-5 text-[28px] font-medium leading-[1.15] tracking-tight md:text-[44px]"
      style={{
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        // Initial state: fully transparent (band at -17, before
        // reveal starts). Prevents flash of solid text on hydration.
        backgroundImage: buildGradient(SWEEP_START, DEFAULT_COLORS, TEXT_COLOR),
      }}
    >
      {children}
    </h1>
  )
}
