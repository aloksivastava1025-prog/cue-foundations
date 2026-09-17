"use client"

import { useState, type ReactNode } from "react"

/**
 * Preview panel with a Video ⇄ Live toggle.
 * Default = Video (fast, safe, no risk of a heavy component blowing
 * up the layout on first paint). Click Live → mounts the real React
 * component. Toggle back to Video → live unmounts, video resumes.
 *
 * Used on the detail page for any component whose slug is in
 * SAFE_LIVE_SLUGS AND has a videoSrc. Components without a videoSrc
 * still just mount live directly (see detail page routing).
 */
export function PreviewToggle({
  video,
  live,
}: {
  video: ReactNode
  live: ReactNode
}) {
  const [mode, setMode] = useState<"video" | "live">("video")

  return (
    <div>
      <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1 text-[11px]">
        {([
          ["video", "Video"],
          ["live", "Live"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${
              mode === id
                ? "bg-[#1A1A1A] text-white"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "video" ? video : live}
    </div>
  )
}
