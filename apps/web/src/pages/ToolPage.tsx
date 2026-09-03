import { useEffect, useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { TOOLS, type ToolDef, type ApiResponse } from "@neostudio/shared"
import { Header, Footer } from "./HomePage"
import { useToast } from "../components/Toast"
import { ResultView } from "../components/ResultView"
import { ExclamationTriangleIcon, ArrowRightIcon, ClipboardIcon } from "@heroicons/react/24/outline"

async function runTool(toolId: string, params: Record<string, unknown>): Promise<ApiResponse> {
  const res = await fetch(`/api/run/${toolId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolId, params }),
  })
  const json = (await res.json()) as ApiResponse
  if (!json.ok) throw new Error(json.error ?? `Gagal (${json.status})`)
  return json
}

export default function ToolPage() {
  const { id } = useParams({ strict: false }) as { id?: string }
  const tool = TOOLS.find((t) => t.id === id)
  const [params, setParams] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const toast = useToast()

  const query = useQuery({
    queryKey: ["run", tool?.id, JSON.stringify(params)],
    queryFn: () => runTool(tool!.id, params),
    enabled: !!tool && submitted,
  })

  useEffect(() => {
    if (query.isSuccess) toast(`${tool?.id ?? "Tool"} berhasil dijalankan`)
  }, [query.isSuccess, tool?.id, toast])

  if (!tool) {
    return (
      <div className="min-h-dvh bg-bg">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="font-head text-2xl">Tool tidak ditemukan</p>
          <Link to="/" className="nb-btn inline-block mt-6">Kembali ke Home</Link>
        </main>
      </div>
    )
  }

  const run = () => {
    setSubmitted(false)
    requestAnimationFrame(() => setSubmitted(true))
  }

  const hasRequired = tool.fields.every((f) => !f.required || (params[f.name] ?? "").trim())
  const fallback = tool.fallbackToolId ? TOOLS.find((t) => t.id === tool.fallbackToolId) : undefined

  return (
    <div className="min-h-dvh bg-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-fg hover:text-cream transition-colors duration-150 mb-6">
          ← Kembali ke home
        </Link>

        <h1 className="font-head text-3xl sm:text-4xl mb-1">{tool.name}</h1>
        <p className="text-muted-fg mb-6">{tool.desc}</p>

        <div className="nb-card p-5 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.fields.map((f) => (
              <Field
                key={f.name}
                field={f}
                value={params[f.name] ?? ""}
                onChange={(v) => setParams((p) => ({ ...p, [f.name]: v }))}
              />
            ))}
          </div>
          {tool.fields.length === 0 && (
            <p className="text-muted-fg text-sm mb-4">Tool ini tidak butuh input — langsung jalankan.</p>
          )}
          <button onClick={run} disabled={!hasRequired || query.isLoading}
            className="nb-btn mt-4 w-full sm:w-auto">
            {query.isLoading ? "Menjalankan…" : "Jalankan"}
          </button>
        </div>

        {query.isError && (
          <div className="nb-card p-5 border-danger nb-error-shake">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-danger shrink-0" />
              <div className="flex-1">
                <p className="font-head">Gagal menjalankan tool</p>
                <p className="text-muted-fg text-sm mt-1">{query.error?.message ?? "Terjadi kesalahan. Ulangi sebentar lagi."}</p>
                {fallback && (
                  <Link to="/tool/$id" params={{ id: fallback.id }} className="nb-btn inline-flex items-center gap-2 mt-4 text-sm">
                    Coba {fallback.name} <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {query.isLoading && !query.data && (
          <div className="space-y-3">
            <div className="nb-skeleton h-40 w-full" />
            <div className="nb-skeleton h-4 w-2/3" />
          </div>
        )}

        <div className={`t-panel ${query.data ? "is-open" : ""}`}>
          {query.data && <ResultView tool={tool} res={query.data} />}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Field({ field, value, onChange }: { field: ToolDef["fields"][number]; value: string; onChange: (v: string) => void }) {
  if (field.type === "select") {
    return (
      <label className="block">
        <span className="block text-sm font-medium mb-1">{field.label}{field.required ? " *" : ""}</span>
        <select className="nb-input" value={value} onChange={(e) => onChange(e.target.value)} required={field.required}>
          <option value="">Pilih…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
    )
  }
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1 flex items-center gap-2">
        {field.label}{field.required ? " *" : ""}
        {field.type === "url" && (
          <PasteButton onPaste={onChange} />
        )}
      </span>
      <input
        type={field.type === "url" ? "url" : "text"}
        className="nb-input"
        placeholder={field.placeholder ?? ""}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      />
    </label>
  )
}

function PasteButton({ onPaste }: { onPaste: (v: string) => void }) {
  const toast = useToast()
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          const text = await navigator.clipboard.readText()
          if (!text) {
            toast("Clipboard kosong")
            return
          }
          onPaste(text)
          toast("Ditempel dari clipboard")
        } catch {
          toast("Tidak bisa baca clipboard — tempel manual")
        }
      }}
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 border-2 border-line hover:bg-muted transition-colors cursor-pointer"
      title="Tempel dari clipboard"
    >
      <ClipboardIcon className="w-3.5 h-3.5" /> Tempel
    </button>
  )
}
