"use client"

import { useEffect, useState, type ReactNode } from "react"

/**
 * Preview panel with a Video ⇄ Live toggle.
 * Default = Video (fast, safe, no risk of a heavy component blowing
 * up the layout on first paint). Click Live → mounts the real React
 * component. Toggle back to Video → live unmounts, video resumes.
 *
 * Mobile UX: interactive components need pointer + hover + real
 * screen space to feel right — mobile users get a clear "desktop
 * only" message with the video staying visible above it, so they
 * still see what the component does.
 */
export function PreviewToggle({
  video,
  live,
}: {
  video: ReactNode
  live: ReactNode
}) {
  const [mode, setMode] = useState<"video" | "live">("video")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // On mobile: skip the toggle entirely, just show the video. Live
  // preview needs pointer + hover + real screen space; a phone can't
  // do it justice, so we don't tempt the user with a broken option.
  if (isMobile) return <div>{video}</div>

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
