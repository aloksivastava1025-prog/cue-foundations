"use client"

import { useEffect } from "react"

/**
 * On mount, if the URL landed with a hash (e.g. cross-page nav from
 * a detail page's FAQ link), let the browser jump to that anchor and
 * then strip the hash from the URL so the address bar stays clean.
 * Uses history.replaceState so no page reload / no history entry.
 */
export function HashScrollClean() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.location.hash) return
    // Give the browser a beat to complete its native anchor jump,
    // then rewrite the URL back to a hash-less version.
    const t = setTimeout(() => {
      history.replaceState(null, "", window.location.pathname + window.location.search)
    }, 400)
    return () => clearTimeout(t)
  }, [])
  return null
}
