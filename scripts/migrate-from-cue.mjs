/**
 * Cue Foundations — one-shot migration from Cue's Supabase export.
 * ─────────────────────────────────────────────────────────────────
 * Reads prompt.json (rows of {id, title, prompt, code, tags,
 * category, hover_src, thumb_src, tier, ...}) and writes:
 *
 *   components/foundations/<slug>.tsx   ← cleaned React source
 *   lib/prompts/<slug>.md               ← the AI prompt as markdown
 *   lib/registry.ts                     ← registry array rebuilt
 *
 * Assumptions the script makes:
 *   • Any row with a non-empty `code` string is treated as ready to
 *     ship. Rows that are prompt-only are skipped (Phase 2).
 *   • Categories from Cue (e.g. "Sections & Layouts") are mapped
 *     onto Foundations' short slugs (layouts / motion / etc.) so the
 *     UI stays clean.
 *   • Every migrated row uses previewMode: "video" with hover_src.
 *     Complex GSAP/WebGL components don't hydrate cleanly in a docs
 *     iframe; video is faithful + fast. Individual entries can be
 *     switched to "live" later by hand.
 * ─────────────────────────────────────────────────────────────────
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SOURCE_JSON = 'C:/Users/Peeyush/Motion_sites/Exp/prompt.json'

// ── helpers ────────────────────────────────────────────────────────

/** kebab-case → PascalCase for auto-generated wrapper names. */
function pascalCase(slug) {
  return slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
    .replace(/^([0-9])/, '_$1')
}

