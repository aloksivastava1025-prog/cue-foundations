"use client"

import DynamicNotchPoll from "@/components/foundations/dynamic-island-feedback-notch"

/**
 * Docs-only preview wrapper — mounts the real component inside a
 * bounded frame so it renders cleanly on the detail page. If the
 * component needs a specific viewport height or its own scroll
 * container, tweak the wrapper below.
 */
export function DynamicIslandFeedbackNotchPreview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <DynamicNotchPoll />
      </div>
    </div>
  )
}
