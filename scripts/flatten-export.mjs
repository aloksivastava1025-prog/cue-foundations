// After `next build` (output: "export"): Next 16 writes nested segment-prefetch files as folders,
//   out/components/<slug>/__next.components/$d$slug/__PAGE__.txt
// but the client router asks for one flat name:
//   out/components/<slug>/__next.components.$d$slug.__PAGE__.txt
// Without the flat copy every prefetch 404s and clicks fall back to full page loads.
// This copies each nested file to its flat name next to the folder it starts in.
import fs from "node:fs"
import path from "node:path"

const OUT = path.resolve("out")
let made = 0

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (!e.isDirectory()) continue
    if (e.name.startsWith("__next.")) flatten(dir, p, e.name)
    else walk(p)
  }
}

function flatten(base, top, prefix) {
  const stack = [[top, prefix]]
  while (stack.length) {
    const [dir, name] = stack.pop()
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name), flat = `${name}.${e.name}`
      if (e.isDirectory()) stack.push([p, flat])
      else if (e.name.endsWith(".txt")) {
        const dest = path.join(base, flat)
        if (!fs.existsSync(dest)) { fs.copyFileSync(p, dest); made++ }
      }
    }
  }
}

if (!fs.existsSync(OUT)) { console.error("flatten-export: no out/ folder, run next build first"); process.exit(1) }
walk(OUT)
console.log(`flatten-export: ${made} prefetch files copied to their flat names`)
