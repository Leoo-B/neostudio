import { useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { TOOLS, type ToolDef, type ApiResponse } from "@neostudio/shared"
import { Header, Footer } from "./HomePage"
import {
  ArrowDownTrayIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"

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

  const query = useQuery({
    queryKey: ["run", tool?.id, params],
    queryFn: () => runTool(tool!.id, params),
    enabled: !!tool && submitted,
  })

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

  return (
    <div className="min-h-dvh bg-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/c/$id" params={{ id: tool.category }} className="inline-flex items-center gap-1 text-sm text-muted-fg hover:text-cream transition-colors duration-150 mb-6">
          ← Kembali ke kategori
        </Link>

        <h1 className="font-head text-3xl sm:text-4xl mb-1">{tool.name}</h1>
        <p className="text-muted-fg mb-6">{tool.desc}</p>

        <div className="nb-card p-5 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.fields.map((f) => (
              <Field key={f.name} field={f} value={params[f.name] ?? ""}
                onChange={(v) => setParams((p) => ({ ...p, [f.name]: v }))} />
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
          <div className="nb-card p-5 border-danger flex items-start gap-3 nb-error-shake">
            <ExclamationTriangleIcon className="w-6 h-6 text-danger shrink-0" />
            <div>
              <p className="font-head">Gagal menjalankan tool</p>
              <p className="text-muted-fg text-sm mt-1">{query.error?.message ?? "Terjadi kesalahan. Ulangi sebentar lagi."}</p>
            </div>
          </div>
        )}

        {query.isLoading && !query.data && (
          <div className="space-y-3">
            <div className="nb-skeleton h-40 w-full" />
            <div className="nb-skeleton h-4 w-2/3" />
          </div>
        )}

        {query.data && <ResultView tool={tool} res={query.data} />}
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
      <span className="block text-sm font-medium mb-1">{field.label}{field.required ? " *" : ""}</span>
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

function ResultView({ tool, res }: { tool: ToolDef; res: ApiResponse }) {
  return (
    <section aria-label="Hasil" className="mt-6">
      <h2 className="font-head text-xl mb-3">Hasil</h2>
      {res.kind === "image" && res.imageUrl ? (
        <div className="nb-card p-4">
          <a href={res.imageUrl} download={`${tool.id}.png`} className="nb-btn inline-flex items-center gap-2 mb-4">
            <ArrowDownTrayIcon className="w-4 h-4" /> Unduh Gambar
          </a>
          <img src={res.imageUrl} alt={tool.name} className="w-full h-auto border-2 border-line bg-black" />
        </div>
      ) : res.kind === "json" ? (
        <JsonBlock tool={tool} data={res.data} />
      ) : (
        <div className="nb-card p-5">
          <p className="whitespace-pre-wrap break-words font-mono text-sm">{String(res.data ?? "")}</p>
        </div>
      )}
    </section>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border-2 border-line hover:bg-muted transition-colors duration-150 cursor-pointer"
    >
      {copied ? <CheckCircleIcon className="w-4 h-4 text-cream" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
      {copied ? "Tersalin!" : "Salin"}
    </button>
  )
}

function JsonBlock({ data }: { tool: ToolDef; data: unknown }) {
  const text = JSON.stringify(data, null, 2)
  // flattens: mengambil daftar URL gambar bila ada
  const images = extractImages(data)
  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="nb-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-head text-sm">Media ditemukan ({images.length})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.slice(0, 9).map((src, i) => (
              <img key={i} src={src} alt={`media ${i + 1}`} className="w-full h-32 object-cover border-2 border-line bg-black" />
            ))}
          </div>
        </div>
      )}
      <div className="nb-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-head text-sm">Respons JSON</span>
          <CopyButton text={text} />
        </div>
        <pre className="text-xs overflow-auto max-h-96 font-mono break-words whitespace-pre-wrap">{text}</pre>
      </div>
    </div>
  )
}

function extractImages(data: unknown): string[] {
  const out: string[] = []
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      if (/^https?:\/\/.+\.(jp?g|png|webp|gif)(\?|$)/i.test(v) || /^https?:\/\/.+(media|cdn|img|image|thumb)/i.test(v)) {
        out.push(v)
      }
    } else if (Array.isArray(v)) {
      v.forEach(walk)
    } else if (v && typeof v === "object") {
      Object.values(v).forEach(walk)
    }
  }
  walk(data)
  return [...new Set(out)].slice(0, 12)
}