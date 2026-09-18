"use client"

import { useEffect, useRef } from "react"

/**
 * Viewport-scoped autoplay video for the homepage grid.
 * ────────────────────────────────────────────────────────
 * Rendering ~40 <video autoPlay preload="auto"> tags at once
 * exhausts the browser's H.264 decoder budget — Chrome/Safari
 * silently reject the autoplay on most cards and the grid shows
 * static posters. Fix: only mount + play the videos that are
 * actually near the viewport, pause the rest.
 *
 *   preload="none" — don't fetch anything until the tag enters
 *                    the observer's margin
 *   IntersectionObserver at rootMargin: 200px — start prep before
 *                                                the user reaches
 *                                                the card
 *   Once visible, set src → play() → keep looping. Off-screen: pause.
 */
export function CardVideo({
  src,
  poster,
  className,
}: {
  src: string
  poster?: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!video.src) video.src = src
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.05 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [src])

  return (
    <video
      ref={ref}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      className={className}
    />
  )
}
