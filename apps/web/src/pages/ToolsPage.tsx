import { useMemo, useRef, useState } from "react"
import { useSearch, useRouter } from "@tanstack/react-router"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { CATEGORIES, TOOLS } from "@neostudio/shared"
import { Header, Footer } from "../components/Layout"
import { ToolCard, CATEGORY_ICONS } from "../components/ToolCard"
import { FilterChips, type ChipFilter } from "../components/ui/FilterChips"
import { EmptyState } from "../components/EmptyState"

export default function ToolsPage() {
  const search = useSearch({ from: "/tools" })
  const router = useRouter()
  const [q, setQ] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const rawCat = typeof search.cat === "string" ? search.cat : "all"
  const cat = rawCat === "all" || CATEGORIES.some((c) => c.id === rawCat) ? rawCat : "all"

  const setCat = (id: string) => {
    router.navigate({ to: "/tools", search: { cat: id }, replace: true })
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

  // FilterChips: filter kategori (semua + 8 kategori), match tool
  const filters: ChipFilter<typeof TOOLS[number]>[] = useMemo(
    () => [
      { id: "all", label: "Semua", match: () => true },
      ...CATEGORIES.map((c) => ({ id: c.id, label: c.name, match: (t: typeof TOOLS[number]) => t.category === c.id })),
    ],
    [],
  )

  return (
    <div className="min-h-dvh bg-bg flex flex-col" onKeyDown={onKeyDown}>
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-16">
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
              className="nb-input !pl-10 !py-2.5 text-sm"
              aria-label="Cari tool"
            />
          </div>
        </div>

        {q ? (
          // mode pencarian: hasil text + grid results
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-fg">
                {results.length} hasil untuk <span className="text-cream">“{q}”</span>
              </p>
              <button type="button" onClick={() => setQ("")} className="text-sm text-cream hover:underline">
                Reset
              </button>
            </div>
            {results.length === 0 ? (
              <EmptyState q={q} onPick={(kw) => setQ(kw)} onReset={() => setQ("")} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((t) => {
                  const c = CATEGORIES.find((x) => x.id === t.category)
                  return <ToolCard key={t.id} tool={t} icon={c ? CATEGORY_ICONS[c.icon] : undefined} cat={cat} />
                })}
              </div>
            )}
          </>
        ) : (
          // mode kategori: FilterChips sliding thumb + reflow
          <FilterChips
            label="Filter kategori"
            items={TOOLS}
            filters={filters}
            value={cat}
            onValueChange={setCat}
            getKey={(t) => t.id}
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            rowHeight={96}
            emptyLabel="Tidak ada tool di kategori ini"
            renderItem={(t) => {
              const c = CATEGORIES.find((x) => x.id === t.category)
              return <ToolCard tool={t} icon={c ? CATEGORY_ICONS[c.icon] : undefined} cat={cat} />
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
