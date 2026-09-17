"use client"

import { useState } from "react"

type Item = { q: string; a: React.ReactNode }

/**
 * Homepage FAQ — accordion. Positioning: "This is open-source. Treat
 * it as a trial. Explore, ship real projects, and if you want the
 * premium studio-grade version, upgrade to Cue+." No hard sell —
 * every answer is truthful and helpful first.
 * Design tokens exactly per DNA: #FAFAFA rows, #E5E7EB borders,
 * 4px geometry, Inter 17/15/13 scale, indigo accent for links.
 */
export function Faq() {
  const items: Item[] = [
    {
      q: "What is Cue Kit?",
      a: (
        <>
          A free, open-source library of 40+ Awwwards-tier React
          components — every one ships with the AI prompt that designed
          it. Think of it as a full trial of{" "}
          <a
            href="https://cuedesign.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C6DFF] underline decoration-[#5C6DFF]/30 underline-offset-2 hover:decoration-[#5C6DFF]"
          >
            Cue+
          </a>
          . Explore, ship real projects, and upgrade only when you want
          the studio-grade versions.
        </>
      ),
    },
    {
      q: "Is it really free? Can I use it commercially?",
      a: (
        <>
          Yes. MIT licensed — use in commercial products, sell them, no
          attribution required. No paywall, no rate limit, no strings.
        </>
      ),
    },
      {
      q: "How is Cue Kit different from Cue+ (the paid version)?",
      a: (
        <>
          <strong className="text-[#111827]">Both are Awwwards-tier — I never ship filler in either.</strong>{" "}
          Cue Kit is the open-source, curated slice for free tier and
          exploring — 40+ hand-built components you can drop into real
          projects today. Cue+ is the premium studio: 120+ cinematic
          components, Design DNA per component, and the Adapt API — for
          people who want more variety and taste transfer. Same taste
          bar. Deeper library.
        </>
      ),
    },
    {
      q: "How do I install a component?",
      a: (
        <>
          Copy the shadcn CLI command from any component page. Example:
          <pre className="mt-3 overflow-x-auto rounded-[4px] border border-[#E5E7EB] bg-white p-3 font-mono text-[12px] text-[#111827]">
            npx shadcn@latest add https://kit.cuedesign.space/r/[slug].json
          </pre>
          Requires shadcn set up in your Next.js + Tailwind project.
        </>
      ),
    },
    {
      q: "Some components only show a prompt — no code. Why?",
      a: (
        <>
          Those components ship as AI prompts. Paste the prompt into v0,
          Bolt, Cursor, Framer AI, or Claude — you&apos;ll get a working
          component styled to your design tokens. Or upgrade to Cue+ for
          the polished ready-to-paste version.
        </>
      ),
    },
    {
      q: "Can I contribute a component?",
      a: (
        <>
          Bug fixes and docs PRs welcome now on the{" "}
          <a
            href="https://github.com/aloksivastava1025-prog/cue-foundations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C6DFF] underline decoration-[#5C6DFF]/30 underline-offset-2 hover:decoration-[#5C6DFF]"
          >
            GitHub repo
          </a>
          . New component contributions open Q1 2026 — I&apos;m still
          the solo curator and want to keep the taste bar tight during
          launch. Star the repo to follow.
        </>
      ),
    },
    {
      q: "Do you track who installs?",
      a: (
        <>
          No user tracking on the CLI endpoint. The docs site uses basic
          anonymous page-view analytics only — no personal data, no cross-
          site profiles.
        </>
      ),
    },
    {
      q: "What if I want more? When should I upgrade to Cue+?",
      a: (
        <>
          If you&apos;re shipping serious client work and need cinematic
          heroes, scroll storyboards, or the Design DNA to drive your own
          taste system — that&apos;s Cue+.{" "}
          <a
            href="https://cuedesign.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C6DFF] underline decoration-[#5C6DFF]/30 underline-offset-2 hover:decoration-[#5C6DFF]"
          >
            $99 lifetime, first 50 founding members
          </a>
          . Otherwise, Cue Kit alone will carry you a long way.
        </>
      ),
    },
  ]

  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="mx-auto max-w-[900px] px-5 pt-10 pb-16 md:px-6 md:pt-16"
    >
      <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
        FAQ
      </div>
      <h2 className="mb-4 text-[28px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[40px]">
        Questions people ask
      </h2>
      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#6B7280]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          <span>5 new components ship weekly to Cue Kit</span>
        </span>
        <span className="hidden text-[#E5E7EB] sm:inline">·</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5C6DFF]" />
          <span>
            10+ ship weekly to{" "}
            <a
              href="https://cuedesign.space"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5C6DFF] underline decoration-[#5C6DFF]/30 underline-offset-2 hover:decoration-[#5C6DFF]"
            >
              Cue+
            </a>
          </span>
        </span>
      </div>

      <div className="overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-white">
        {items.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} className={i > 0 ? "border-t border-[#E5E7EB]" : ""}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FAFAFA]"
              >
                <span className="text-[15px] font-semibold text-[#111827] md:text-[17px]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-[#9CA3AF] transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-[14px] leading-[1.6] text-[#6B7280] md:text-[15px]">
                  {item.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
