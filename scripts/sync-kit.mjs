/**
 * Cue Kit — one-command sync.
 * ─────────────────────────────────────────────────────
 * Reads latest Cue prompt export from prompt.json, regenerates
 * component files + registry, commits, and pushes to GitHub.
 * Vercel auto-deploys → live on kit.cuedesign.space in ~3 min.
 *
 * Weekly workflow (2 steps total):
 *   1. In Cue paid admin, toggle a component to tier=free + save
 *   2. Run: npm run sync-kit
 *   3. Done — live on kit.cuedesign.space in 3 min
 *
 * The script:
 *   • fetches latest tier=free rows from Supabase → prompt.json
 *   • runs migrate-from-cue.mjs      (with-code components)
 *   • runs migrate-prompt-only.mjs   (prompt-only components)
 *   • checks git status; commits only if there are real changes
 *   • pushes to origin/main; Vercel picks it up
 * ─────────────────────────────────────────────────────
 */

import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`)
  return execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts })
}

function capture(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf-8' }).trim()
}

console.log('╭──────────────────────────────────────────╮')
console.log('│  Cue Kit — one-command sync              │')
console.log('╰──────────────────────────────────────────╯')

// 1. Fetch latest tier=free rows from Supabase → prompt.json.
try {
  run('node scripts/fetch-from-supabase.mjs')
} catch {
  console.error('\n✗ Supabase fetch failed — check .env.local has SUPABASE_URL + SUPABASE_ANON_KEY. Abort.')
  process.exit(1)
}

// 2. Regenerate registry + component files from JSON.
try {
  run('node scripts/migrate-from-cue.mjs')
} catch {
  console.error('\n✗ Migrate (with-code) failed — abort.')
  process.exit(1)
}

try {
  run('node scripts/migrate-prompt-only.mjs')
} catch {
  console.error('\n✗ Migrate (prompt-only) failed — abort.')
  process.exit(1)
}

// 2. Check if anything actually changed.
const status = capture('git status --porcelain')
if (!status) {
  console.log('\n✓ No changes detected — nothing to sync. Cue Kit is already up to date.')
  process.exit(0)
}

console.log('\n─── Changed files ───')
console.log(status)
console.log('─────────────────────\n')

// 3. Verify the build passes before committing (fail fast).
try {
  console.log('Building to verify nothing is broken…')
  run('npm run build')
} catch {
  console.error('\n✗ Build failed — new components introduced a compile error. Not committing. Fix locally and retry.')
  process.exit(1)
}

// 4. Commit + push. Message summarises what changed.
const changedFiles = status.split('\n').length
const timestamp = new Date().toISOString().slice(0, 10)

run('git add -A')
run(`git commit -m "sync-kit: weekly component drop (${timestamp}) — ${changedFiles} file changes"`)
run('git push origin main')

console.log('\n╭──────────────────────────────────────────╮')
console.log('│  ✓ Sync complete                          │')
console.log('│  Vercel deploying — live in ~3 min at     │')
console.log('│  https://kit.cuedesign.space              │')
console.log('╰──────────────────────────────────────────╯')
