import posthog from "posthog-js"

/**
 * Next.js 15.3+ client instrumentation — runs once, before any
 * React code, to initialize PostHog. The `defaults` unlocks the
 * modern preset: auto-pageview on route change, autocapture,
 * rageclicks, dead-clicks, sensible privacy defaults.
 */
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: "2026-05-30",
})
