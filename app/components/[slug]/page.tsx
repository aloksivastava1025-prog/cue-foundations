import Link from "next/link"
import { notFound } from "next/navigation"
import fs from "node:fs/promises"
import path from "node:path"
import { getRegistryItem, registry, type RegistryItem } from "@/lib/registry"
import { InstallBlock } from "@/components/docs/install-block"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import { CopyBlock } from "@/components/docs/copy-block"
import { DocsSidebar } from "@/components/docs/sidebar"
import { PREVIEW_MAP, SAFE_LIVE_SLUGS } from "@/lib/preview-map"
import { CueCtaButton } from "@/components/docs/cue-cta-button"
import { PreviewToggle } from "@/components/docs/preview-toggle"
import { LiveScaled } from "@/components/docs/live-scaled"

/**
 * Component detail page — Cue Foundations Design DNA applied.
 * Same palette / typography / geometry / elevation tokens as the
 * homepage: white canvas · #FAFAFA feature surfaces · Inter · 4px
 * outer geometry · barely-visible shadow · indigo #5C6DFF accent.
 */

export async function generateStaticParams() {
  return registry.map((item) => ({ slug: item.slug }))
}

/** Per-component metadata for SEO + social sharing. Uses the poster
 *  as the OG image; falls back to the site default. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getRegistryItem(slug)
  if (!item) return {}
  const url = `https://kit.cuedesign.space/components/${item.slug}`
  const title = item.name // root layout template appends " — Cue Kit"
  const desc = item.description
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: desc,
      siteName: "Cue Kit",
      images: item.posterSrc ? [item.posterSrc] : undefined,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description: desc,
      images: item.posterSrc ? [item.posterSrc] : undefined,
    },
  }
}

function formatDate(iso?: string) {
  if (!iso) return null
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function categoryLabel(cat: RegistryItem["category"]) {
  const map: Record<RegistryItem["category"], string> = {
    buttons: "Buttons",
    inputs: "Inputs",
    cards: "Cards",
    layouts: "Layouts",
    motion: "Motion",
    overlays: "Overlays",
    charts: "Charts",
    typography: "Typography",
  }
  return map[cat]
}

const DNA_SHADOW = "0 12px 30px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.02)"

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getRegistryItem(slug)
  if (!item) notFound()

  const hasCode = item.codeAvailable !== false && !!item.sourcePath
  const [source, prompt] = await Promise.all([
    hasCode
      ? fs.readFile(path.join(process.cwd(), item.sourcePath), "utf-8")
      : Promise.resolve(""),
    fs.readFile(path.join(process.cwd(), item.promptPath), "utf-8"),
  ])

  const Preview = PREVIEW_MAP[slug]
  const canMountLive = item.previewMode === "live" && !!Preview && SAFE_LIVE_SLUGS.has(slug)
  // Video ⇄ Live toggle available whenever the slug has a live
  // preview registered AND a video preview. User defaults to video
  // (safe/fast); one click flips to the mounted React component.
  const hasVideoToggle = !!Preview && SAFE_LIVE_SLUGS.has(slug) && !!item.videoSrc

  // Reusable live-mount block (used by both the plain-live branch
  // and the Live half of the Video⇄Live toggle). Wide fanned /
  // scroll-driven components would otherwise clip against the
  // detail-page column; give the live pane its own min-h + horizontal
  // overflow-x-auto so wide layouts stay visible without pushing the
  // whole page sideways.
  // Live pane — bounded viewport, no forced sizing. Outer clips so
  // absolute-positioned children (fanned carousels, escaping cards)
  // can't blow the page layout sideways. Inner is a relative,
  // scrollable container — component renders at its natural size and
  // the user scrolls if it's bigger than the frame. Zero compression.
  const livePane = Preview ? (
    <div
      className="relative overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA]"
      style={{ boxShadow: DNA_SHADOW }}
    >
      <div className="absolute left-4 top-4 z-10 rounded-full border border-[#E5E7EB] bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-[#6B7280] shadow-sm">
        You can interact
      </div>
      <div
        className="relative min-h-[520px] max-h-[80vh] w-full overflow-auto"
        style={{
          // `contain: paint` clips escaping paint without breaking
          // sticky / absolute positioning inside. `layout` + `size`
          // would create a layout containment root, which disables
          // position:sticky bounds — components like Sticky Cascade
          // relied on the pane being a normal scroll container.
          contain: "paint",
          isolation: "isolate",
        }}
      >
        {/* Responsive zoom wrapper — mobile 0.45, tablet 0.6, desktop
            0.7. Wide components fit every viewport without clipping. */}
        <LiveScaled>
          <Preview />
        </LiveScaled>
      </div>
    </div>
  ) : null

  // Preview panel — DNA feature-card treatment.
  const previewPanel = (() => {
    // Video ⇄ Live toggle path — user starts on Video (safe/fast),
    // clicks Live to mount the real React component.
    if (hasVideoToggle) {
      const videoPane = (
        <div
          className="overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA]"
          style={{ boxShadow: DNA_SHADOW }}
        >
          <video
            src={item.videoSrc}
            poster={item.posterSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full"
          />
        </div>
      )
      return <PreviewToggle video={videoPane} live={livePane} />
    }

    if (canMountLive) return livePane
    if (item.previewMode === "html") {
      return (
        <div
          className="overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-white"
          style={{ boxShadow: DNA_SHADOW }}
        >
          <iframe
            srcDoc={source}
            title={`${item.name} preview`}
            sandbox="allow-scripts allow-same-origin"
            className="h-[400px] w-full border-0 md:h-[560px]"
          />
        </div>
      )
    }
    // Any live-marked component we can't safely mount falls back to
    // its R2 video preview here — same treatment as previewMode video.
    if (item.videoSrc) {
      return (
        <div
          className="overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA]"
          style={{ boxShadow: DNA_SHADOW }}
        >
          <video
            src={item.videoSrc}
            poster={item.posterSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full"
          />
        </div>
      )
    }
    if (item.previewMode === "image" && item.posterSrc) {
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <img
          src={item.posterSrc}
          alt={item.name}
          className="w-full rounded-[4px] border border-[#E5E7EB]"
          style={{ boxShadow: DNA_SHADOW }}
        />
      )
    }
    return (
      <div
        className="rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-16 text-center text-[#9CA3AF]"
        style={{ boxShadow: DNA_SHADOW }}
      >
        Preview coming soon
      </div>
    )
  })()

  const usagePanel = (
    <CopyBlock
      content={prompt}
      label="The AI prompt"
      bodyClassName="max-h-[500px] whitespace-pre-wrap"
    />
  )

  const codePanel = hasCode ? (
    <CopyBlock
      content={source}
      bodyClassName="max-h-[600px] font-mono text-xs"
    />
  ) : (
    <div
      className="rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-8"
      style={{ boxShadow: DNA_SHADOW }}
    >
      <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-[#5C6DFF]">
        Prompt-only
      </div>
      <p className="mb-4 max-w-lg text-[13px] leading-[1.5] text-[#6B7280]">
        This component is shipped as an AI prompt. Copy the prompt from the
        Usage tab into v0, Bolt, Cursor, Framer AI, or Claude and generate
        the React source. Or grab the polished, ready-to-paste code from
        Cue+.
      </p>
      {item.premiumHref && (
        <CueCtaButton href={item.premiumHref} size="sm">
          Get the polished version on Cue+ →
        </CueCtaButton>
      )}
    </div>
  )

  const relatedItems = (item.related ?? [])
    .map((s) => getRegistryItem(s))
    .filter((r): r is RegistryItem => Boolean(r))

  const isInteractive = canMountLive

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#111827]">
      {/* Nav — mirrors homepage */}
      <nav className="border-b border-[#E5E7EB]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-[17px] font-semibold tracking-tight text-[#111827] hover:text-[#5C6DFF]"
          >
            Cue<span className="text-[#5C6DFF]">.</span>{" "}
            <span className="text-[13px] font-normal text-[#6B7280]">Kit</span>
          </Link>
          <div className="flex items-center gap-6 text-[13px]">
            <Link href="/" className="text-[#6B7280] hover:text-[#111827]">
              Components
            </Link>
            <Link href="/#faq" className="text-[#6B7280] hover:text-[#111827]">
              FAQ
            </Link>
            <a
              href="https://github.com/aloksivastava1025-prog/cue-foundations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#6B7280] hover:text-[#111827]"
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
              <span>GitHub</span>
            </a>
            <CueCtaButton href="https://cuedesign.space" size="sm">
              Cue+ →
            </CueCtaButton>
          </div>
        </div>
      </nav>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-5 py-8 md:gap-10 md:px-6 md:py-10">
        <DocsSidebar activeSlug={item.slug} />
        <div className="min-w-0 flex-1">
        {/* Breadcrumb */}
        <div className="mb-6 text-[13px] text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#111827]">
            {categoryLabel(item.category)}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#6B7280]">{item.name}</span>
        </div>

        {/* Title row */}
        <div className="mb-3 flex items-start justify-between gap-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[28px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D] md:text-[40px]">
              {item.name}
            </h1>
            {item.isNew && (
              <span className="rounded-full border border-[#5C6DFF]/20 bg-[#EFF2FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#5C6DFF]">
                New
              </span>
            )}
            {isInteractive && (
              <span
                title="This component is fully interactive on this page — hover, click, drag."
                className="rounded-full border border-[#E5E7EB] bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-[#6B7280]"
              >
                Interactive
              </span>
            )}
          </div>
          <button
            type="button"
            className="hidden shrink-0 items-center gap-2 rounded-[4px] border border-[#E5E7EB] bg-white px-3 py-1.5 text-[13px] text-[#6B7280] hover:text-[#111827] sm:inline-flex"
          >
            <span>⧉</span> Copy Page
          </button>
        </div>

        {/* Description */}
        <p className="mb-10 max-w-2xl text-[16px] leading-[1.5] text-[#6B7280]">
          {item.description}
        </p>

        {/* Preview / Usage / Code tabs */}
        <PreviewTabs preview={previewPanel} usage={usagePanel} code={codePanel} />

        {/* Install */}
        {hasCode && (
          <section className="mt-14">
            <h2 className="mb-2 text-[22px] font-semibold leading-[1.35] tracking-tight text-[#111827]">
              Install
            </h2>
            <p className="mb-4 text-[13px] text-[#6B7280]">
              Add it with the shadcn CLI, or copy the source manually.
            </p>
            <InstallBlock slug={item.slug} sourceContent={source} />
          </section>
        )}

        {/* API Reference */}
        {item.api && (
          <section className="mt-14">
            <h2 className="mb-6 text-[22px] font-semibold leading-[1.35] tracking-tight text-[#111827]">
              API Reference
            </h2>

            <ApiTable name={item.api.main.name} props={item.api.main.props} />

            {item.api.subs?.map((sub) => (
              <div key={sub.name} className="mt-8">
                <ApiTable name={sub.name} props={sub.props} />
              </div>
            ))}
          </section>
        )}

        {/* Related components */}
        {relatedItems.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 text-[22px] font-semibold leading-[1.35] tracking-tight text-[#111827]">
              Related components
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {relatedItems.map((r) => (
                <Link
                  key={r.slug}
                  href={`/components/${r.slug}`}
                  className="group flex flex-col rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-2 transition-colors hover:border-[#D1D5DB]"
                  style={{ boxShadow: DNA_SHADOW }}
                >
                  <div className="mb-3 h-[160px] overflow-hidden rounded-[4px] border border-[rgba(0,0,0,0.03)] bg-white">
                    {r.videoSrc ? (
                      <video
                        src={r.videoSrc}
                        poster={r.posterSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-contain"
                      />
                    ) : r.posterSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.posterSrc}
                        alt={r.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[11px] text-[#9CA3AF]">
                        No preview
                      </div>
                    )}
                  </div>
                  <div className="px-1 pb-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#111827] group-hover:text-[#5C6DFF]">
                        {r.name}
                      </span>
                      {r.isNew && (
                        <span className="rounded-full border border-[#5C6DFF]/20 bg-[#EFF2FF] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#5C6DFF]">
                          New
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-[12px] leading-[1.5] text-[#6B7280]">
                      {r.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contributor + Updated */}
        <section className="mt-14 border-t border-[#E5E7EB] pt-6 text-[13px] text-[#9CA3AF]">
          {item.contributor && (
            <div className="mb-2">
              <span className="text-[#6B7280]">Contributed by</span>{" "}
              {item.contributor.href ? (
                <a
                  href={item.contributor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#111827] underline decoration-[#E5E7EB] underline-offset-4 hover:decoration-[#9CA3AF]"
                >
                  {item.contributor.name}
                </a>
              ) : (
                <span className="text-[#111827]">{item.contributor.name}</span>
              )}
            </div>
          )}
          {(item.updatedAt || item.addedAt) && (
            <div className="text-[9px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
              Updated {formatDate(item.updatedAt ?? item.addedAt)}
            </div>
          )}
        </section>
        </div>
      </div>
    </main>
  )
}

function ApiTable({ name, props }: { name: string; props: { name: string; type: string; description: string; optional?: boolean }[] }) {
  return (
    <div>
      <div className="mb-3 font-mono text-[13px] text-[#111827]">{name}</div>
      <div className="overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-white">
        {props.map((p, i) => (
          <div
            key={p.name}
            className={`grid grid-cols-[140px_1fr] gap-6 px-4 py-4 ${
              i > 0 ? "border-t border-[#E5E7EB]" : ""
            }`}
          >
            <div className="font-mono text-[13px] text-[#111827]">
              {p.name}
              {p.optional && <span className="text-[#9CA3AF]">?</span>}
            </div>
            <div>
              <div className="mb-1 inline-flex rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] px-2 py-0.5 font-mono text-xs text-[#5C6DFF]">
                {p.type}
              </div>
              <p className="text-[13px] leading-[1.5] text-[#6B7280]">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
