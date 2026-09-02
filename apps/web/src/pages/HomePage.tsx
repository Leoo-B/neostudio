import { useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  WrenchScrewdriverIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  NewspaperIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { CATEGORIES, TOOLS } from "@neostudio/shared"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WrenchScrewdriverIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  NewspaperIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  EyeIcon,
}

const STEPS = [
  { icon: CursorArrowRaysIcon, title: "Pilih Tool", desc: "Cari atau jelajahi 8 kategori" },
  { icon: ClipboardDocumentIcon, title: "Isi Input", desc: "Tempel link, ketik teks, atau pilih opsi" },
  { icon: CheckCircleIcon, title: "Dapat Hasil", desc: "Gambar, teks, atau JSON siap dipakai" },
]

export default function HomePage() {
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return TOOLS.filter((x) => x.name.toLowerCase().includes(t) || x.desc.toLowerCase().includes(t)).slice(0, 8)
  }, [q])

  return (
    <div className="min-h-dvh bg-bg">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* HERO */}
        <section className="pt-16 pb-10 text-center">
          <div className="inline-block nb-card px-4 py-1 mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cream">64 tools · 8 kategori · gratis</span>
          </div>
          <h1 className="font-head text-4xl sm:text-6xl leading-tight">
            neostudio
          </h1>
          <p className="mt-3 text-muted-fg text-base sm:text-lg max-w-xl mx-auto">
            Satu situs, banyak alat. Tanpa daftar, tanpa iklan popup. Pilih tool, isi input, dapat hasil.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari tool… (mis. tiktok, qr, zodiak)"
              className="nb-input pl-12"
              aria-label="Cari tool"
            />
            {filtered.length > 0 && (
              <div className="absolute z-20 mt-2 w-full nb-card p-2 max-h-72 overflow-auto">
                {filtered.map((t) => (
                  <Link
                    key={t.id}
                    to="/tool/$id"
                    params={{ id: t.id }}
                    className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted hover:text-cream transition-colors duration-150"
                  >
                    <span>{t.name}</span>
                    <ChevronRightIcon className="w-4 h-4 text-muted-fg" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CARA PAKAI STRIP */}
        <section aria-label="Cara pakai" className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.title} className="nb-card p-5 flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 grid place-items-center border-2 border-line bg-altar">
                <s.icon className="w-6 h-6 text-cream" />
              </div>
              <div>
                <p className="font-head text-sm">
                  <span className="text-cream font-mono mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </p>
                <p className="text-muted-fg text-sm mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* GRID KATEGORI */}
        <section aria-label="Kategori">
          <div className="flex items-end justify-between mb-5">
            <h2 className="font-head text-2xl">Kategori</h2>
            <span className="nb-chip font-mono">8 kategori</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.icon] ?? WrenchScrewdriverIcon
              const count = TOOLS.filter((t) => t.category === cat.id).length
              return (
                <Link
                  key={cat.id}
                  to="/c/$id"
                  params={{ id: cat.id }}
                  className="nb-card block p-5 cursor-pointer"
                >
                  <div className="w-12 h-12 grid place-items-center border-2 border-line bg-altar mb-4">
                    <Icon className="w-6 h-6 text-cream" />
                  </div>
                  <h3 className="font-head text-lg">{cat.name}</h3>
                  <p className="text-muted-fg text-sm mt-1">{cat.desc}</p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-cream">
                    {count} tools
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur border-b-2 border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-head text-xl font-bold tracking-tight hover:text-cream transition-colors duration-150">
          neo<span className="text-cream">studio</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/" className="hover:text-cream transition-colors duration-150 hidden sm:inline">Home</Link>
          <a
            href="https://github.com/Leoo-B/neostudio"
            target="_blank"
            rel="noreferrer"
            className="nb-chip hover:bg-cream hover:text-oncream transition-colors duration-150 cursor-pointer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t-2 border-line mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-fg">
        <p>© {new Date().getFullYear()} neostudio — dibangun dengan React + Hono</p>
        <p className="font-mono uppercase tracking-widest">dark neobrutalism</p>
      </div>
    </footer>
  )
}
