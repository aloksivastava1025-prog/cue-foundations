/**
 * Fetch latest free-tier components from Cue's Supabase via REST API
 * (plain fetch — no supabase-js dep needed, avoids Node 20 WebSocket
 * quirks). Writes prompt.json in the same shape migrate-from-cue.mjs
 * already consumes. Called first by sync-kit.mjs.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Tiny .env.local loader — no dotenv dep needed.
async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf-8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
    }
  } catch {}
}

await loadEnv()

const URL = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_ANON_KEY
if (!URL || !KEY) {
  console.error('[fetch] Missing SUPABASE_URL / SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'count=exact',
}

async function sbSelect(table, query) {
  const res = await fetch(`${URL}/rest/v1/${table}?${query}`, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${table} query failed (${res.status}): ${body.slice(0, 200)}`)
  }
  return res.json()
}

console.log('[fetch] querying tier=free rows…')

// `prompts` table holds title + code but NOT the prompt text — the
// actual prompt content lives in `prompt_contents.content` keyed
// by prompt_id. Both queries are batched, then merged in-memory.
const prompts = await sbSelect(
  'prompts',
  'tier=eq.free&select=id,title,description,category,tags,hover_src,thumb_src,tier,created_at,use_case,code&order=created_at.desc',
)
console.log(`[fetch] ${prompts.length} free-tier rows`)

if (prompts.length === 0) {
  console.error('[fetch] no free-tier rows — nothing to sync')
  process.exit(1)
}

const ids = prompts.map((p) => p.id)
const idFilter = `prompt_id=in.(${ids.map((i) => `"${i}"`).join(',')})`
const contents = await sbSelect(
  'prompt_contents',
  `${idFilter}&select=prompt_id,content`,
)
const contentByPromptId = new Map(contents.map((c) => [c.prompt_id, c.content]))

const merged = prompts.map((p) => ({
  ...p,
  prompt: contentByPromptId.get(p.id) || null,
}))

const OUT = 'C:/Users/Peeyush/Motion_sites/Exp/prompt.json'
await fs.mkdir(path.dirname(OUT), { recursive: true })
await fs.writeFile(OUT, JSON.stringify(merged, null, 2), 'utf-8')

const withCode = merged.filter((r) => r.code && r.code.trim()).length
const promptOnly = merged.length - withCode
console.log(`[fetch] wrote ${merged.length} rows → ${OUT}`)
console.log(`[fetch]   with code: ${withCode}`)
console.log(`[fetch]   prompt-only: ${promptOnly}`)
