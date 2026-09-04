import { useMemo, useRef, useState } from "react"
import { Link, useSearch, useRouter } from "@tanstack/react-router"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { CATEGORIES, TOOLS } from "@neostudio/shared"
import { Header, Footer } from "./HomePage"
import { ToolCard, CATEGORY_ICONS } from "../components/ToolCard"
import { Reveal } from "../components/Reveal"

export default function ToolsPage() {
  const search = useSearch({ from: "/tools" })
  const router = useRouter()
  const [q, setQ] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const rawCat = typeof search.cat === "string" ? search.cat : "all"
  const cat = rawCat === "all" || CATEGORIES.some((c) => c.id === rawCat) ? rawCat : "all"

  const setCat = (id: string) => {
    router.navigate({ to: "/tools", search: { cat: id } })
  }

  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t) return TOOLS.filter((x) => x.name.toLowerCase().includes(t) || x.desc.toLowerCase().includes(t))
    if (cat === "all") return TOOLS
    return TOOLS.filter((x) => x.category === cat)
  }, [q, cat])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
  }

  const activeCat = CATEGORIES.find((c) => c.id === cat) ?? CATEGORIES[0]

  return (
    <div className="min-h-dvh bg-bg" onKeyDown={onKeyDown}>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="pt-10 pb-6 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h1 className="font-head text-3xl sm:text-4xl">Semua Tools</h1>
            <p className="text-muted-fg mt-1 text-sm">
              {TOOLS.length} tools dalam {CATEGORIES.length} kategori — gratis, tanpa daftar.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none" />
            <input
              ref={searchInputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari… ( / )"
              className="nb-input pl-10 !py-2.5 text-sm"
              aria-label="Cari tool"
            />
          </div>
        </div>

        <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-bg/85 backdrop-blur border-b border-line mb-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => setCat("all")} className={`nb-chip ${cat === "all" && !q ? "is-active" : ""}`}>
            Semua
          </button>
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon
            return (
              <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`nb-chip ${cat === c.id && !q ? "is-active" : ""}`}>
                <Icon className="w-4 h-4" />
                {c.name}
              </button>
            )
          })}
        </div>

        <Reveal>
          {q ? (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-fg">
                {results.length} hasil untuk <span className="text-cream">“{q}”</span>
              </p>
              <Link to="/tools" onClick={() => setQ("")} className="text-sm text-cream hover:underline">Reset</Link>
            </div>
          ) : cat === "all" ? (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-fg">{TOOLS.length} tools dalam {CATEGORIES.length} kategori.</p>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-fg">{(activeCat as typeof CATEGORIES[number]).desc}</p>
            </div>
          )}
        </Reveal>

        {results.length === 0 ? (
          <div className="nb-card p-10 text-center">
            <p className="font-head text-lg">Tidak ada tool yang cocok</p>
            <p className="text-sm text-muted-fg mt-2">Coba kata kunci lain, mis. “qr”, “tiktok”, atau “zodiak”.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((t) => {
              const c = CATEGORIES.find((x) => x.id === t.category)
              return <ToolCard key={t.id} tool={t} icon={c ? CATEGORY_ICONS[c.icon] : undefined} />
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
