import { NextRequest } from "next/server"
import { getRegistryItem } from "@/lib/registry"
import path from "node:path"
import fs from "node:fs/promises"

/**
 * shadcn CLI registry endpoint.
 *
 * When a developer runs:
 *   npx shadcn@latest add https://foundations.cuedesign.space/r/button-magnetic.json
 *
 * shadcn hits this route, reads the JSON, and drops the returned
 * `content` into their local `components/ui/` folder.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params
  const cleanSlug = slug.replace(/\.json$/, "")
  const item = getRegistryItem(cleanSlug)
  if (!item) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Prompt-only entries ship no React source — surface a helpful 404
  // instead of a 500 so the shadcn CLI prints a clean error.
  if (item.codeAvailable === false || !item.sourcePath) {
    return new Response(
      JSON.stringify({
        error: "Prompt-only component",
        message:
          "This component is shipped as an AI prompt only. Read the prompt at " +
          `https://foundations.cuedesign.space/components/${item.slug} and paste it into v0, Cursor, Bolt, or Framer AI.`,
        promptUrl: `https://foundations.cuedesign.space/components/${item.slug}`,
      }, null, 2),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  // turbopackIgnore silences the "dynamic filesystem access" warning
  // — the tracing config in next.config.ts already scopes bundled
  // files to components/foundations + lib/prompts, so tracing isn't
  // uncontrolled despite the dynamic path.
  const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), item.sourcePath)
  let source: string
  try {
    source = await fs.readFile(abs, "utf-8")
  } catch {
    return new Response(JSON.stringify({ error: "Source missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const filename = path.basename(item.sourcePath)

  const body = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.slug,
    type: "registry:ui",
    dependencies: item.dependencies,
    files: [
      {
        path: `components/ui/${filename}`,
        content: source,
        type: "registry:ui",
        target: "",
      },
    ],
    meta: {
      description: item.description,
      category: item.category,
      premiumHref: item.premiumHref ?? null,
      addedAt: item.addedAt,
    },
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  })
}
