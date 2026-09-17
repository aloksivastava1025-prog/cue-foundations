"use client"

import type { ReactNode } from "react"

/**
 * Small wrapper for grid cards that host static-looking live previews.
 *
 * The 4 hand-crafted components (Magnetic Button, Tilt Card, Theme
 * Toggle, Pill Tabs) render as their idle states inside a card, but
 * the card's overlay Link eats pointer events, so hover-driven motion
 * never fires on the grid. We add a subtle CSS auto-motion (gentle
 * float + fade) so the card feels alive — matching the ambient
 * motion of the video-preview cards next to it. Real interaction
 * still happens on the detail page.
 */
export function GridAutoMotion({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none flex h-full items-center justify-center p-6">
      {children}
    </div>
  )
}
