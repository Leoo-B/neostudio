import { describe, it, expect, beforeEach } from "vitest"
import { buildQuery, checkRate, getClientIp, _resetForTest, _setFetchForTest, _setNowForTest, proxyTool } from "./proxy"

describe("buildQuery", () => {
  it("menghasilkan query kosong untuk param boolean/undefined/empty", () => {
    expect(buildQuery({})).toBe("")
    expect(buildQuery({ a: "", b: undefined })).toBe("")
  })
  it("meng-encode karakter khusus (URLSearchParams)", () => {
    const qs = buildQuery({ text: "halo dunia", url: "https://example.com/a?x=1" })
    expect(qs).toBe("?text=halo+dunia&url=https%3A%2F%2Fexample.com%2Fa%3Fx%3D1")
  })
})

describe("checkRate", () => {
  beforeEach(() => _resetForTest())

  it("menerima 60 request dalam satu jendela", () => {
    const ip = "1.2.3.4"
    for (let i = 0; i < 60; i++) expect(checkRate(ip)).toBe(true)
    expect(checkRate(ip)).toBe(false)
  })
  it("reset setelah jendela lewat", () => {
    let now = 0
    _setNowForTest(() => now)
    expect(checkRate("1.1.1.1", now)).toBe(true)
    now = 61_000
    expect(checkRate("1.1.1.1", now)).toBe(true)
    _resetForTest()
  })
})

describe("getClientIp", () => {
  it("mengambil x-forwarded-for pertama", () => {
    const c = { req: { header: (k: string) => (k === "x-forwarded-for" ? "1.1.1.1, 2.2.2.2" : null) } } as any
    expect(getClientIp(c)).toBe("1.1.1.1")
  })
  it("fallback ke x-real-ip", () => {
    const c = { req: { header: (k: string) => (k === "x-real-ip" ? "9.9.9.9" : null) } } as any
    expect(getClientIp(c)).toBe("9.9.9.9")
  })
  it("fallback ke anon", () => {
    const c = { req: { header: () => null } } as any
    expect(getClientIp(c)).toBe("anon")
  })
})

