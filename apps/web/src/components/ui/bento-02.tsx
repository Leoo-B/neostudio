import { ArrowRightIcon, BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { Link } from "@tanstack/react-router"

export default function Bento02() {
  return (
    <section className="py-16 sm:py-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Wide top tile */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-card p-8 sm:col-span-2 nb-lift">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(245,222,179,0.10), transparent)",
            }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-fg">
                gratis · tanpa daftar
              </span>
              <h2 className="mt-4 font-head text-2xl sm:text-3xl tracking-tight">
                Semua alat dalam satu situs — bukan 20 tab di browser kamu.
              </h2>
              <p className="mt-3 text-sm text-muted-fg leading-relaxed">
                Unduh video, bikin QR, cek berita, sampai primbon. Tiap tool dibuat
                ringan, jalan di HP, dan gak butuh akun apa pun.
              </p>
            </div>
            <Link
              to="/tools"
              className="nb-btn inline-flex w-fit shrink-0 items-center gap-2 min-h-[44px]"
            >
              Jelajahi Semua Tools <ArrowRightIcon className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Bottom-left tile */}
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-muted/40 p-7 nb-lift">
          <div className="grid w-10 h-10 place-items-center rounded-xl border border-line bg-bg">
            <BoltIcon className="w-5 h-5 text-cream" strokeWidth={1.5} aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Cepat &amp; ringan</h3>
            <p className="mt-1.5 text-sm text-muted-fg leading-relaxed">
              Tiap halaman load-nya kecil. Hasil keluar dalam hitungan detik di
              koneksi biasa — termasuk pakai data seluler.
            </p>
          </div>
        </div>

        {/* Bottom-right tile */}
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-muted/40 p-7 nb-lift">
          <div className="grid w-10 h-10 place-items-center rounded-xl border border-line bg-bg">
            <ShieldCheckIcon className="w-5 h-5 text-cream" strokeWidth={1.5} aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Privasi dulu</h3>
            <p className="mt-1.5 text-sm text-muted-fg leading-relaxed">
              Gak ada akun, gak ada pelacakan antar tool. Yang kamu proses cuma
              dipakai sebentar untuk nge-fetch hasil, lalu dibuang.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
