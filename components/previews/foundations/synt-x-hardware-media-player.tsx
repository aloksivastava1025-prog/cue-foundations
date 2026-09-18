"use client"

import SyntXPlayer from "@/components/foundations/synt-x-hardware-media-player"

/**
 * Auto-generated live preview wrapper. Fullscreen components render
 * bare so they own the viewport; small components (buttons, cards,
 * chips) get a centering flex parent so they don't stick to the
 * top-left corner. Regenerated on every sync-kit run — do not edit.
 */
export function SyntXHardwareMediaPlayerPreview() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SyntXPlayer />
    </div>
  )
}
