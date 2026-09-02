import { useEffect, useMemo, useRef, useState } from "react"
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
  ChevronDownIcon,
} from "@heroicons/react/24/outline"
import { XCircleIcon } from "@heroicons/react/24/solid"
import { CATEGORIES, TOOLS } from "@neostudio/shared"
import { ScrollReveal } from "../components/ScrollReveal"

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
  { icon: CursorArrowRaysIcon, title: "Pilih Tool", desc: "Cari atau pilih dari 8 kategori" },
  { icon: ClipboardDocumentIcon, title: "Isi Input", desc: "Tempel link, ketik teks, atau pilih opsi" },
  { icon: CheckCircleIcon, title: "Dapat Hasil", desc: "Gambar, teks, atau JSON langsung tampil" },
]

const PERKS = [
  { title: "Gratis Selamanya", desc: "Semua tools bisa dipakai tanpa biaya, tanpa limit kuota." },
  { title: "Tanpa Daftar", desc: "Buka situs, pilih tool, langsung pakai. Tidak perlu akun." },
  { title: "Bahasa Indonesia", desc: "Antarmuka dan konten dirancang untuk pengguna Indonesia." },
  { title: "Cepat & Ringan", desc: "Halaman muat di bawah 2 detik, bundle hanya ~108KB." },
]

function useScrollProgress(): number {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        setP(total > 0 ? (window.scrollY / total) * 100 : 0)
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return p
}

export default function HomePage() {
  const [q, setQ] = useState("")
  const [openCat, setOpenCat] = useState<number | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return TOOLS.filter((x) => x.name.toLowerCase().includes(t) || x.desc.toLowerCase().includes(t)).slice(0, 8)
  }, [q])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
  }

  const progress = useScrollProgress()

  return (
    <div className="min-h-dvh bg-bg" onKeyDown={onKeyDown}>
      <div className="t-progress-wrap" role="progressbar" aria-label="Kemajuan scroll" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="t-progress-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* 1. HERO */}
        <section className="pt-16 pb-8 text-center">
          <div className="t-stagger is-shown">
            <div className="t-stagger-line t-stagger-line--1 inline-block nb-card px-4 py-1 mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cream">64 tools · 8 kategori · gratis</span>
            </div>
            <h1 className="font-head text-4xl sm:text-6xl leading-tight t-stagger-line t-stagger-line--2">neostudio</h1>
            <p className="mt-3 text-muted-fg text-base sm:text-lg max-w-xl mx-auto t-stagger-line t-stagger-line--3">
              Satu situs, banyak alat. Tanpa daftar, tanpa iklan popup. Pilih tool, isi input, dapat hasil.
            </p>
            <div className="mt-8 max-w-xl mx-auto relative t-stagger-line t-stagger-line--4">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none" />
              <input
                ref={searchInputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari tool… tekan / untuk fokus (mis. tiktok, qr, zodiak)"
                className="nb-input pl-12"
                aria-label="Cari tool"
              />
              {filtered.length > 0 && (
                <div className="absolute z-20 mt-2 w-full nb-card p-2 max-h-72 overflow-auto text-left">
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
              {q.trim() && filtered.length === 0 && (
                <div className="absolute z-20 mt-2 w-full nb-card p-5 text-center">
                  <XCircleIcon className="w-8 h-8 text-muted-fg mx-auto mb-2" />
                  <p className="text-sm font-semibold">Tidak ada tool cocok</p>
                  <p className="text-xs text-muted-fg mt-1">Coba kata kunci lain, mis. "qr", "tiktok", atau "zodiak".</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. STATS */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6">
            {[
              { n: "64+", l: "Tools" },
              { n: "8", l: "Kategori" },
              { n: "2", l: "Sumber API" },
              { n: "0", l: "Biaya / Akun" },
            ].map((s) => (
              <div key={s.l} className="nb-card px-4 py-5 text-center">
                <p className="font-head text-3xl text-cream">{s.n}</p>
                <p className="text-xs text-muted-fg mt-1 uppercase tracking-widest">{s.l}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* 3. TENTANG */}
        <ScrollReveal>
          <section aria-label="Tentang neostudio" className="py-10 max-w-2xl mx-auto text-center">
            <h2 className="font-head text-2xl sm:text-3xl">Apa itu neostudio?</h2>
            <p className="text-muted-fg mt-4 text-base sm:text-lg leading-relaxed">
              neostudio adalah platform alat online yang mengumpulkan{" "}
              <span className="text-cream">64+ tools berguna dalam satu tempat</span> — dari unduh video,
              generate QR, cek berita, edit gambar, sampai main tebak-tebakan. Semua{" "}
              <span className="text-cream">gratis, tanpa daftar, tanpa popup</span>, dan dalam bahasa Indonesia.
            </p>
          </section>
        </ScrollReveal>

        {/* 4. KEUNGGULAN */}
        <ScrollReveal>
          <section aria-label="Keunggulan" className="py-6">
            <h2 className="font-head text-2xl text-center mb-6">Kenapa neostudio?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PERKS.map((p) => (
                <div key={p.title} className="nb-card p-5">
                  <h3 className="font-head text-base text-cream">{p.title}</h3>
                  <p className="text-sm text-muted-fg mt-2 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* 5. CARA KERJA */}
        <ScrollReveal>
          <section aria-label="Cara kerja" className="py-6">
            <h2 className="font-head text-2xl text-center mb-6">Cara kerja</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </div>
          </section>
        </ScrollReveal>

        {/* 6. KATEGORI — accordion */}
        <section aria-label="Pilih kategori" className="py-6">
          <h2 className="font-head text-2xl mb-6">Pilih Kategori</h2>
          <div className="space-y-4">
            {CATEGORIES.map((cat, idx) => {
              const Icon = ICONS[cat.icon] ?? WrenchScrewdriverIcon
              const tools = TOOLS.filter((t) => t.category === cat.id)
              const isOpen = openCat === idx
              return (
                <div key={cat.id} className="nb-card">
                  <button
                    type="button"
                    onClick={() => setOpenCat(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-${cat.id}`}
                    className="w-full flex items-center gap-4 p-5 text-left cursor-pointer bg-transparent"
                  >
                    <div className="shrink-0 w-11 h-11 grid place-items-center border-2 border-line bg-altar">
                      <Icon className="w-6 h-6 text-cream" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-head text-lg">{cat.name}</h3>
                      <p className="text-xs text-muted-fg">{tools.length} tools</p>
                    </div>
                    <ChevronDownIcon className="w-6 h-6 text-muted-fg t-accordion-icon" />
                  </button>

                  <div id={`accordion-${cat.id}`} className={`t-accordion-body ${isOpen ? "is-open" : ""}`}>
                    <div className="t-accordion-inner">
                      <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t-2 border-line">
                        {tools.map((t) => (
                          <Link
                            key={t.id}
                            to="/tool/$id"
                            params={{ id: t.id }}
                            className="block p-3 border-2 border-line bg-altar hover:bg-muted hover:text-cream transition-colors duration-150 cursor-pointer"
                          >
                            <span className="font-medium text-sm">{t.name}</span>
                            <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-fg mt-1">
                              {t.resultKind}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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