"use client"

import { useEffect, useState, type ReactNode } from "react"

/**
 * Live-preview zoom wrapper — responsive scale so wide components
 * fit the live pane on every viewport. Mobile squeezes more (0.45),
 * tablet mid (0.6), desktop light (0.7). Uses CSS `zoom` (not
 * transform:scale) so the layout box shrinks too — no empty
 * gutters, no compensation math.
 */
export function LiveScaled({ children }: { children: ReactNode }) {
  const [zoom, setZoom] = useState(0.7)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setZoom(0.45)
      else if (w < 1024) setZoom(0.6)
      else setZoom(0.7)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return <div style={{ zoom }}>{children}</div>
}
