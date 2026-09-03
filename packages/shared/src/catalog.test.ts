import { test, assert } from "vitest"
import { CATEGORIES, TOOLS } from "./index"

test("katalog memiliki tepat 8 kategori", () => {
  assert.equal(CATEGORIES.length, 8)
  assert.equal(new Set(CATEGORIES.map((c) => c.id)).size, 8)
})

test("setiap kategori punya tool minimal 1", () => {
  for (const c of CATEGORIES) {
    const n = TOOLS.filter((t) => t.category === c.id).length
    assert.ok(n >= 1, `kategori ${c.id} kosong`)
  }
})

test("setiap tool punya id unik, path, baseUrl, dan resultKind valid", () => {
  const ids = new Set<string>()
  for (const t of TOOLS) {
    assert.ok(!ids.has(t.id), `duplikat id: ${t.id}`)
    ids.add(t.id)
    assert.ok(t.path.startsWith("/"), `path ${t.id} harus mulai dengan /`)
    assert.ok(t.baseUrl.startsWith("http"), `baseUrl ${t.id} harus http`)
    assert.ok(["image", "text", "json", "file"].includes(t.resultKind), `resultKind ${t.id} invalid`)
  }
})

test("semua field punya name + label + type valid", () => {
  for (const t of TOOLS) {
    for (const f of t.fields) {
      assert.ok(f.name, `field kosong di tool ${t.id}`)
      assert.ok(f.label, `label kosong di tool ${t.id}.${f.name}`)
      assert.ok(["text", "url", "number", "select", "file"].includes(f.type))
    }
  }
})

test("total tools sama dengan jumlah dikunci (64)", () => {
  assert.equal(TOOLS.length, 64)
})

test("semua downloader pakai downloadCard + punya downloadField", () => {
  const dls = TOOLS.filter((t) => t.category === "downloader")
  assert.ok(dls.length >= 10, "harus ada minimal 10 downloader")
  for (const t of dls) {
    assert.equal(t.renderKind, "downloadCard", `download ${t.id} harus downloadCard`)
    assert.ok(t.downloadField || (t.downloadFields && t.downloadFields.length), `download ${t.id} wajib downloadField/downloadFields`)
  }
})

test("maths sudah pakai kyzznekoo dengan param level + renderKind quiz", () => {
  const m = TOOLS.find((t) => t.id === "maths")!
  assert.equal(m.source, "kyzznekoo")
  assert.equal(m.path, "/api/game/maths")
  assert.equal(m.renderKind, "quiz")
  const level = m.fields.find((f) => f.name === "level")
  assert.ok(level && level.type === "select" && (level.options?.length ?? 0) > 0, "maths wajib punya param level select")
})

test("sholat pakai prayerTimes + ppcouple imagePair (render baru)", () => {
  const sholat = TOOLS.find((t) => t.id === "sholat")!
  assert.equal(sholat.renderKind, "prayerTimes")
  assert.ok(sholat.jadwalField, "sholat butuh jadwalField")
  const pp = TOOLS.find((t) => t.id === "ppcouple")!
  assert.equal(pp.renderKind, "imagePair")
  assert.ok(pp.leftField && pp.rightField)
})

test("balogo pakai param 'nama' (bukan 'text') sesuai kontrak kyzz", () => {
  const b = TOOLS.find((t) => t.id === "balogo")!
  assert.ok(b.fields.some((f) => f.name === "nama"), "balogo wajib field 'nama'")
})
