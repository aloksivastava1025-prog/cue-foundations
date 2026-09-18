"use client"

import SyntXPlayer from "@/components/foundations/synt-x-hardware-media-player"

/**
 * Auto-generated live preview wrapper. Centers the component in the
 * iframe so small components (buttons, cards, chips) don't stick to
 * the top-left corner. Fullscreen components override this with
 * their own layout. Regenerated on every sync-kit run — do not edit.
 */
export function SyntXHardwareMediaPlayerPreview() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SyntXPlayer />
    </div>
  )
}
