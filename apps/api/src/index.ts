import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { TOOLS } from "@neostudio/shared"
import { proxyTool } from "./proxy"

const app = new Hono()

const allow = (process.env.ALLOWED_ORIGINS ?? "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)

app.use("*", logger())
app.use(
  "*",
  cors({
    origin: allow.includes("*") ? "*" : allow,
    credentials: false,
  })
)

app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }))

app.get("/api/whereami", (c) => {
  // cf object dari Cloudflare (gratis, zero upstream call)
  const raw = c.req.raw as Request & { cf?: Record<string, unknown> }
  const cf = raw.cf ?? {}
  const ip =
    (c.req.header("cf-connecting-ip") ?? "").trim() ||
    (c.req.header("x-forwarded-for") ?? "").split(",")[0].trim() ||
    (c.req.header("x-real-ip") ?? "").trim() ||
    null

  const tz = typeof cf.timezone === "string" ? cf.timezone : null
  const city = typeof cf.city === "string" ? cf.city : null
  const country = typeof cf.country === "string" ? cf.country : null
  const region = typeof cf.region === "string" ? cf.region : null

  return c.json({
    ok: Boolean(ip || city),
    ip,
    city,
    region,
    country,
    timezone: tz,
    hint: !ip && !city ? "info lokasi tidak tersedia" : undefined,
  })
})

app.get("/api/catalog", (c) =>
  c.json({
    tools: TOOLS.map((t) => ({
      id: t.id,
      category: t.category,
      name: t.name,
      desc: t.desc,
      fields: t.fields,
      resultKind: t.resultKind,
      renderKind: t.renderKind,
    })),
  })
)

app.get("/api/run/:id", (c) => proxyTool(c, "GET", c.req.query()))
app.post("/api/run/:id", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>
  const params = (body.params as Record<string, unknown> | undefined) ?? body
  return proxyTool(c, "POST", params)
})

export default app
