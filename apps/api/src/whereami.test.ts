import { describe, it, expect } from "vitest"
import app from "./index"

describe("/api/whereami", () => {
  it("mengembalikan ip dari cf-connecting-ip header", async () => {
    const res = await app.request("/api/whereami", {
      headers: { "cf-connecting-ip": "1.2.3.4" },
    })
    expect(res.status).toBe(200)
    const body = (await res.json()) as { ok: boolean; ip: string | null }
    expect(body.ip).toBe("1.2.3.4")
    expect(body.ok).toBe(true)
  })

  it("ok:false + hint tanpa ip sama sekali", async () => {
    const res = await app.request("/api/whereami")
    const body = (await res.json()) as { ok: boolean; hint?: string; ip: string | null }
    expect(body.ok).toBe(false)
    expect(body.hint).toBeTruthy()
    expect(body.ip).toBe(null)
  })
})
