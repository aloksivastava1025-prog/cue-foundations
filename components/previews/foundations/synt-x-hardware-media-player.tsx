"use client"

import SyntXPlayer from "@/components/foundations/synt-x-hardware-media-player"

/**
 * Auto-generated live preview wrapper. Renders the component inside
 * a __cue-body-shim scope so any body{} rules the sanitizer moved
 * off <body> (fullscreen bg, centering, min-height) apply here
 * instead. Regenerated on every sync-kit run — do not edit by hand.
 */
export function SyntXHardwareMediaPlayerPreview() {
  return (
    <div className="__cue-body-shim" style={{ minHeight: "100%", width: "100%" }}>
      <SyntXPlayer />
    </div>
  )
}
