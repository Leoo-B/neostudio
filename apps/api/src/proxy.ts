import type { Context } from "hono"
import { TOOLS } from "@neostudio/shared"

const TOOL_TIMEOUT_MS = 25_000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 60 // max request per menit per IP
const CACHE_TTL_MS = 60_000 // 1 menit cache untuk endpoint tanpa parameter dinamis

// in-memory ip bucket
const buckets = new Map<string, { count: number; resetAt: number }>()
const cache = new Map<string, { at: number; body: ArrayBuffer; contentType: string; status: number }>()

// injectable untuk testing
let _fetch: typeof fetch = fetch
let _now: () => number = () => Date.now()
export function _setFetchForTest(f: typeof fetch) {
  _fetch = f
}
export function _setNowForTest(n: () => number) {
  _now = n
}
export function _resetForTest() {
  buckets.clear()
  cache.clear()
  _fetch = fetch
  _now = () => Date.now()
}

export function getClientIp(c: Context): string {
  const xf = c.req.header("x-forwarded-for")
  if (xf) return xf.split(",")[0].trim()
  return c.req.header("x-real-ip") ?? "anon"
}

export function checkRate(ip: string, now: number = _now()): boolean {
  const b = buckets.get(ip)
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (b.count >= RATE_LIMIT_MAX) return false
  b.count++
  return true
}

export function buildQuery(params: Record<string, unknown>): string {
  const usp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue
    usp.set(k, String(v))
  }
  const s = usp.toString()
  return s ? `?${s}` : ""
}

export function warmCache() {
  // pre-cache endpoint tanpa parameter (berita, info, games primbon select, dsb)
  for (const t of TOOLS) {
    if (t.fields.length === 0 && t.method !== "POST") {
      const cacheKey = `GET:${t.id}:`
      if (!cache.has(cacheKey)) {
        // fire-and-forget warm
        void callUpstream(t, "GET", {}).then((r) => {
          if (r) cache.set(cacheKey, { ...r, at: Date.now() })
        })
      }
    }
  }
}

async function callUpstream(t: (typeof TOOLS)[number], method: "GET" | "POST", params: Record<string, unknown>) {
  const qs = method === "GET" ? buildQuery(params) : ""
  const url = t.baseUrl + t.path + qs
  const init: RequestInit = { method }
  if (method === "POST") {
    init.headers = { "Content-Type": "application/json" }
    init.body = JSON.stringify(params)
  }
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TOOL_TIMEOUT_MS)
  try {
    const res = await _fetch(url, { ...init, signal: ctrl.signal, headers: { "User-Agent": "neostudio-proxy/1.0", ...(init.headers ?? {}) } })
    const arrayBuf = await res.arrayBuffer()
    return {
      body: arrayBuf,
      contentType: res.headers.get("content-type") ?? "application/octet-stream",
      status: res.status,
    }
  } finally {
    clearTimeout(timer)
  }
}

function normalize(t: (typeof TOOLS)[number], ct: string, body: ArrayBuffer, status: number) {
  const isImage = ct.startsWith("image/")
  const isJson = ct.includes("json")
  const kind = isImage ? "image" : isJson ? "json" : "text"
  if (kind === "image") {
    const b64 = Buffer.from(body).toString("base64")
    return {
      ok: status >= 200 && status < 300,
      status,
      kind: "image" as const,
      imageUrl: `data:${ct};base64,${b64}`,
    }
  }
  if (kind === "json") {
    let data: unknown
    try {
      data = JSON.parse(Buffer.from(body).toString("utf8"))
    } catch {
      data = Buffer.from(body).toString("utf8")
    }
    return { ok: status >= 200 && status < 300, status, kind: "json" as const, data }
  }
  return {
    ok: status >= 200 && status < 300,
    status,
    kind: "text" as const,
    data: Buffer.from(body).toString("utf8"),
  }
}

export async function proxyTool(c: Context, method: "GET" | "POST", params: Record<string, unknown>) {
  const id = c.req.param("id")
  const t = TOOLS.find((x) => x.id === id)
  if (!t) return c.json({ ok: false, status: 404, error: "tool not found" }, 404)

  const ip = getClientIp(c)
  if (!checkRate(ip)) {
    return c.json({ ok: false, status: 429, error: "rate limit — coba lagi nanti" }, 429)
  }

  // cache only GET no-param
  const cacheKey = `${method}:${t.id}:${JSON.stringify(params)}`
  if (method === "GET" && Object.keys(params).length === 0) {
    const hit = cache.get(cacheKey)
    if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
      const norm = normalize(t, hit.contentType, hit.body, hit.status)
      return c.json({ ...norm, cached: true })
    }
  }

  try {
    const r = await callUpstream(t, method, params)
    if (r.status >= 200 && r.status < 300 && method === "GET" && Object.keys(params).length === 0) {
      cache.set(cacheKey, { ...r, at: Date.now() })
    }
    return c.json(normalize(t, r.contentType, r.body, r.status))
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const isAbort = msg.toLowerCase().includes("aborted")
    return c.json(
      {
        ok: false,
        status: isAbort ? 504 : 502,
        error: isAbort ? `upstream timeout (${TOOL_TIMEOUT_MS / 1000}s)` : `upstream unreachable: ${msg}`,
      },
      isAbort ? 504 : 502
    )
  }
}
