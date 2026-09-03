import { useState } from "react"
import { ArrowTopRightOnSquareIcon, ArrowDownTrayIcon, ClipboardDocumentIcon, UserCircleIcon, ClipboardIcon } from "@heroicons/react/24/outline"
import { useToast } from "./Toast"
import { pickArr, pickPath, pickStr, toUrl, humanLabel, formatValue } from "../lib/results"
import type { ApiResponse, ToolDef } from "@neostudio/shared"

export function ResultView({ tool, res }: { tool: ToolDef; res: ApiResponse }) {
  return (
    <section aria-label="Hasil" className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <SuccessBadge />
        <h2 className="font-head text-xl">Hasil</h2>
      </div>
      {res.kind === "image" && res.imageUrl ? (
        <ImageView tool={tool} imageUrl={res.imageUrl} />
      ) : res.kind === "json" ? (
        <JsonView tool={tool} data={res.data} />
      ) : (
        <TextView text={String(res.data ?? "")} />
      )}
    </section>
  )
}

function ImageView({ tool, imageUrl }: { tool: ToolDef; imageUrl: string }) {
  return (
    <div className="nb-card p-4">
      <a href={imageUrl} download={`${tool.id}.png`} className="nb-btn inline-flex items-center gap-2 mb-4">
        <ArrowDownTrayIcon className="w-4 h-4" /> Unduh Gambar
      </a>
      <img src={imageUrl} alt={tool.name} className="w-full h-auto border-2 border-line bg-black" />
    </div>
  )
}

function TextView({ text }: { text: string }) {
  return (
    <div className="nb-card p-5">
      <p className="whitespace-pre-wrap break-words font-mono text-sm">{text}</p>
    </div>
  )
}

function JsonView({ tool, data }: { tool: ToolDef; data: unknown }) {
  const kind = tool.renderKind ?? "codeBlock"
  const items = pickArr<Record<string, unknown>>(pickPath(data, tool.resultPath))
  switch (kind) {
    case "image":
      return <ImageView tool={tool} imageUrl={String(pickPath(data, "data.imageUrl") || "")} />
    case "keyValue":
      return <KeyValueView obj={(items[0] ?? pickPath(data, tool.resultPath) ?? data) as Record<string, unknown>} titleField={tool.titleField} metaFields={tool.metaFields} />
    case "articleList":
      return <ArticleList items={items} tool={tool} />
    case "mediaList":
      return <MediaList items={items} tool={tool} rawData={data} />
    case "resultList":
      return <ResultList items={items} tool={tool} rawData={data} />
    case "profileCard":
      return <ProfileCardView obj={(items[0] ?? pickPath(data, tool.resultPath) ?? data) as Record<string, unknown>} tool={tool} />
    case "quoteCard":
      return <QuoteCardView data={data} tool={tool} />
    case "downloadCard":
      return <DownloadCard tool={tool} data={data} />
    case "imagePair":
      return <ImagePairView obj={(pickPath(data, tool.resultPath) ?? data) as Record<string, unknown>} tool={tool} />
    case "prayerTimes":
      return <PrayerTimesView obj={(pickPath(data, tool.resultPath) ?? data) as Record<string, unknown>} tool={tool} />
    case "quiz":
      return <QuizView obj={(pickPath(data, tool.resultPath) ?? data) as Record<string, unknown>} tool={tool} />
    case "codeBlock":
    default:
      return <CodeBlock data={data} tool={tool} />
  }
}

function SuccessBadge() {
  const [show, setShow] = useState(false)
  if (typeof window !== "undefined" && !show) {
    queueMicrotask(() => setShow(true))
  }
  return (
    <span className="t-success-check" data-state={show ? "in" : "out"} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6">
        <circle cx="24" cy="24" r="20" stroke="#F5DEB3" strokeWidth="3" />
        <path d="M14 25 L21 32 L34 18" stroke="#F5DEB3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  return (
    <button
      onClick={() => {
        void navigator.clipboard.writeText(text)
        setCopied(true)
        toast("Disalin ke clipboard")
        setTimeout(() => setCopied(false), 1200)
      }}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border-2 border-line hover:bg-muted transition-colors duration-150 cursor-pointer"
    >
      <ClipboardDocumentIcon className="w-4 h-4" />
      {copied ? "Tersalin!" : "Salin"}
    </button>
  )
}

function MetaChips({ obj, fields }: { obj: Record<string, unknown>; fields?: string[] }) {
  if (!fields?.length) return null
  const items = fields.map((f) => {
    const v = pickStr(obj, f)
    if (!v || v === "-") return null
    return { k: f, v }
  }).filter(Boolean) as { k: string; v: string }[]
  if (!items.length) return null
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((m) => (
        <span key={m.k} className="nb-chip text-[10px]">
          {humanLabel(m.k)}: <span className="text-cream ml-1">{formatValue(m.k, m.v)}</span>
        </span>
      ))}
    </div>
  )
}

