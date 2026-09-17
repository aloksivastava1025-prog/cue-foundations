/**
 * Cue Foundations — generate live-preview wrappers.
 * ─────────────────────────────────────────────────────
 * For every component under components/foundations/:
 *   • React source with `export default function X` → write
 *     components/previews/foundations/<slug>.tsx that imports X and
 *     mounts it inside a demo frame. Flip previewMode → "live" in
 *     registry.ts.
 *   • Raw HTML source (starts with <!DOCTYPE or <html>) → flip
 *     previewMode → "html" in registry.ts. The detail page renders
 *     these in an iframe srcDoc.
 *   • Skip components that already have a hand-crafted preview
 *     wrapper (button-magnetic / tilt-card / theme-toggle / tabs-pill).
 *
 * Also rewrites the PREVIEW_MAP block inside
 * app/components/[slug]/page.tsx so all wrappers are wired up.
 * ─────────────────────────────────────────────────────
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const HAND_CRAFTED = new Set(['button-magnetic', 'tilt-card', 'theme-toggle', 'tabs-pill'])

/** Turn kebab-case into PascalCase so we can name the preview export. */
function pascal(slug) {
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

async function main() {
  const foundationsDir = path.join(ROOT, 'components/foundations')
  const files = (await fs.readdir(foundationsDir)).filter((f) => f.endsWith('.tsx'))

  const wrappers = [] // {slug, wrapperExport}
  const htmlSlugs = []

  for (const file of files) {
    const slug = file.replace(/\.tsx$/, '')
    if (HAND_CRAFTED.has(slug)) {
      wrappers.push({ slug, wrapperExport: `${pascal(slug)}Preview` })
      continue
    }

    const src = await fs.readFile(path.join(foundationsDir, file), 'utf-8')

    if (/^\s*(?:\/\*[\s\S]*?\*\/\s*)?<!DOCTYPE|<html/im.test(src)) {
      htmlSlugs.push(slug)
      continue
    }

    // Find the exported component name.
    let componentName = null
    const defaultMatch = src.match(/export default function ([A-Z][A-Za-z0-9_]*)/)
    if (defaultMatch) componentName = defaultMatch[1]
    else {
      const namedMatch = src.match(/export function ([A-Z][A-Za-z0-9_]*)/)
      if (namedMatch) componentName = namedMatch[1]
    }
    if (!componentName) {
      console.warn(`[preview] ⚠ ${slug} has no recognizable exported component; skipping`)
      continue
    }

    const wrapperExport = `${pascal(slug)}Preview`
    // Default-exported components need { default: X } — named-exported use { X }.
    const importLine = defaultMatch
      ? `import ${componentName} from "@/components/foundations/${slug}"`
      : `import { ${componentName} } from "@/components/foundations/${slug}"`

    const wrapper = `"use client"

${importLine}

/**
 * Docs-only preview wrapper — mounts the real component inside a
 * bounded frame so it renders cleanly on the detail page. If the
 * component needs a specific viewport height or its own scroll
 * container, tweak the wrapper below.
 */
export function ${wrapperExport}() {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <${componentName} />
      </div>
    </div>
  )
}
`
    const wrapperPath = path.join(ROOT, 'components/previews/foundations', `${slug}.tsx`)
    await fs.writeFile(wrapperPath, wrapper, 'utf-8')
    wrappers.push({ slug, wrapperExport })
    console.log(`[preview] ✓ ${slug} → live (${componentName})`)
  }

  // ── Flip registry.ts previewMode values ─────────────────────
  const REGISTRY = path.join(ROOT, 'lib/registry.ts')
  let reg = await fs.readFile(REGISTRY, 'utf-8')
  const wrapperSlugSet = new Set(wrappers.map((w) => w.slug))
  const htmlSlugSet = new Set(htmlSlugs)

  // Walk each object literal in the registry array and flip previewMode
  // based on slug. Simple regex over `slug: "X", ...,  previewMode: "Y"`.
  reg = reg.replace(
    /(slug:\s*"([^"]+)"[\s\S]*?previewMode:\s*")([^"]+)(")/g,
    (m, before, slug, current, after) => {
      if (wrapperSlugSet.has(slug)) return `${before}live${after}`
      if (htmlSlugSet.has(slug)) return `${before}html${after}`
      return m
    },
  )
  await fs.writeFile(REGISTRY, reg, 'utf-8')

  // ── Add "html" to PreviewMode type union if missing ─────────
  reg = await fs.readFile(REGISTRY, 'utf-8')
  if (!/PreviewMode\s*=\s*"live"\s*\|\s*"video"\s*\|\s*"image"\s*\|\s*"html"/.test(reg)) {
    reg = reg.replace(
      /export type PreviewMode = "live" \| "video" \| "image"/,
      'export type PreviewMode = "live" | "video" | "image" | "html"',
    )
    await fs.writeFile(REGISTRY, reg, 'utf-8')
  }

  // ── Rewrite PREVIEW_MAP + imports inside detail page ────────
  const DETAIL = path.join(ROOT, 'app/components/[slug]/page.tsx')
  let detail = await fs.readFile(DETAIL, 'utf-8')

  // Build the new import + PREVIEW_MAP blocks.
  const importLines = wrappers
    .map((w) => `import { ${w.wrapperExport} } from "@/components/previews/foundations/${w.slug}"`)
    .join('\n')

  const mapEntries = wrappers
    .map((w) => `  "${w.slug}": ${w.wrapperExport},`)
    .join('\n')

  // Replace everything from the first "@/components/previews/foundations"
  // import up to the closing `}` of the current PREVIEW_MAP.
  detail = detail.replace(
    /(import \{ MagneticButtonPreview \}[\s\S]*?const PREVIEW_MAP: Record<string, \(\) => React\.JSX\.Element> = \{[\s\S]*?\})/,
    `${importLines}\n\nconst PREVIEW_MAP: Record<string, () => React.JSX.Element> = {\n${mapEntries}\n}`,
  )

  await fs.writeFile(DETAIL, detail, 'utf-8')

  console.log(`\n[preview] wrote ${wrappers.length} wrappers, ${htmlSlugs.length} HTML iframes`)
  console.log('[preview] HTML components:', htmlSlugs.join(', '))
}

main().catch((err) => {
  console.error('[preview] failed:', err)
  process.exit(1)
})
