// One-off: split tools.ts into public catalog + server-only upstream map.
import { readFileSync, writeFileSync } from "node:fs"

const file = "packages/shared/src/tools.ts"
const src = readFileSync(file, "utf8")

const sip = src.match(/const SIPUTZX\s*=\s*"([^"]+)"/)?.[1]
const kyz = src.match(/const KYZZ\s*=\s*"([^"]+)"/)?.[1]
if (!sip || !kyz) throw new Error("const baseUrl tidak ditemukan")

const start = src.indexOf("export const TOOLS")
const arrStart = src.indexOf("[", start)
const arrEnd = src.lastIndexOf("]")
const body = src.slice(arrStart + 1, arrEnd)

const blocks = []
let depth = 0, cur = "", started = false
for (const ch of body) {
  if (ch === "{") {
    depth++
    if (depth === 1) { started = true; cur = "{" } else cur += ch
  } else if (ch === "}") {
    depth--
    if (depth === 0 && started) { cur += "}"; blocks.push(cur); cur = ""; started = false }
    else cur += ch
  } else if (started) cur += ch
}

const stripRe = /^\s*(?:baseUrl|path|source|method):[^\n]*\n/gm
const publicTools = []
const upstreamLines = []

for (const b of blocks) {
  const id = b.match(/id:\s*"([^"]+)"/)?.[1]
  const source = b.match(/source:\s*"([^"]+)"/)?.[1]
  const baseRaw = b.match(/baseUrl:\s*([^\s,]+)/)?.[1]
  const path = b.match(/(?<![A-Za-z])path:\s*"([^"]+)"/)?.[1]
  const method = b.match(/method:\s*"([^"]+)"/)?.[1]
  if (!id || !source || !baseRaw || !path) throw new Error(`gagal parse tool: ${id ?? "?"}`)

  const baseExpr =
    baseRaw === "SIPUTZX" ? "SIPUTZX" : baseRaw === "KYZZ" ? "KYZZ" : JSON.stringify(baseRaw.replace(/^"|"$/g, ""))
  const key = /^[a-zA-Z_$][\w$]*$/.test(id) ? id : JSON.stringify(id)
  upstreamLines.push(
    `  ${key}: { source: ${JSON.stringify(source)}, baseUrl: ${baseExpr}, path: ${JSON.stringify(path)}${method ? `, method: ${JSON.stringify(method)}` : ""} },`
  )

  const cleaned = b
    .replace(stripRe, "")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd()
  publicTools.push(cleaned.replace(/^\{\n/, "  {\n"))
}

const newTools = `import type { ToolDef } from "./types"

/** helper ambil data utama dari respons API */
const P = (path: string) => ({ resultPath: path })

/**
 * Katalog publik — metadata + skema form saja.
 * Info upstream (domain & endpoint) ada di \`upstream.ts\` (server-only).
 */
export const TOOLS: ToolDef[] = [
${publicTools.map((t) => t + ",").join("\n\n")}
]
`
writeFileSync(file, newTools)

const upContent = `// SERVER-ONLY — jangan pernah diimpor dari kode web (bocor ke bundle klien).
// Peta tool -> upstream. Bisa dioverride via env agar domain tidak hardcoded.
import type { ToolUpstream } from "./types"

const SIPUTZX = process.env.SIPUTZX_BASE ?? ${JSON.stringify(sip)}
const KYZZ = process.env.KYZZNEKOO_BASE ?? ${JSON.stringify(kyz)}

export const UPSTREAM: Record<string, ToolUpstream> = {
${upstreamLines.join("\n")}
}
`
writeFileSync("packages/shared/src/upstream.ts", upContent)

console.log(`OK: ${publicTools.length} tools publik, ${upstreamLines.length} entri upstream`)
