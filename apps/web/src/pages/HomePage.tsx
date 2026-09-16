import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { CATEGORIES, TOOLS } from "@neostudio/shared"
import { ToolCard, CATEGORY_ICONS } from "../components/ToolCard"
import { FAQ } from "../components/FAQ"
import { Reveal } from "../components/Reveal"
import { AnimatedCounter } from "../components/AnimatedCounter"
import { Header, Footer } from "../components/Layout"

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState<string>("tools")
  const activeCat = CATEGORIES.find((c) => c.id === selectedTab) ?? CATEGORIES[0]
  const toolsInTab = TOOLS.filter((t) => t.category === selectedTab).slice(0, 3)

  return (
    <div className="min-h-dvh bg-bg">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Hero — split kiri/kanan */}
        <section className="pt-12 sm:pt-20 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-block nb-pill px-4 py-1.5 mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cream">gratis · tanpa daftar · tanpa iklan</span>
            </div>
            <h1 className="font-head text-4xl sm:text-6xl leading-[1.05] tracking-tight">
              Semua alat digital
              <br />
              dalam <span className="text-cream">satu tempat.</span>
            </h1>
            <p className="mt-5 text-muted-fg text-base sm:text-lg max-w-xl leading-relaxed">
              Unduh video, generate QR, cek berita, edit gambar, sampai primbon. {TOOLS.length}+ alat gratis, tanpa daftar, tanpa iklan pop-up.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/tools" className="nb-btn inline-flex items-center gap-2 min-h-[44px] px-6">
                Jelajahi Semua Tools <ChevronRightIcon className="w-4 h-4" aria-hidden />
              </Link>
              <Link to="/tools" search={{ cat: "games" }} className="nb-btn-alt inline-flex items-center gap-2 min-h-[44px] px-6">
                Main Game
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8">
              <div>
                <div className="font-head text-3xl sm:text-4xl leading-none text-cream">
                  <AnimatedCounter to={TOOLS.length} />
                </div>
                <div className="mt-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-fg">tools</div>
              </div>
              <div className="h-10 w-px bg-line" aria-hidden />
              <div>
                <div className="font-head text-3xl sm:text-4xl leading-none text-cream">
                  <AnimatedCounter to={CATEGORIES.length} />
                </div>
                <div className="mt-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-fg">kategori</div>
              </div>
              <div className="h-10 w-px bg-line" aria-hidden />
              <div>
                <div className="font-head text-3xl sm:text-4xl leading-none text-cream">100%</div>
                <div className="mt-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-fg">gratis</div>
              </div>
            </div>
          </div>

          {/* Bento mockup kanan — tile kategori clickable */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((c, i) => {
              const Icon = CATEGORY_ICONS[c.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon
              const count = TOOLS.filter((t) => t.category === c.id).length
              const wide = i === 0
              return (
                <Link
                  key={c.id}
                  to="/tools"
                  search={{ cat: c.id }}
                  className={`nb-card nb-lift p-4 flex flex-col items-start gap-2.5 cursor-pointer ${wide ? "sm:col-span-2" : ""}`}
                >
                  <div className="shrink-0 w-9 h-9 grid place-items-center rounded-lg border border-line bg-altar">
                    <Icon className="w-4 h-4 text-cream" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm leading-tight">{c.name}</p>
                    <p className="text-[11px] text-muted-fg mt-0.5 font-mono">{count} tools</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Bento kategori — tabs + 3 tool preview */}
        <Reveal>
          <section aria-label="Pilih kategori" className="py-10 border-t border-line">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="font-head text-2xl sm:text-3xl">Jelajahi kategori</h2>
                <p className="text-sm text-muted-fg mt-1">{activeCat.desc}</p>
              </div>
              <Link to="/tools" search={{ cat: selectedTab }} className="text-sm text-cream hover:underline inline-flex items-center gap-1">
                Lihat semua <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div role="group" aria-label="Pilih kategori" className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICONS[c.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon
                const active = selectedTab === c.id
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedTab(c.id)}
                    aria-pressed={active}
                    className={`nb-chip ${active ? "is-active" : ""}`}
                  >
                    <Icon className="w-4 h-4" aria-hidden />
                    {c.name}
                  </button>
                )
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolsInTab.map((t) => (
                <ToolCard key={t.id} tool={t} icon={CATEGORY_ICONS[activeCat.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon} cat={selectedTab} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <section aria-label="Pertanyaan umum" className="py-10 max-w-3xl mx-auto border-t border-line">
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
