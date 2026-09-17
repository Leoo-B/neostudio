import { Link } from "@tanstack/react-router"
import { ChevronRightIcon, BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { CATEGORIES, TOOLS } from "@neostudio/shared"
import { CategoryTile } from "../components/CategoryTile"
import { FAQ } from "../components/FAQ"
import { Reveal } from "../components/Reveal"
import { AnimatedCounter } from "../components/AnimatedCounter"
import { Header, Footer } from "../components/Layout"
import { SectionHeader } from "../components/SectionHeader"
import { DeviceStrip } from "../components/DeviceStrip"

export default function HomePage() {
  const [openCat, setOpenCat] = useState<string | null>(null)

  return (
    <div className="min-h-dvh bg-bg">
      <Header />
      <DeviceStrip />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Hero — split kiri/kanan */}
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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

          {/* Bento kanan — anchor + 8 kategori + 2 feature = 12 sel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Anchor tile (wide) */}
            <Link
              to="/tools"
              className="nb-card nb-lift relative overflow-hidden p-5 flex flex-col items-start gap-2 cursor-pointer col-span-2"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(245,222,179,0.10), transparent)",
                }}
              />
              <div className="relative">
                <span className="font-mono text-[11px] uppercase tracking-widest text-cream">
                  Mulai cepat
                </span>
                <p className="font-head text-lg sm:text-xl tracking-tight mt-1.5">
                  Coba sekarang
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-muted-fg mt-2 group-hover:text-cream">
                  Lihat semua tools
                  <ChevronRightIcon className="w-3.5 h-3.5" aria-hidden />
                </span>
              </div>
            </Link>

            {/* 8 kategori tile — hover/tap expand (state di parent: cuma 1 open) */}
            {CATEGORIES.map((c) => (
              <CategoryTile key={c.id} c={c} open={openCat === c.id} onToggle={setOpenCat} />
            ))}

            {/* 2 feature tile (non-clickable, tanpa lift) */}
            {[
              { icon: BoltIcon, title: "Cepat & ringan", desc: "Load kecil, hasil keluar hitungan detik." },
              { icon: ShieldCheckIcon, title: "Privasi dulu", desc: "Gak ada akun, gak ada pelacakan antar tool." },
            ].map((f) => (
              <div key={f.title} className="nb-card p-4 flex flex-col items-start gap-2.5">
                <div className="shrink-0 w-9 h-9 grid place-items-center rounded-lg border border-line bg-altar">
                  <f.icon className="w-4 h-4 text-cream" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm leading-tight">{f.title}</p>
                  <p className="text-[11px] text-muted-fg mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <Reveal>
          <section aria-label="Pertanyaan umum" className="py-16 sm:py-24 max-w-3xl mx-auto">
            <SectionHeader
              align="center"
              eyebrow="FAQ"
              title="Pertanyaan Umum"
              desc="Jawaban singkat buat hal yang paling sering ditanya."
            />
            <div className="mt-8">
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
            </div>
          </section>
        </Reveal>
      </main>
      <Footer />
    </div>
  )
}
