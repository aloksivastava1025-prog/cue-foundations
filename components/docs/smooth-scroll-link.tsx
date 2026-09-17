"use client"

import type { ReactNode } from "react"

/**
 * Click → smooth-scrolls to `#targetId` WITHOUT appending `#targetId`
 * to the URL. Uses element.scrollIntoView + history.replaceState so
 * the address bar stays clean (avoids the "why is there a hash in
 * my URL" question).
 */
export function SmoothScrollLink({
  targetId,
  className,
  children,
}: {
  targetId: string
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById(targetId)
        if (!el) return
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }}
      className={className}
    >
      {children}
    </button>
  )
}
