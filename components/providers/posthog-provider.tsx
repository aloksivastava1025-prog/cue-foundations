"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import posthog from "posthog-js"
import { PostHogProvider as Provider } from "posthog-js/react"

/**
 * PostHog analytics — same project as Cue paid, so Kit visitors +
 * Cue+ conversions land in one funnel. Autocapture is on for clicks,
 * pageviews, and form submits; custom events (install-copy, cue-plus-
 * cta, live-toggle) are fired inline where the interaction happens.
 */
if (typeof window !== "undefined") {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
  if (key && !posthog.__loaded) {
    posthog.init(key, {
      api_host: host,
      capture_pageview: false, // we send manually on route change
      capture_pageleave: true,
      persistence: "localStorage+cookie",
      autocapture: true,
    })
  }
}

function PageviewTracker() {
  const pathname = usePathname()
  const search = useSearchParams()
  useEffect(() => {
    if (!pathname) return
    const url = search?.toString()
      ? `${pathname}?${search.toString()}`
      : pathname
    posthog.capture("$pageview", { $current_url: url })
  }, [pathname, search])
  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </Provider>
  )
}
