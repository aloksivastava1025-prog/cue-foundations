import Link from "next/link"
import { registry } from "@/lib/registry"
import { ComponentCard } from "@/components/docs/component-card"
import { CueCtaButton } from "@/components/docs/cue-cta-button"

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
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5">
          <div className="flex items-baseline gap-2">
            <span className="text-[17px] font-semibold tracking-tight text-[#111827]">
              Cue<span className="text-[#5C6DFF]">.</span>
              <span className="ml-1 text-[13px] font-normal text-[#6B7280]">
                Foundations
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-[13px]">
            <a
              href="https://github.com/aloksivastava1025-prog/cue-foundations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] transition-colors hover:text-[#111827]"
            >
              GitHub
            </a>
            <CueCtaButton href="https://cuedesign.space" size="sm">
              Cue+ →
            </CueCtaButton>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-16 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-[#6B7280]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5C6DFF]" />
          {visibleRegistry.length} components · MIT · free
        </div>
        <h1 className="mb-5 text-[40px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[44px]">
          Awwwards-tier components you can use in your project.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-[16px] leading-[1.5] text-[#6B7280]">
          Some ship with just the AI prompt, some ship with prompt + React code.
          Copy either into v0, Cursor, Bolt, or Framer AI.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
          <div className="rounded-full border border-[#E5E7EB] bg-[#FAFAFA] px-5 py-2 font-mono text-[13px] text-[#111827]">
            npx shadcn@latest add
            <span className="text-[#5C6DFF]"> https://foundations.cuedesign.space/r/…</span>
          </div>
          <Link
            href="#recently-launched"
            className="rounded-full bg-[#1A1A1A] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-black"
          >
            Browse components →
          </Link>
        </div>
      </section>

      {/* Recently launched */}
      <section id="recently-launched" className="mx-auto max-w-[1280px] px-6 pt-16 pb-8">
        <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
          New
        </div>
        <h2 className="mb-8 text-[40px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D]">
          Recently launched
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRegistry.slice(0, 3).map((item) => (
            <ComponentCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* Components grid */}
      <section id="components" className="mx-auto max-w-[1280px] px-6 pt-16 pb-16">
        <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
          Components
        </div>
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="text-[40px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D]">
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

      {/* CTA to Cue+ */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 text-center">
        <h2 className="mb-4 text-[40px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[44px]">
          Want the Awwwards-tier versions?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-[16px] leading-[1.5] text-[#6B7280]">
          Cue+ has 150+ hand-picked premium components — cinematic heroes,
          scroll storyboards, custom cursors. Prompt + React code.
          $99 lifetime, first 50 founding members.
        </p>
        <CueCtaButton href="https://cuedesign.space">Explore Cue+</CueCtaButton>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-6 text-[13px] text-[#9CA3AF]">
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
