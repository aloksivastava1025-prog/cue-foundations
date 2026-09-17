import Link from "next/link"
import { registry } from "@/lib/registry"
import { ComponentCard } from "@/components/docs/component-card"
import { CueCtaButton } from "@/components/docs/cue-cta-button"
import { HeroInstallChip } from "@/components/docs/hero-install-chip"
import { SmoothScrollLink } from "@/components/docs/smooth-scroll-link"
import { Faq } from "@/components/docs/faq"

/** Only show components with a real preview video. */
const visibleRegistry = registry.filter((item) => Boolean(item.videoSrc))

/**
 * Cue Foundations homepage — StackerBento Design DNA applied.
 *   Palette:  #FFFFFF canvas · #FAFAFA cards · #111827 text ·
 *             #5C6DFF indigo accent · #EFF2FF soft accent bg
 *   Typography: Inter · 500-weight section headings at 40px · 22/600
 *             card headings · 13/400 body copy · 9-10px uppercase
 *             metadata
 *   Geometry: 4px feature-card radius · pill controls
 *   Elevation: barely-visible DNA shadow only
 *   Spacing: 64px vertical section rhythm · 16px card gaps
 */
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      {/* Nav */}
      <nav className="border-b border-[#E5E7EB]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-5 py-4 md:px-6 md:py-5">
          <div className="flex items-baseline gap-2">
            <span className="text-[17px] font-semibold tracking-tight text-[#111827]">
              Cue<span className="text-[#5C6DFF]">.</span>
              <span className="ml-1 hidden text-[13px] font-normal text-[#6B7280] sm:inline">
                Kit
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px] md:gap-6">
            <a
              href="https://github.com/aloksivastava1025-prog/cue-foundations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#6B7280] transition-colors hover:text-[#111827]"
              aria-label="GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.17.92-.26 1.91-.38 2.9-.39.98.01 1.98.13 2.9.39 2.2-1.48 3.17-1.17 3.17-1.17.63 1.59.24 2.76.12 3.05.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.26 5.65.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <CueCtaButton href="https://cuedesign.space" size="sm">
              Cue+ →
            </CueCtaButton>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-5 pt-14 pb-12 text-center md:px-6 md:pt-24 md:pb-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-[#6B7280]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5C6DFF]" />
          {visibleRegistry.length} components · MIT · free
        </div>
        <h1 className="mb-5 text-[28px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[44px]">
          Awwwards-tier components you can use in your project.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-[15px] leading-[1.5] text-[#6B7280] md:text-[16px]">
          Some ship with just the AI prompt, some ship with prompt + React code.
          Copy either into any AI tool of your choice.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <HeroInstallChip />
          <SmoothScrollLink
            targetId="recently-launched"
            className="rounded-full bg-[#1A1A1A] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-black"
          >
            Browse components →
          </SmoothScrollLink>
        </div>
      </section>

      {/* Recently launched */}
      <section id="recently-launched" className="mx-auto max-w-[1280px] px-5 pt-10 pb-8 md:px-6 md:pt-16">
        <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
          New
        </div>
        <h2 className="mb-6 text-[28px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:mb-8 md:text-[40px]">
          Recently launched
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRegistry.slice(0, 3).map((item) => (
            <ComponentCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* Components grid */}
      <section id="components" className="mx-auto max-w-[1280px] px-5 pt-10 pb-16 md:px-6 md:pt-16">
        <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Components
        </div>
        <div className="mb-6 flex flex-col gap-2 md:mb-8 md:flex-row md:items-baseline md:justify-between md:gap-4">
          <h2 className="text-[28px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[40px]">
            Motion primitives
          </h2>
          <a
            href="https://cuedesign.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[#6B7280] hover:text-[#111827]"
          >
            Browse animated React components →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRegistry.slice(3).map((item) => (
            <ComponentCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <Faq />

      {/* CTA to Cue+ */}
      <section className="mx-auto max-w-[1280px] px-5 py-16 text-center md:px-6 md:py-24">
        <h2 className="mb-4 text-[28px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[44px]">
          Want the Awwwards-tier versions?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-[15px] leading-[1.5] text-[#6B7280] md:text-[16px]">
          Cue+ has 150+ hand-picked premium components — cinematic heroes,
          scroll storyboards, custom cursors. Prompt + React code.
          $99 lifetime, first 50 founding members.
        </p>
        <CueCtaButton href="https://cuedesign.space">Explore Cue+</CueCtaButton>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-3 px-5 py-6 text-[13px] text-[#9CA3AF] sm:flex-row sm:justify-between md:px-6">
          <span>
            Cue Foundations · MIT · built by{" "}
            <a
              href="https://x.com/Alok619308"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] underline decoration-[#E5E7EB] underline-offset-4 hover:text-[#111827] hover:decoration-[#9CA3AF]"
            >
              @Alok619308
            </a>
          </span>
          <a
            href="https://cuedesign.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B7280] hover:text-[#111827]"
          >
            cuedesign.space
          </a>
        </div>
      </footer>
    </main>
  )
}
