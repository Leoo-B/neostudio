import { useEffect, useState } from "react"
import { Link, useSearch, useParams, useRouter } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { TOOLS, type ToolDef } from "@neostudio/shared"
import { Header, Footer } from "../components/Layout"
import { useToast } from "../components/Toast"
import { ResultView } from "../components/ResultView"
import { runTool } from "../lib/run"
import { ExclamationTriangleIcon, ArrowRightIcon, ClipboardIcon } from "@heroicons/react/24/outline"

export default function ToolPage() {
  const { id } = useParams({ strict: false }) as { id?: string }
  const { cat } = useSearch({ strict: false }) as { cat?: string }
  const router = useRouter()
  const tool = TOOLS.find((t) => t.id === id)

  // kembali beneran kalau dari dalam app (gak numpuk history); fallback navigasi kalau deep-link
  const kembali = () => {
    if (document.referrer.startsWith(window.location.origin)) {
      router.history.back()
    } else {
      router.navigate({ to: "/tools", search: cat ? { cat } : undefined })
    }
  }
  const [params, setParams] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const toast = useToast()

  const query = useQuery({
    queryKey: ["run", tool?.id, JSON.stringify(params)],
    queryFn: () => runTool(tool!.id, params),
    enabled: !!tool && submitted,
  })

  const queryClient = useQueryClient()

  // keluar tool = hapus hasil cache-nya, biar balik lagi mulai dari awal
  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ["run", tool?.id] })
    }
  }, [tool?.id, queryClient])

  useEffect(() => {
    if (query.isSuccess) toast(`${tool?.id ?? "Tool"} berhasil dijalankan`)
  }, [query.isSuccess, tool?.id, toast])

  if (!tool) {
    return (
      <div className="min-h-dvh bg-bg">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="font-head text-2xl">Tool tidak ditemukan</p>
          <Link to="/tools" className="nb-btn inline-block mt-6">Kembali ke daftar Tools</Link>
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
        <button type="button" onClick={kembali} className="inline-flex items-center gap-1 text-sm text-muted-fg hover:text-cream transition-colors duration-150 mb-6">
          ← Kembali ke daftar tools
        </button>

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
            className="nb-btn mt-4 w-full sm:w-auto relative overflow-hidden disabled:opacity-70">
            <span className={query.isLoading ? "invisible" : ""}>Jalankan</span>
            {query.isLoading && (
              <span className="absolute inset-0 flex items-center justify-center gap-2" aria-live="polite">
                <span className="inline-block w-4 h-4 border-2 border-bg/30 border-t-cream rounded-full animate-spin" aria-hidden />
                <span>Menjalankan…</span>
              </span>
            )}
            {query.isLoading && <span className="absolute left-0 right-0 bottom-0 t-progress-indeterminate" aria-hidden />}
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
          <div className="nb-card overflow-hidden" aria-live="polite" aria-busy="true">
            <div className="t-progress-indeterminate" aria-hidden />
            <div className="p-5 sm:p-6 text-sm text-muted-fg flex items-center gap-3">
              <span className="inline-block w-4 h-4 border-2 border-line border-t-cream rounded-full animate-spin" aria-hidden />
              Mengambil hasil…
            </div>
          </div>
        )}

        <div className={`t-panel ${query.data ? "is-open" : ""}`}>
          {query.data && <ResultView tool={tool} res={query.data} params={params} />}
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
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 border border-line hover:bg-muted transition-colors cursor-pointer"
      title="Tempel dari clipboard"
    >
      <ClipboardIcon className="w-3.5 h-3.5" /> Tempel
    </button>
  )
}