describe("proxyTool — normalisasi", () => {
  beforeEach(() => _resetForTest())

  function fakeCtx(id: string, params: Record<string, unknown>, ip = "127.0.0.1") {
    return {
      req: {
        param: (k: string) => (k === "id" ? id : ""),
        header: (k: string) => (k === "x-forwarded-for" ? ip : null),
      },
      json: (data: unknown, status?: number) => ({ body: data, status: status ?? 200 }),
    } as any
  }

  it("404 jika tool tidak ditemukan", async () => {
    const c = fakeCtx("tidak-ada", {})
    const r = (await proxyTool(c, "GET", {})) as any
    expect(r.status).toBe(404)
    expect((r.body as any).ok).toBe(false)
  })

  it("image → mengembalikan data:image base64", async () => {
    const png = Buffer.from([0x89, 0x50, 0x4e]) // PNG header
    _setFetchForTest(
      async () =>
        new Response(png, {
          status: 200,
          headers: { "content-type": "image/png" },
        }) as never
    )
    const c = fakeCtx("brat", { text: "hello" })
    const r = (await proxyTool(c, "GET", { text: "hello" })) as any
    expect(r.body.kind).toBe("image")
    expect((r.body.imageUrl as string).startsWith("data:image/png;base64,")).toBe(true)
  })

  it("json → mengembalikan objek ter-parse", async () => {
    const payload = { status: true, data: [{ title: "hello" }] }
    _setFetchForTest(
      async () =>
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { "content-type": "application/json" },
        }) as never
    )
    const c = fakeCtx("berita-cnn", {})
    const r = (await proxyTool(c, "GET", {})) as any
    expect(r.body.kind).toBe("json")
    expect((r.body.data as any).data[0].title).toBe("hello")
  })

  it("upstream 400 → ok=false tapi tetap JSON kind", async () => {
    _setFetchForTest(
      async () =>
        new Response(JSON.stringify({ creator: "Xyraa", error: "bad" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        }) as never
    )
    const c = fakeCtx("berita-cnn", { x: "y" })
    const r = (await proxyTool(c, "GET", { x: "y" })) as any
    expect(r.body.ok).toBe(false)
    expect(r.body.status).toBe(400)
    expect(r.body.kind).toBe("json")
  })

  it("cache dipakai untuk no-param tool bila hit < TTL", async () => {
    let calls = 0
    _setFetchForTest(async () => {
      calls++
      return new Response(JSON.stringify({ status: true, data: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }) as never
    })
    const c1 = fakeCtx("berita-cnn", {})
    await proxyTool(c1, "GET", {})
    expect(calls).toBe(1)
    const c2 = fakeCtx("berita-cnn", {})
    const r2 = (await proxyTool(c2, "GET", {})) as any
    expect(r2.body.cached).toBe(true)
    expect(calls).toBe(1) // tidak memanggil upstream lagi
  })

  it("rate limit 429 bila melewati 60/menit", async () => {
    _setFetchForTest(async () =>
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }) as never
    )
    const ip = "1.2.3.4"
    // habiskan kuota lewat checkRate langsung (lebih cepat & tanpa fetch)
    for (let i = 0; i < 60; i++) checkRate(ip)
    const c2 = fakeCtx("berita-cnn", { x: 61 }, ip)
    const r2 = (await proxyTool(c2, "GET", { x: 61 } as any)) as any
    expect(r2.status).toBe(429)
    expect(r2.body.ok).toBe(false)
  })

  it("timeout upstream → 504 dengan pesan ramah", async () => {
    _setFetchForTest(async () => {
      const err = new Error("The operation was aborted")
      throw err
    })
    const c = fakeCtx("brat", { text: "x" }, "5.5.5.5")
    const r = (await proxyTool(c, "GET", { text: "x" })) as any
    expect(r.status).toBe(504)
    expect(r.body.error).toContain("timeout")
  })

  it("upstream tidak terjangkau → 502", async () => {
    _setFetchForTest(async () => {
      throw new Error("ECONNREFUSED")
    })
    const c = fakeCtx("brat", { text: "x" }, "6.6.6.6")
    const r = (await proxyTool(c, "GET", { text: "x" })) as any
    expect(r.status).toBe(502)
    expect(r.body.error).toContain("unreachable")
  })

  it("body non-JSON non-image → kind text", async () => {
    _setFetchForTest(
      async () =>
        new Response("plain teks biasa", {
          status: 200,
          headers: { "content-type": "text/plain" },
        }) as never
    )
    const c = fakeCtx("brat", { text: "x" }, "7.7.7.7")
    const r = (await proxyTool(c, "GET", { text: "x" })) as any
    expect(r.body.kind).toBe("text")
    expect(r.body.data).toBe("plain teks biasa")
  })

  it("JSON rusak → fallback ke string tanpa crash", async () => {
    _setFetchForTest(
      async () =>
        new Response("{ bukan json valid", {
          status: 200,
          headers: { "content-type": "application/json" },
        }) as never
    )
    const c = fakeCtx("brat", { text: "x" }, "8.8.8.8")
    const r = (await proxyTool(c, "GET", { text: "x" })) as any
    expect(r.body.kind).toBe("json")
    expect(typeof r.body.data).toBe("string")
  })

  it("soft-error: HTTP 200 tapi {success:true, data:{result:'error1'}} → ok=false", async () => {
    _setFetchForTest(
      async () =>
        new Response(JSON.stringify({ success: true, data: { result: "error1" }, creator: "X" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }) as never
    )
    const c = fakeCtx("all-dl", { url: "https://x" }, "9.9.9.9")
    const r = (await proxyTool(c, "GET", { url: "https://x" })) as any
    expect(r.body.ok).toBe(false)
    expect(r.body.error).toBe("error1")
  })

  it("soft-error: status:false dengan message → ok=false + pesan", async () => {
    _setFetchForTest(
      async () =>
        new Response(JSON.stringify({ status: false, error: "Parameter 'url' wajib diisi" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }) as never
    )
    const c = fakeCtx("tiktok", { url: "https://x" }, "10.0.0.1")
    const r = (await proxyTool(c, "GET", { url: "https://x" })) as any
    expect(r.body.ok).toBe(false)
    expect(r.body.error).toContain("wajib diisi")
  })
})
