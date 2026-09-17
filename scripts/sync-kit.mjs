/**
 * Cue Kit — one-command sync.
 * ─────────────────────────────────────────────────────
 * Reads latest Cue prompt export from prompt.json, regenerates
 * component files + registry, commits, and pushes to GitHub.
 * Vercel auto-deploys → live on kit.cuedesign.space in ~3 min.
 *
 * Weekly workflow (5 min total):
 *   1. In Cue paid admin, add / mark new components as tier=free
 *   2. Export the free-tier rows to C:/Users/Peeyush/Motion_sites/Exp/prompt.json
 *   3. Run: npm run sync-kit
 *   4. Done — live in 3 min
 *
 * The script:
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

// 1. Regenerate registry + component files from JSON export.
try {
  run('node scripts/migrate-from-cue.mjs')
} catch {
  console.error('\n✗ Migrate (with-code) failed — abort. Check the JSON export exists at C:/Users/Peeyush/Motion_sites/Exp/prompt.json')
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
