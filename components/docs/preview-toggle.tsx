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

      {mode === "video" ? (
        video
      ) : isMobile ? (
        <div className="rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-8 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E5E7EB]">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M8 20h8" />
                <path d="M12 18v2" />
              </svg>
            </div>
            <h3 className="mb-1 text-[15px] font-semibold text-[#111827]">
              Live preview is desktop-only
            </h3>
            <p className="mb-4 text-[13px] leading-[1.5] text-[#6B7280]">
              Interactive components need pointer + hover + real screen space to feel right. Switch back to the video to see it in motion, or open this page on a laptop to play with the real thing.
            </p>
            <button
              type="button"
              onClick={() => setMode("video")}
              className="rounded-full bg-[#1A1A1A] px-4 py-2 text-[12px] font-semibold text-white hover:bg-black"
            >
              Watch the video →
            </button>
          </div>
        </div>
      ) : (
        live
      )}
    </div>
  )
}
