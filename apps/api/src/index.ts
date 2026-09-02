import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { TOOLS } from "@neostudio/shared"
import { proxyTool, warmCache } from "./proxy"

const app = new Hono()

app.use("*", logger())
app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    credentials: false,
  })
)

app.get("/health", (c) => c.json({ ok: true, ts: Date.now() }))

app.get("/api/catalog", (c) =>
  c.json({
    tools: TOOLS.map((t) => ({
      id: t.id,
      category: t.category,
      name: t.name,
      desc: t.desc,
      fields: t.fields,
      resultKind: t.resultKind,
    })),
  })
)

app.get("/api/run/:id", (c) => proxyTool(c, "GET", c.req.query()))
app.post("/api/run/:id", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as { params?: Record<string, unknown> }
  return proxyTool(c, "GET", body.params ?? {})
})

warmCache()

const port = Number(process.env.PORT ?? 8787)
console.log(`[neostudio api] listening on http://localhost:${port}`)

// @ts-ignore — Hono node-server handles serve.
import { serve } from "@hono/node-server"

serve({ fetch: app.fetch, port })
