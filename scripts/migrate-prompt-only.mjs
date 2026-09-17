/**
 * Cue Foundations — import the 20 prompt-only components.
 * ─────────────────────────────────────────────────────
 * These rows in Cue's export have a prompt + a hover video on R2, but
 * no polished React source yet. We surface them anyway so the library
 * feels complete: the docs page shows the AI prompt + a video demo
 * + a CTA to regenerate the code in v0 / Bolt / Cursor / Claude.
 * When we later write the .tsx by hand, flip codeAvailable to true
 * and drop the file into components/foundations/.
 * ─────────────────────────────────────────────────────
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SOURCE_JSON = 'C:/Users/Peeyush/Motion_sites/Exp/prompt.json'

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

function decoratePrompt(row) {
  const promptText = String(row.prompt || '').trim()
  return `# ${row.title} — AI Prompt

Copy this prompt into **v0**, **Bolt**, **Cursor**, **Framer AI**, or **Claude** to generate this component from scratch.

${row.use_case ? `> **Use case:** ${row.use_case}\n` : ''}
---

${promptText}

---

**Awwwards-tier version →** https://cuedesign.space/component/${row.id}
`
}

function registryEntryLiteral(entry) {
  const lines = ['  {']
  lines.push(`    slug: ${JSON.stringify(entry.slug)},`)
  lines.push(`    name: ${JSON.stringify(entry.name)},`)
  lines.push(`    description: ${JSON.stringify(entry.description)},`)
  lines.push(`    category: ${JSON.stringify(entry.category)},`)
  lines.push(`    tags: ${JSON.stringify(entry.tags)},`)
  lines.push(`    dependencies: [],`)
  lines.push(`    sourcePath: "",`)
  lines.push(`    promptPath: ${JSON.stringify(entry.promptPath)},`)
  lines.push(`    codeAvailable: false,`)
  lines.push(`    previewMode: "video",`)
  if (entry.videoSrc) lines.push(`    videoSrc: ${JSON.stringify(entry.videoSrc)},`)
  if (entry.posterSrc) lines.push(`    posterSrc: ${JSON.stringify(entry.posterSrc)},`)
  lines.push(`    premiumHref: ${JSON.stringify(entry.premiumHref)},`)
  lines.push(`    addedAt: ${JSON.stringify(entry.addedAt)},`)
  lines.push(`    updatedAt: ${JSON.stringify(entry.updatedAt)},`)
  lines.push(`    isNew: true,`)
  lines.push(`    contributor: { name: "Alok", href: "https://x.com/Alok619308" },`)
  lines.push('  },')
  return lines.join('\n')
}

async function main() {
  const raw = await fs.readFile(SOURCE_JSON, 'utf-8')
  const rows = JSON.parse(raw)
  const promptOnly = rows.filter((r) => (!r.code || !r.code.trim()) && r.prompt && r.prompt.trim())
  console.log(`[promptonly] ${promptOnly.length} prompt-only rows to import`)

  // Load current registry so we can skip slugs that already exist,
  // and preserve their addedAt (when Kit first saw the slug).
  const REGISTRY = path.join(ROOT, 'lib/registry.ts')
  let reg = await fs.readFile(REGISTRY, 'utf-8')
  const existingSlugs = new Set(
    [...reg.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]),
  )
  const existingAddedAt = new Map()
  const entryRe = /\{\s*slug:\s*"([^"]+)"[\s\S]*?addedAt:\s*"([^"]+)"/g
  let mm
  while ((mm = entryRe.exec(reg)) !== null) existingAddedAt.set(mm[1], mm[2])
  const today = new Date().toISOString().slice(0, 10)

  const newEntries = []
  const usedSlugs = new Set(existingSlugs)

  for (const row of promptOnly) {
    let slug = slugify(row.title)
    let n = 2
    while (usedSlugs.has(slug)) slug = `${slugify(row.title)}-${n++}`
    usedSlugs.add(slug)

    // Write the prompt file.
    const promptRel = `lib/prompts/${slug}.md`
    await fs.writeFile(path.join(ROOT, promptRel), decoratePrompt(row), 'utf-8')

    newEntries.push({
      slug,
      name: row.title,
      description: row.description || '',
      category: CATEGORY_MAP[row.category?.trim()] || 'layouts',
      tags: Array.isArray(row.tags) ? row.tags : [],
      promptPath: promptRel,
      videoSrc: row.hover_src || undefined,
      posterSrc: row.thumb_src || undefined,
      premiumHref: `https://cuedesign.space/component/${row.id}`,
      addedAt: existingAddedAt.get(slug) || today,
      updatedAt: today,
    })
    console.log(`[promptonly] ✓ ${row.id} → ${slug}`)
  }

  // Append entries to the registry array — insert right before the
  // closing "]" of the exported `registry` array.
  const insertion = newEntries.map(registryEntryLiteral).join('\n')
  reg = reg.replace(
    /(export const registry: RegistryItem\[\] = \[[\s\S]*?)(\n\])/,
    `$1\n${insertion}$2`,
  )
  await fs.writeFile(REGISTRY, reg, 'utf-8')
  console.log(`\n[promptonly] appended ${newEntries.length} entries`)
}

main().catch((err) => {
  console.error('[promptonly] failed:', err)
  process.exit(1)
})