function KeyValueView({ obj, titleField, metaFields }: { obj: Record<string, unknown>; titleField?: string; metaFields?: string[] }) {
  const title = titleField ? pickStr(obj, titleField) : undefined
  const pairs: [string, string][] = []
  for (const [k, v] of Object.entries(obj)) {
    if (k === "creator" || k === "status" || k === "success" || k === "timestamp") continue
    if (titleField && k === titleField) continue
    if (typeof v === "object" && v !== null) continue
    pairs.push([k, String(v ?? "")])
  }
  return (
    <div className="nb-card p-5">
      {title && <h3 className="font-head text-lg text-cream mb-3">{title}</h3>}
      <dl className="grid grid-cols-1 sm:grid-cols-[10rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
        {pairs.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted-fg capitalize">{k.replace(/_/g, " ")}</dt>
            <dd className="min-w-0 font-medium break-words">{v}</dd>
          </div>
        ))}
      </dl>
      {metaFields && <MetaChips obj={obj} fields={metaFields} />}
    </div>
  )
}

function ProfileCardView({ obj, tool }: { obj: Record<string, unknown>; tool: ToolDef }) {
  const name = pickStr(obj, tool.titleField ?? "name") ?? pickStr(obj, "username") ?? pickStr(obj, "nickname") ?? "User"
  const bio = pickStr(obj, tool.descriptionField ?? "bio")
  const avatar = toUrl(pickStr(obj, tool.imageField ?? "profile_pic") ?? pickStr(obj, "avatar_url"))
  const link = toUrl(pickStr(obj, tool.linkField ?? "url") ?? pickStr(obj, "html_url"))
  return (
    <div className="nb-card p-5 sm:p-6 flex gap-5">
      {avatar ? (
        <img src={avatar} alt={name} className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-line bg-altar object-cover" />
      ) : (
        <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-line bg-altar grid place-items-center">
          <UserCircleIcon className="w-10 h-10 text-muted-fg" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-head text-xl text-cream">{name}</h3>
        {bio && <p className="text-sm text-muted-fg mt-1">{bio}</p>}
        <MetaChips obj={obj} fields={tool.metaFields} />
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-cream hover:underline cursor-pointer">
            Buka profil <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

function QuoteCardView({ data, tool }: { data: unknown; tool: ToolDef }) {
  const items = pickArr<Record<string, unknown>>(pickPath(data, tool.resultPath ?? ""))
  const first = items[0] ?? (data as Record<string, unknown>)
  const q = pickStr(first, tool.titleField ?? "quote") ?? pickStr(first, "result") ?? JSON.stringify(first).slice(0, 200)
  const author = pickStr(first, "author") ?? pickStr(first, "by") ?? pickStr(first, "character")
  return (
    <div className="nb-card p-6">
      <p className="font-head text-xl sm:text-2xl leading-relaxed text-cream">“{q}”</p>
      {author && <p className="mt-3 text-sm text-muted-fg">— {author}</p>}
    </div>
  )
}

function ArticleList({ items, tool }: { items: Record<string, unknown>[]; tool: ToolDef }) {
  if (!items.length) {
    return <CodeBlock data={items} />
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.slice(0, 12).map((it, i) => {
        const title = pickStr(it, tool.titleField ?? "title") ?? "Tanpa judul"
        const img = toUrl(pickStr(it, tool.imageField ?? "image_thumbnail") ?? pickStr(it, "image_full") ?? pickStr(it, "img"))
        const link = toUrl(pickStr(it, tool.linkField ?? "link") ?? pickStr(it, "url"))
        return (
          <a
            key={i}
            href={link ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="nb-card block p-0 overflow-hidden group"
          >
            {img ? (
              <div className="aspect-video bg-black border-b-2 border-line overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="aspect-video bg-altar border-b-2 border-line grid place-items-center text-muted-fg text-xs font-mono">
                no image
              </div>
            )}
            <div className="p-4">
              <h3 className="font-head text-base leading-snug line-clamp-3 group-hover:text-cream transition-colors duration-150">
                {title}
              </h3>
              <MetaChips obj={it} fields={tool.metaFields} />
            </div>
          </a>
        )
      })}
    </div>
  )
}

function MediaList({ items, tool, rawData }: { items: Record<string, unknown>[]; tool: ToolDef; rawData: unknown }) {
  if (!items.length) {
    const fallback = extractImages(rawData)
    if (fallback.length) {
      return (
        <div className="nb-card p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fallback.slice(0, 12).map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noreferrer" className="block border-2 border-line bg-black">
                <img src={src} alt="" className="w-full h-32 object-cover" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      )
    }
    return <CodeBlock data={rawData} />
  }
  return (
    <div className="nb-card p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.slice(0, 12).map((it, i) => {
          const src = toUrl(pickStr(it, tool.imageField ?? "image") ?? pickStr(it, "url") ?? pickStr(it, "thumbnail"))
          if (!src) return null
          return (
            <a key={i} href={src} target="_blank" rel="noreferrer" className="block border-2 border-line bg-black">
              <img src={src} alt="" className="w-full h-32 object-cover" loading="lazy" />
            </a>
          )
        })}
      </div>
    </div>
  )
}

function ResultList({ items, tool, rawData }: { items: Record<string, unknown>[]; tool: ToolDef; rawData: unknown }) {
  if (!items.length) {
    return <CodeBlock data={rawData} />
  }
  return (
    <div className="space-y-3">
      {items.slice(0, 12).map((it, i) => {
        const title = pickStr(it, tool.titleField ?? "title") ?? pickStr(it, "name") ?? pickStr(it, "username") ?? `Item ${i + 1}`
        const desc = pickStr(it, tool.descriptionField ?? "description")
        const link = toUrl(pickStr(it, tool.linkField ?? "url") ?? pickStr(it, "link") ?? pickStr(it, "join_url"))
        return (
          <div key={i} className="nb-card p-4 flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-head text-base break-words">{title}</h3>
              {desc && <p className="text-sm text-muted-fg mt-1 break-words line-clamp-2">{desc}</p>}
              <MetaChips obj={it} fields={tool.metaFields} />
            </div>
            {link && (
              <a href={link} target="_blank" rel="noreferrer" className="nb-btn text-xs px-3 py-1.5 shrink-0 inline-flex items-center gap-1.5">
                Buka <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}

function DownloadCard({ tool, data }: { tool: ToolDef; data: unknown }) {
  const toast = useToast()
  const raw = (pickPath(data, tool.resultPath) ?? data) as Record<string, unknown>
  const urlFields = (tool.downloadFields && tool.downloadFields.length ? tool.downloadFields : tool.downloadField ? [tool.downloadField] : ["url"])
  const read = (path: string | undefined): string | undefined => {
    if (!path) return undefined
    let cur: unknown = raw
    for (const k of path.split(".")) {
      if (cur && typeof cur === "object" && k in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[k]
      } else {
        return undefined
      }
    }
    if (typeof cur === "string") return cur
    if (typeof cur === "number") return String(cur)
    return undefined
  }
  const title = read(tool.titleField) ?? tool.name
  const desc = read(tool.descriptionField)
  const thumb = toUrl(read(tool.thumbnailField) ?? read("thumbnail") ?? read("cover") ?? read("image"))
  const meta = (tool.metaFields ?? [])
    .map((k) => ({ k, v: read(k) }))
    .filter((m) => !!m.v)

  const downloads = urlFields
    .map((f) => ({ key: f, url: toUrl(read(f)) }))
    .filter((x) => !!x.url) as { key: string; url: string }[]

  if (!downloads.length) {
    return <CodeBlock data={data} />
  }

  const graded = downloads.map((d, i) => {
    const key = d.key.toLowerCase()
    let label = "Download"
    if (key.includes("no_watermark") || key === downloads[0].key) label = i === 0 ? "Download Video (No WM)" : "Download Video"
    else if (key.includes("watermark")) label = "Download Video (WM)"
    else if (key.includes("music") || key.includes("audio") || key.includes("mp3")) label = "Download Audio"
    else if (key.includes("sd")) label = "SD"
    else if (key.includes("hd")) label = "HD"
    return { ...d, label }
  })

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).catch(() => {})
    toast("Link disalin")
  }

  return (
    <div className="nb-card overflow-hidden">
      {thumb && (
        <div className="aspect-video bg-black border-b-2 border-line overflow-hidden">
          <img src={thumb} alt={title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-head text-lg break-words">{title}</h3>
        {desc && <p className="text-sm text-muted-fg mt-1 break-words line-clamp-2">{desc}</p>}
        {meta.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {meta.map((m) => (
              <span key={m.k} className="nb-chip text-[10px] leading-none">
                {m.k}: <span className="text-cream ml-1">{m.v}</span>
              </span>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          {graded.map((d) => (
            <a key={d.url} href={d.url} target="_blank" rel="noreferrer" download className="nb-btn inline-flex items-center gap-2 text-sm">
              <ArrowDownTrayIcon className="w-4 h-4" />
              {d.label}
            </a>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={() => copyUrl(graded[0].url)} className="text-xs border-2 border-line px-3 py-2 hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer">
            <ClipboardIcon className="w-4 h-4" /> Salin Link
          </button>
          {tool.fallbackToolId && (
            <span className="text-xs text-muted-fg">
              Gagal? Coba <code className="font-mono border border-line px-1 font-bold">{tool.fallbackToolId}</code>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ImagePairView({ obj, tool }: { obj: Record<string, unknown>; tool: ToolDef }) {
  const left = toUrl(pickStr(obj, tool.leftField))
  const right = toUrl(pickStr(obj, tool.rightField))
  if (!left && !right) return <CodeBlock data={obj} />
  return (
    <div className="grid grid-cols-2 gap-3">
      {left && (
        <div className="nb-card overflow-hidden">
          <img src={left} alt="cowo" className="w-full aspect-square object-cover" loading="lazy" />
          <div className="p-2 text-center text-sm">Cowo</div>
        </div>
      )}
      {right && (
        <div className="nb-card overflow-hidden">
          <img src={right} alt="cewe" className="w-full aspect-square object-cover" loading="lazy" />
          <div className="p-2 text-center text-sm">Cewe</div>
        </div>
      )}
    </div>
  )
}

function PrayerTimesView({ obj, tool }: { obj: Record<string, unknown>; tool: ToolDef }) {
  const title = pickStr(obj, tool.titleField) ?? "Jadwal"
  const jadwal = pickPath(obj, tool.jadwalField) as Record<string, unknown> | undefined
  if (!jadwal) {
    return <KeyValueView obj={obj} titleField={tool.titleField} metaFields={tool.metaFields} />
  }
  return (
    <div className="nb-card p-5">
      <h3 className="font-head text-xl">{title}</h3>
      <MetaChips obj={obj} fields={tool.metaFields} />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(jadwal).map(([k, v]) => {
          const val = String(v)
          const isJadwal = !["tanggal", "hijri", "date"].includes(k.toLowerCase())
          return (
            <div key={k} className="flex justify-between border-b border-line/60 py-1 text-sm">
              <span className="text-muted-fg capitalize">{humanLabel(k)}</span>
              <span className={`font-mono ${isJadwal ? "font-bold text-cream" : ""}`}>{val}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuizView({ obj, tool }: { obj: Record<string, unknown>; tool: ToolDef }) {
  const question = pickStr(obj, tool.questionField) ?? String(pickPath(obj, "question") ?? "")
  const answer = pickStr(obj, tool.answerField) ?? String(pickPath(obj, "answer") ?? "")
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="nb-card p-5 sm:p-6 flex flex-col gap-4">
      <div className="text-2xl sm:text-3xl font-head font-bold tracking-tight py-6 px-4 bg-muted text-center border-2 border-line">
        {question || "Soal tidak tersedia"}
      </div>
      <button type="button" className="nb-btn w-full sm:max-w-xs mx-auto" aria-expanded={revealed} onClick={() => setRevealed((v) => !v)}>
        {revealed ? "Sembunyikan Jawaban" : "Lihat Jawaban"}
      </button>
      {revealed && (
        <div className="nb-card p-4 border-cream text-center bg-bg">
          <span className="text-sm text-muted-fg block mb-1">Jawaban</span>
          <span className="font-head text-2xl text-cream font-bold">{answer}</span>
          <MetaChips obj={obj} fields={tool.metaFields} />
        </div>
      )}
      {!revealed && <MetaChips obj={obj} fields={tool.metaFields} />}
    </div>
  )
}

function CodeBlock({ data, tool }: { data: unknown; tool?: ToolDef }) {
  const displayed = tool?.resultPath ? (pickPath(data, tool.resultPath) ?? data) : data
  const text = typeof displayed === "string" ? displayed : JSON.stringify(displayed, null, 2)
  return (
    <div className="nb-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-head text-sm">Respons</span>
        <CopyButton text={text} />
      </div>
      <pre className="text-xs overflow-auto max-h-96 font-mono break-words whitespace-pre-wrap">{text}</pre>
    </div>
  )
}

function extractImages(data: unknown): string[] {
  const out: string[] = []
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      if (/^https?:\/\/.+\.(jp?g|png|webp|gif)(\?|$)/i.test(v) || /^data:image\//.test(v)) out.push(v)
    } else if (Array.isArray(v)) {
      v.forEach(walk)
    } else if (v && typeof v === "object") {
      Object.values(v).forEach(walk)
    }
  }
  walk(data)
  return [...new Set(out)].slice(0, 12)
}