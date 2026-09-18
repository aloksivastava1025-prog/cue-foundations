"use client"

import { useEffect } from "react"

/**
 * Neutralize the root `<body>` for the iframe preview. Cue Kit's
 * global body is `min-h-full flex flex-col bg-white` (fine for the
 * docs shell) but that fights fullscreen components — the flex-col
 * forces children to stack, and the min-h clashes with `100vh`
 * inside a bounded iframe. Reset to a plain document body so the
 * previewed component owns the viewport.
 */
export function BodyReset() {
  useEffect(() => {
    const body = document.body
    const prev = {
      display: body.style.display,
      flexDirection: body.style.flexDirection,
      minHeight: body.style.minHeight,
      margin: body.style.margin,
      padding: body.style.padding,
    }
    body.style.display = "block"
    body.style.flexDirection = ""
    body.style.minHeight = "0"
    body.style.margin = "0"
    body.style.padding = "0"
    body.classList.add("cue-preview-body")
    return () => {
      Object.assign(body.style, prev)
      body.classList.remove("cue-preview-body")
    }
  }, [])
  return null
}