/** slugify a title into kebab-case, filename-safe. */
function slugify(title) {
  return String(title)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Cue's long category names → Foundations' short slugs. */
const CATEGORY_MAP = {
  'Sections & Layouts': 'layouts',
  'Scroll Animations': 'motion',
  'Gallery & Images': 'cards',
  'Utilities & Scripts': 'overlays',
  'Visual Effects': 'motion',
  'Text Animations': 'typography',
  'Navigation': 'layouts',
  'Buttons': 'buttons',
  'Forms': 'inputs',
  '3D & WebGL': 'motion',
  'Video & Audio': 'motion',
  'Page Transitions': 'motion',
  'Sliders & Marquees': 'motion',
  'Loaders': 'motion',
  'Cursor Animations': 'motion',
  'Preloader, Loading screen': 'motion',
  'Gimmicks': 'motion',
  'Waitlist': 'layouts',
  'Hero': 'layouts',
  'Date Picker': 'inputs',
}

function mapCategory(raw) {
  return CATEGORY_MAP[raw?.trim()] || 'layouts'
}

/** Detect dependencies from a piece of source code. */
function detectDeps(code) {
  const deps = new Set()
  const patterns = {
    'framer-motion': /from ['"]framer-motion['"]/,
    motion: /from ['"]motion(?:\/react)?['"]/,
    gsap: /from ['"]gsap/,
    three: /from ['"]three/,
    '@react-three/fiber': /from ['"]@react-three\/fiber['"]/,
    '@react-three/drei': /from ['"]@react-three\/drei['"]/,
    clsx: /from ['"]clsx['"]/,
    'tailwind-merge': /from ['"]tailwind-merge['"]/,
    lenis: /from ['"]lenis/,
    'react-use-measure': /from ['"]react-use-measure['"]/,
  }
  for (const [name, re] of Object.entries(patterns)) {
    if (re.test(code)) deps.add(name)
  }
  return Array.from(deps)
}

/** Header comment we prepend to every migrated file. */
function makeHeader(row, slug) {
  return `/**
 * Cue Foundations · ${row.title}
 * ────────────────────────────────────────────
 * ${row.description || ''}
 *
 * The full AI prompt used to design this lives at:
 *   lib/prompts/${slug}.md
 *
 * Awwwards-tier premium version → https://cuedesign.space/component/${row.id}
 *
 * Original Cue ID: ${row.id}
 * Category: ${row.category}
 * ────────────────────────────────────────────
 */
`
}

/** Detect if a component is safe to mount live in the docs UI.
 *  Rules of thumb: it must be React (has a JSX export), and must not
 *  touch global styles / `body` — those break the docs layout. */
function detectLiveSafety(code) {
  if (!code) return { safe: false, exportName: null, isDefault: false }
  const isRawHtml = /^\s*(?:\/\*[\s\S]*?\*\/\s*)?(?:<!DOCTYPE|<html)/im.test(code)
  if (isRawHtml) return { safe: false, exportName: null, isDefault: false }

  // Global-style leaks — component would blow out the docs page.
  // The `body` regex requires a word boundary before it (start / space
  // / combinator) so class names like `.card-body` or `.email-body`
  // don't trigger a false positive.
  const touchesGlobals =
    /(?:^|[\s,>+~])body\s*\{[^}]*(?:overflow|background|height|padding|margin)/im.test(code) ||
    /(?:^|[\s,>+~])html\s*,\s*body/im.test(code) ||
    /document\.body\.style/i.test(code) ||
    /document\.documentElement\.style/i.test(code)
  if (touchesGlobals) return { safe: false, exportName: null, isDefault: false }

  // Fullscreen scroll journeys — components with 2+ occurrences of
  // 100vh / h-screen AND scroll trigger patterns can't be honestly
  // represented inside a 720px iframe (heights collapse, sticky
  // math breaks). Better to keep them video-only than to ship a
  // subtly-wrong live experience.
  const fullscreenHits = (code.match(/100vh|h-screen|min-h-screen/g) || []).length
  const scrollHits = (code.match(/ScrollTrigger|window\.scroll|scrollY|IntersectionObserver/g) || []).length
  if (fullscreenHits >= 2 && scrollHits >= 1) {
    return { safe: false, exportName: null, isDefault: false }
  }

  // Prefer `export default function X` first, then named export.
  let m = code.match(/export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)/)
  if (m) return { safe: true, exportName: m[1], isDefault: true }
  m = code.match(/export\s+function\s+([A-Z][A-Za-z0-9_]*)/)
  if (m) return { safe: true, exportName: m[1], isDefault: false }
  m = code.match(/export\s+default\s+([A-Z][A-Za-z0-9_]*)/)
  if (m) return { safe: true, exportName: m[1], isDefault: true }
  return { safe: false, exportName: null, isDefault: false }
}

/** Cue's export sometimes wraps code with leading whitespace; keep the
 *  raw content but prepend our header. Assume the code already has its
 *  own "use client" line if it needs one. */
function decorateCode(row, slug) {
  const raw = String(row.code || '').trim()
  if (!raw) return null

  // If the code opens with a directive line like "use client";, keep
  // that at the very top of the file (React requires it there) and
  // insert the header comment on the line right after.
  const directiveMatch = raw.match(/^\s*(['"])use (client|server)\1\s*;?\s*\n/)
  if (directiveMatch) {
    const rest = raw.slice(directiveMatch[0].length)
    return `${directiveMatch[0]}\n${makeHeader(row, slug)}\n${rest}\n`
  }
  return `${makeHeader(row, slug)}\n${raw}\n`
}

/** Turn Cue's prompt text into a docs markdown page. */
function decoratePrompt(row) {
  const promptText = String(row.prompt || '').trim()
  return `# ${row.title} — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to regenerate this component from scratch.

${row.use_case ? `> **Use case:** ${row.use_case}\n` : ''}
---

${promptText}

---

**Awwwards-tier version →** https://cuedesign.space/component/${row.id}
`
}

/** Pretty-print a registry entry as a TS object literal. */
function registryEntryLiteral(entry) {
  const lines = ['  {']
  lines.push(`    slug: ${JSON.stringify(entry.slug)},`)
  lines.push(`    name: ${JSON.stringify(entry.name)},`)
  lines.push(`    description: ${JSON.stringify(entry.description)},`)
  lines.push(`    category: ${JSON.stringify(entry.category)},`)
  lines.push(`    tags: ${JSON.stringify(entry.tags)},`)
  lines.push(`    dependencies: ${JSON.stringify(entry.dependencies)},`)
  lines.push(`    sourcePath: ${JSON.stringify(entry.sourcePath)},`)
  lines.push(`    promptPath: ${JSON.stringify(entry.promptPath)},`)
  lines.push(`    previewMode: ${JSON.stringify(entry.previewMode)},`)
  if (entry.videoSrc) lines.push(`    videoSrc: ${JSON.stringify(entry.videoSrc)},`)
  if (entry.posterSrc) lines.push(`    posterSrc: ${JSON.stringify(entry.posterSrc)},`)
  if (entry.premiumHref) lines.push(`    premiumHref: ${JSON.stringify(entry.premiumHref)},`)
  lines.push(`    addedAt: ${JSON.stringify(entry.addedAt)},`)
  lines.push(`    updatedAt: ${JSON.stringify(entry.updatedAt)},`)
  if (entry.isNew) lines.push(`    isNew: true,`)
  if (entry.contributor) {
    lines.push(`    contributor: { name: ${JSON.stringify(entry.contributor.name)}, href: ${JSON.stringify(entry.contributor.href)} },`)
  }
  if (entry.related && entry.related.length) {
    lines.push(`    related: ${JSON.stringify(entry.related)},`)
  }
  lines.push('  },')
  return lines.join('\n')
}

// ── main ───────────────────────────────────────────────────────────

async function main() {
  const raw = await fs.readFile(SOURCE_JSON, 'utf-8')
  const rows = JSON.parse(raw)
  console.log(`[migrate] read ${rows.length} rows from ${SOURCE_JSON}`)

  const withCode = rows.filter((r) => r.code && r.code.trim())
  console.log(`[migrate] ${withCode.length} rows have code — will migrate`)
  console.log(`[migrate] ${rows.length - withCode.length} rows are prompt-only — skipping (Phase 2)`)

  // Preserve addedAt for existing slugs — Cue paid's created_at is
  // the DB creation date (when the component was designed), but for
  // Cue Kit sorting we want "when it landed on Kit" (i.e. when it
  // was first toggled to tier=free). Read the current registry.ts
  // and lift every existing addedAt into a slug map. Slugs new to
  // Kit get today's date.
  const REGISTRY_PATH = path.join(ROOT, 'lib/registry.ts')
  const existingRegistry = await fs.readFile(REGISTRY_PATH, 'utf-8').catch(() => '')
  const existingAddedAt = new Map()
  const entryRe = /\{\s*slug:\s*"([^"]+)"[\s\S]*?addedAt:\s*"([^"]+)"/g
  let m
  while ((m = entryRe.exec(existingRegistry)) !== null) {
    existingAddedAt.set(m[1], m[2])
  }
  const today = new Date().toISOString().slice(0, 10)

  const registryEntries = []
  const usedSlugs = new Set()
  // Slugs that will get an auto-generated preview wrapper + entry in
  // preview-map.ts so their detail page shows the Video ⇄ Live toggle.
  const liveSlugs = []
  // Explicit exclude list — components that DID pass the safety
  // check but visually don't fit the docs pane (fullscreen layouts
  // designed to own the viewport, corner-rendering when clipped).
  // Video preview only for these.
  const LIVE_EXCLUDE = new Set([
    'cell-to-card-calendar-expansion',
  ])

  // ── Pass 1: write files ────────────────────────────────────────
  for (const row of withCode) {
    let slug = slugify(row.title)
    // Dedupe collisions.
    let n = 2
    while (usedSlugs.has(slug)) slug = `${slugify(row.title)}-${n++}`
    usedSlugs.add(slug)

    const sourceRel = `components/foundations/${slug}.tsx`
    const promptRel = `lib/prompts/${slug}.md`
    const sourceAbs = path.join(ROOT, sourceRel)
    const promptAbs = path.join(ROOT, promptRel)

    const decoratedCode = decorateCode(row, slug)
    const decoratedPrompt = decoratePrompt(row)

    await fs.mkdir(path.dirname(sourceAbs), { recursive: true })
    await fs.mkdir(path.dirname(promptAbs), { recursive: true })
    await fs.writeFile(sourceAbs, decoratedCode, 'utf-8')
    await fs.writeFile(promptAbs, decoratedPrompt, 'utf-8')

    // Live-preview auto-registration: if the component's source is
    // safe to mount (no raw HTML, no global-style leaks) and exposes
    // a JSX component, generate a small preview wrapper and add the
    // slug to liveSlugs. preview-map.ts is regenerated at the end.
    const liveInfo = detectLiveSafety(row.code)
    if (liveInfo.safe && !LIVE_EXCLUDE.has(slug)) {
      const wrapperRel = `components/previews/foundations/${slug}.tsx`
      const wrapperAbs = path.join(ROOT, wrapperRel)

      // Hand-crafted wrapper marker — if the existing file starts
      // with `/* @preview-handcrafted`, leave it alone. Prevents the
      // sync from overwriting per-component customisations (e.g.
      // modals that need stateful open/close control).
      let handCrafted = false
      try {
        const existing = await fs.readFile(wrapperAbs, 'utf-8')
        if (existing.includes('@preview-handcrafted')) handCrafted = true
      } catch {}

      const importLine = liveInfo.isDefault
        ? `import ${liveInfo.exportName} from "@/components/foundations/${slug}"`
        : `import { ${liveInfo.exportName} } from "@/components/foundations/${slug}"`
      const wrapper = `"use client"

${importLine}

/**
 * Auto-generated live preview wrapper. Renders the component at its
 * natural size but centers it in the pane so components that don't
 * self-center (which is most of them) don't render in the top-left
 * corner. Regenerated on every sync-kit run — do not edit by hand.
 */
export function ${pascalCase(slug)}Preview() {
  return <${liveInfo.exportName} />
}
`
      await fs.mkdir(path.dirname(wrapperAbs), { recursive: true })
      if (!handCrafted) await fs.writeFile(wrapperAbs, wrapper, 'utf-8')
      liveSlugs.push({ slug, exportName: `${pascalCase(slug)}Preview` })
    }

    registryEntries.push({
      slug,
      name: row.title,
      description: row.description || '',
      category: mapCategory(row.category),
      tags: Array.isArray(row.tags) ? row.tags : [],
      dependencies: detectDeps(row.code),
      sourcePath: sourceRel,
      promptPath: promptRel,
      previewMode: 'video',
      videoSrc: row.hover_src || undefined,
      posterSrc: row.thumb_src || undefined,
      premiumHref: `https://cuedesign.space/component/${row.id}`,
      // addedAt = when this slug first appeared in Kit (preserved
      // across syncs so old components don't jump to the top on each
      // regeneration). Slugs new to Kit get today's date.
      addedAt: existingAddedAt.get(slug) || today,
      updatedAt: today,
      isNew: true,
      contributor: { name: 'Alok', href: 'https://x.com/Alok619308' },
      related: [],
    })

    console.log(`[migrate] ✓ ${row.id.padEnd(8)} → ${slug}`)
  }

  // ── Pass 2: compute related links per category ─────────────────
  const byCategory = {}
  for (const e of registryEntries) {
    byCategory[e.category] ||= []
    byCategory[e.category].push(e.slug)
  }
  for (const e of registryEntries) {
    const pool = byCategory[e.category].filter((s) => s !== e.slug)
    e.related = pool.slice(0, 3)
  }

  // ── Pass 3: rebuild registry.ts ───────────────────────────────
  const existing = existingRegistry || (await fs.readFile(REGISTRY_PATH, 'utf-8'))
  // Everything before `export const registry` is the type section,
  // which we preserve. Everything after `export function` helpers
  // (or the end of the array) we preserve too.
  const before = existing.split('export const registry')[0]
  const after = existing.includes('export function ')
    ? '\nexport function ' + existing.split('export function ').slice(1).join('export function ')
    : '\n'

  const arrayBody = registryEntries.map(registryEntryLiteral).join('\n')
  const rebuilt =
    before +
    `export const registry: RegistryItem[] = [\n${arrayBody}\n]\n` +
    after
  await fs.writeFile(REGISTRY_PATH, rebuilt, 'utf-8')

  // ── Pass 4: regenerate preview-map.ts so every safe live-mount
  //          slug auto-registers. Hand-crafted entries (button-
  //          magnetic, tilt-card, theme-toggle, tabs-pill) stay
  //          pinned at the top so their wrappers aren't overwritten.
  const HAND_CRAFTED = [
    { slug: 'button-magnetic', name: 'MagneticButtonPreview' },
    { slug: 'tilt-card', name: 'TiltCardPreview' },
    { slug: 'theme-toggle', name: 'ThemeTogglePreview' },
    { slug: 'tabs-pill', name: 'TabsPillPreview' },
  ]
  // Merge — hand-crafted first, then auto-generated (dedupe by slug).
  const seen = new Set(HAND_CRAFTED.map((e) => e.slug))
  const merged = [...HAND_CRAFTED]
  for (const l of liveSlugs) {
    if (seen.has(l.slug)) continue
    merged.push({ slug: l.slug, name: l.exportName })
    seen.add(l.slug)
  }

  const importLines = merged
    .map((e) =>
      HAND_CRAFTED.some((h) => h.slug === e.slug)
        ? `import { ${e.name} } from "@/components/previews/foundations/${e.slug}"`
        : `import { ${e.name} } from "@/components/previews/foundations/${e.slug}"`,
    )
    .join('\n')
  const safeSet = merged.map((e) => `  "${e.slug}",`).join('\n')
  const mapEntries = merged.map((e) => `  "${e.slug}": ${e.name},`).join('\n')

  const previewMap = `/**
 * Cue Foundations · shared preview map.
 * ─────────────────────────────────────────────────────
 * AUTO-GENERATED by scripts/migrate-from-cue.mjs. Hand-crafted
 * entries at the top are pinned; auto-generated ones follow.
 * Regenerated on every \`npm run sync-kit\` — do not edit by hand.
 * ─────────────────────────────────────────────────────
 */

${importLines}

export const SAFE_LIVE_SLUGS = new Set([
${safeSet}
])

export const PREVIEW_MAP: Record<string, () => React.JSX.Element> = {
${mapEntries}
}
`
  await fs.writeFile(path.join(ROOT, 'lib/preview-map.ts'), previewMap, 'utf-8')

  console.log(`\n[migrate] wrote ${registryEntries.length} components + registry.ts`)
  console.log(`[migrate] wrote ${liveSlugs.length} auto live-preview wrappers + preview-map.ts`)
  console.log(`[migrate] done.`)
}

main().catch((err) => {
  console.error('[migrate] failed:', err)
  process.exit(1)
})
