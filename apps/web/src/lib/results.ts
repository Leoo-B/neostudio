/** ambil nested value pakai dotted path, mis. "data.item" */
export function pickPath(obj: unknown, path?: string): unknown {
  if (!path) return obj
  let cur: unknown = obj
  for (const k of path.split(".")) {
    if (cur && typeof cur === "object" && k in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[k]
    } else {
      return undefined
    }
  }
  return cur
}

/** ambil string field dari object; mendukung dotted path (mis. "author.nickname") */
export function pickStr(obj: unknown, key?: string): string | undefined {
  if (!key) return undefined
  const v = pickPath(obj, key)
  if (typeof v === "string") return v
  if (typeof v === "number") return String(v)
  if (typeof v === "boolean") return v ? "ya" : "tidak"
  return undefined
}

export function pickArr<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

export function toUrl(maybeUrl: string | undefined): string | undefined {
  if (!maybeUrl) return undefined
  if (typeof maybeUrl !== "string") return undefined
  if (maybeUrl.startsWith("data:") || maybeUrl.startsWith("http")) return maybeUrl
  return undefined
}

/** label ramah untuk key dotted / snake_case */
export function humanLabel(key: string): string {
  const last = key.includes(".") ? key.split(".").slice(-1)[0] : key
  return last
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase())
}

/** format nilai supaya lebih manusiawi (durasi, ukuran, angka besar) */
export function formatValue(key: string, v: string): string {
  const k = key.toLowerCase()
  const n = Number(v)
  if (!Number.isNaN(n) && Number.isFinite(n)) {
    if (k.includes("duration") && n > 0 && n < 100_000) {
      const m = Math.floor(n / 60)
      const s = n % 60
      return `${m}:${String(s).padStart(2, "0")}`
    }
    if (k.includes("size") && n > 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
    if (k.includes("time") && n >= 1000) return `${Math.round(n / 1000)}s`
    if (n >= 10_000) return n.toLocaleString("id-ID")
  }
  return v
}
