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

/** ambil string field dari object */
export function pickStr(obj: unknown, key?: string): string | undefined {
  if (!key) return undefined
  if (obj && typeof obj === "object" && key in (obj as Record<string, unknown>)) {
    const v = (obj as Record<string, unknown>)[key]
    if (typeof v === "string") return v
    if (typeof v === "number") return String(v)
  }
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
