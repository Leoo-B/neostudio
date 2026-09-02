import { useParams, Link } from "@tanstack/react-router"
import { CATEGORIES, TOOLS } from "@neostudio/shared"
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline"
import { Header, Footer } from "./HomePage"

export default function CategoryPage() {
  const { id } = useParams({ strict: false }) as { id?: string }
  const cat = CATEGORIES.find((c) => c.id === id)
  const tools = cat ? TOOLS.filter((t) => t.category === cat.id) : []

  if (!cat) {
    return (
      <div className="min-h-dvh bg-bg">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="font-head text-2xl">Kategori tidak ditemukan</p>
          <Link to="/" className="nb-btn inline-block mt-6">Kembali ke Home</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-bg">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-fg hover:text-cream transition-colors duration-150 mb-6">
          ← Kembali
        </Link>
        <div className="mb-8">
          <div className="w-14 h-14 grid place-items-center border-2 border-line bg-altar mb-4">
            <WrenchScrewdriverIcon className="w-7 h-7 text-cream" />
          </div>
          <h1 className="font-head text-4xl">{cat.name}</h1>
          <p className="text-muted-fg mt-2 max-w-xl">{cat.desc}</p>
          <span className="nb-chip mt-4 font-mono">{tools.length} tools</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t) => (
            <Link key={t.id} to="/tool/$id" params={{ id: t.id }} className="nb-card block p-5 cursor-pointer">
              <h2 className="font-head text-lg">{t.name}</h2>
              <p className="text-muted-fg text-sm mt-1">{t.desc}</p>
              <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-widest text-cream">
                {t.resultKind}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}