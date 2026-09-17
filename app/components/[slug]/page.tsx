import Link from "next/link"
import { notFound } from "next/navigation"
import fs from "node:fs/promises"
import path from "node:path"
import { getRegistryItem, registry, type RegistryItem } from "@/lib/registry"
import { InstallBlock } from "@/components/docs/install-block"
import { PreviewTabs } from "@/components/docs/preview-tabs"
import { CopyBlock } from "@/components/docs/copy-block"
import { PREVIEW_MAP } from "@/lib/preview-map"

/**
 * Component detail page — Cue Foundations Design DNA applied.
 * Same palette / typography / geometry / elevation tokens as the
 * homepage: white canvas · #FAFAFA feature surfaces · Inter · 4px
 * outer geometry · barely-visible shadow · indigo #5C6DFF accent.
 */

export async function generateStaticParams() {
  return registry.map((item) => ({ slug: item.slug }))
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

  // Preview panel — DNA feature-card treatment.
  const previewPanel = (() => {
    if (item.previewMode === "live" && Preview) {
      return (
        <div
          className="rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-16"
          style={{ boxShadow: DNA_SHADOW }}
        >
          <div className="flex min-h-[280px] items-center justify-center">
            <Preview />
          </div>
        </div>
      )
    }
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
            className="h-[560px] w-full border-0"
          />
        </div>
      )
    }
    if (item.previewMode === "video" && item.videoSrc) {
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
        <a
          href={item.premiumHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2 text-[13px] font-semibold text-white hover:bg-black"
        >
          Get the polished version on Cue+ →
        </a>
      )}
    </div>
  )

  const relatedItems = (item.related ?? [])
    .map((s) => getRegistryItem(s))
    .filter((r): r is RegistryItem => Boolean(r))

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      {/* Nav — mirrors homepage */}
      <nav className="border-b border-[#E5E7EB]">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-[17px] font-semibold tracking-tight text-[#111827] hover:text-[#5C6DFF]"
          >
            Cue<span className="text-[#5C6DFF]">.</span>{" "}
            <span className="text-[13px] font-normal text-[#6B7280]">Foundations</span>
          </Link>
          <div className="flex items-center gap-6 text-[13px]">
            <Link href="/" className="text-[#6B7280] hover:text-[#111827]">
              Components
            </Link>
            <a
              href="https://github.com/aloksivastava1025-prog/cue-foundations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] hover:text-[#111827]"
            >
              GitHub
            </a>
            <a
              href="https://cuedesign.space"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#1A1A1A] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-black"
            >
              Cue+ →
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10">
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
            <h1 className="text-[40px] font-medium leading-[1.15] tracking-tight text-[#2D2D2D]">
              {item.name}
            </h1>
            {item.isNew && (
              <span className="rounded-full border border-[#5C6DFF]/20 bg-[#EFF2FF] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#5C6DFF]">
                New
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
                  className="group rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] p-4 transition-colors hover:border-[#D1D5DB]"
                  style={{ boxShadow: DNA_SHADOW }}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-[#111827] group-hover:text-[#5C6DFF]">
                      {r.name}
                    </span>
                    {r.isNew && (
                      <span className="rounded-full border border-[#5C6DFF]/20 bg-[#EFF2FF] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#5C6DFF]">
                        New
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-[13px] leading-[1.5] text-[#6B7280]">
                    {r.description}
                  </p>
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
