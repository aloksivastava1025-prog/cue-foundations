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

  console.log(`\n[migrate] wrote ${registryEntries.length} components + registry.ts`)
  console.log(`[migrate] done.`)
}

main().catch((err) => {
  console.error('[migrate] failed:', err)
  process.exit(1)
})
