"use client"

import { MagneticButton } from "@/components/foundations/button-magnetic"

/**
 * Docs-only preview for the Magnetic Button component.
 * Wraps the real component in a demo frame with a soft background
 * and enough breathing room to feel the motion.
 */
export function MagneticButtonPreview() {
  return (
    <MagneticButton>
      Hover me
      <span className="opacity-70">→</span>
    </MagneticButton>
  )
}
