import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import { MagnifyingGlassIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { CATEGORIES, TOOLS } from "@neostudio/shared"
import { ToolCard, CATEGORY_ICONS } from "../components/ToolCard"
import { FAQ } from "../components/FAQ"
import { Reveal } from "../components/Reveal"

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
  const [selectedTab, setSelectedTab] = useState<string>("tools")
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
  const activeCat = CATEGORIES.find((c) => c.id === selectedTab) ?? CATEGORIES[0]
  const toolsInTab = TOOLS.filter((t) => t.category === selectedTab).slice(0, 12)

  return (
    <div className="min-h-dvh bg-bg" onKeyDown={onKeyDown}>
      <div className="t-progress-wrap" role="progressbar" aria-label="Kemajuan scroll" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="t-progress-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Hero */}
        <section className="pt-16 pb-10 text-center">
          <div className="inline-block nb-card px-4 py-1.5 mb-6 rounded-full">
            <span className="text-[11px] font-mono uppercase tracking-widest text-cream">64 tools · 8 kategori · gratis</span>
          </div>
          <h1 className="font-head text-4xl sm:text-6xl leading-tight">
            neostudio<span className="text-cream">.</span>
          </h1>
          <p className="mt-4 text-muted-fg text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Satu tempat untuk 64+ alat digital — unduh video, generate QR, cek berita, edit gambar, sampai primbon.
            Semua gratis, tanpa daftar, tanpa iklan pop-up.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
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
              <div className="absolute z-20 mt-2 w-full nb-card p-2 max-h-72 overflow-auto text-left shadow-lift">
                {filtered.map((t) => (
                  <Link key={t.id} to="/tool/$id" params={{ id: t.id }} className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted hover:text-cream transition-colors duration-150 rounded-lg">
                    <span>{t.name}</span>
                    <ChevronRightIcon className="w-4 h-4 text-muted-fg" />
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-center">
            <Link to="/tools" className="nb-btn inline-flex items-center gap-2">
              Jelajahi Semua Tools
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Kategori — tab filter */}
        <Reveal>
          <section aria-label="Pilih kategori" className="py-6">
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICONS[c.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedTab(c.id)}
                    className={`nb-chip ${selectedTab === c.id ? "is-active" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    {c.name}
                  </button>
                )
              })}
            </div>
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="font-head text-2xl">{activeCat.name}</h2>
                <p className="text-sm text-muted-fg mt-1">{activeCat.tagline}</p>
              </div>
              <Link to="/tools" search={{ cat: selectedTab }} className="text-sm text-cream hover:underline inline-flex items-center gap-1">
                Lihat semua <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {toolsInTab.map((t) => (
                <ToolCard key={t.id} tool={t} icon={CATEGORY_ICONS[activeCat.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section aria-label="Pertanyaan umum" className="py-10 max-w-3xl mx-auto">
            <h2 className="font-head text-2xl sm:text-3xl text-center mb-8">Pertanyaan Umum</h2>
            <FAQ
              groups={[
                {
                  title: "Umum",
                  items: [
                    {
                      q: "Apa itu neostudio?",
                      a: "Coba bayangin kamu lagi males unduh aplikasi buat satu hal kecil — bikin QR, unduh video TikTok, atau cek info pasangan di media sosial. neostudio ngumpulin semua itu di satu tempat. Bukan startup besar, cuma kumpulan tool yang kebetulan dipakai banyak orang.",
                    },
                    {
                      q: "Apakah neostudio bener-bener gratis?",
                      a: "Iya, beneran. Semua alat gratis selamanya. Kalau tiba-tiba ada pop-up “daftar dulu” atau “langganan”, berarti kamu lagi di situs palsu.",
                    },
                    {
                      q: "Kenapa gak perlu daftar akun?",
                      a: "Karena bikin akun itu capek, dan kami juga gak butuh data kamu. Lagi pula data apa yang mau dikumpulin wong gak ada yang login.",
                    },
                    {
                      q: "Bisa dipakai di HP?",
                      a: "Tentu. Halaman responsif dan nyaman dibuka dari HP, tablet, maupun desktop.",
                    },
                  ],
                },
                {
                  title: "Tools & Penggunaan",
                  items: [
                    {
                      q: "Bagaimana cara pakai tool?",
                      a: "Pilih tool, isi field yang diminta (URL, teks, atau opsi), lalu klik “Jalankan”. Hasil muncul di bawah — bisa diunduh atau disalin.",
                    },
                    {
                      q: "Data yang saya proses aman gak?",
                      a: "Sebagian besar tool jalan di browser atau server secara ephemeral — kami tidak menyimpan hasilnya. Data cuma dipakai sebentar buat nge-fetch hasil lalu dibuang.",
                    },
                    {
                      q: "Kenapa kadang ada tool yang error?",
                      a: "neostudio mengambil data dari sumber lain. Kalau sumbernya lagi tidur atau bermasalah, kami tampilkan pesan yang jelas dan kasih saran tool pengganti kalau ada.",
                    },
                    {
                      q: "Gimana kalau nemu tool yang rusak?",
                      a: "Lapor via GitHub Issues (link di footer). Sebutkan ID tool-nya dan langkah memicu error — yang lain pasti seneng kamu bantu.",
                    },
                  ],
                },
              ]}
            />
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-head text-xl font-bold tracking-tight hover:text-cream transition-colors duration-150">
          neo<span className="text-cream">studio</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="hover:text-cream transition-colors duration-150 hidden sm:inline">Home</Link>
          <Link to="/tools" className="hover:text-cream transition-colors duration-150">Tools</Link>
          <a
            href="https://github.com/Leoo-B/neostudio"
            target="_blank"
            rel="noreferrer"
            className="text-muted-fg hover:text-cream transition-colors duration-150"
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
    <footer className="border-t border-line mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-fg">
        <p>© {new Date().getFullYear()} neostudio — dibangun dengan React + Hono.</p>
        <nav className="flex items-center gap-5">
          <Link to="/" className="hover:text-cream transition-colors duration-150">Home</Link>
          <Link to="/tools" className="hover:text-cream transition-colors duration-150">Tools</Link>
          <a href="https://github.com/Leoo-B/neostudio" target="_blank" rel="noreferrer" className="hover:text-cream transition-colors duration-150">GitHub</a>
        </nav>
      </div>
    </footer>
  )
}
