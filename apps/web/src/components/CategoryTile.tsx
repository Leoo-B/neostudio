import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { TOOLS, type CategoryDef } from "@neostudio/shared"
import { CATEGORY_ICONS } from "./ToolCard"

type Props = {
  c: CategoryDef
  open: boolean
  onToggle: (id: string | null) => void
}

export function CategoryTile({ c, open, onToggle }: Props) {
  const Icon = CATEGORY_ICONS[c.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon
  const tools = TOOLS.filter((t) => t.category === c.id).slice(0, 3)
  const count = TOOLS.filter((t) => t.category === c.id).length
  const ref = useRef<HTMLDivElement>(null)
  // pinned: user sudah klik → overlay stay open biar link bisa diklik
  const [pinned, setPinned] = useState(false)

  // reset pinned kalau overlay ditutup dari luar (escape/outside-click/hover)
  useEffect(() => {
    if (!open) setPinned(false)
  }, [open])

  // Escape → tutup
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggle(null)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onToggle])

  // tap luar → tutup (touch device: click di luar tile)
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle(null)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open, onToggle])

  const isTouch = typeof window !== "undefined" && window.matchMedia?.("(hover: none)").matches

  return (
    <div
      ref={ref}
      className={`nb-card nb-lift relative p-4 flex flex-col items-start gap-2.5 cursor-pointer ${open ? "z-30" : ""}`}
      onPointerEnter={(e) => {
        // touch device: skip hover-open, biar click-toggle yang kerja
        if (e.pointerType === "touch" || isTouch || pinned) return
        onToggle(c.id)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch" || isTouch || pinned) return
        onToggle(null)
      }}
      onClick={() => {
        // klik pertama: pin (overlay stay, link bisa diklik). klik lagi: tutup.
        if (open && pinned) {
          onToggle(null)
        } else if (!open) {
          onToggle(c.id)
          setPinned(true)
        } else {
          setPinned(true)
        }
      }}
      onBlur={(e) => {
        // focus pindah ke luar tile → tutup; kalau pindah ke Link di dalam overlay, tetap open
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onToggle(null)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle(open ? null : c.id)
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={open}
    >
      <div className="shrink-0 w-9 h-9 grid place-items-center rounded-lg border border-line bg-altar">
        <Icon className="w-4 h-4 text-cream" aria-hidden />
      </div>
      <div className="min-w-0 w-full">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-sm leading-tight">{c.name}</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-fg shrink-0">
            {count}
            <ChevronDownIcon
              className={`w-3 h-3 t-accordion-icon ${open ? "rotate-180" : ""}`}
              aria-hidden
            />
          </span>
        </div>
        <p className="text-[11px] text-muted-fg mt-0.5 font-mono">{count} tools</p>
      </div>

      {/* overlay preview — selalu mounted, animate opacity/scale; zero layout shift; z-30 di root saat open */}
      <div
        className={`absolute left-0 right-0 top-full z-30 mt-1 nb-card nb-overlay-anim bg-card shadow-lift p-2 rounded-lg origin-top ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2.5 pointer-events-none"
        }`}
        aria-hidden={!open}
        onClick={(e) => e.stopPropagation()}
        onPointerEnter={(e) => e.stopPropagation()}
        onPointerLeave={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] font-mono uppercase tracking-widest text-cream px-2 py-1">
          {c.tagline}
        </p>
        {tools.map((t) => (
          <Link
            key={t.id}
            to="/tool/$id"
            params={{ id: t.id }}
            search={{ cat: c.id }}
            tabIndex={open ? undefined : -1}
            className="block px-2 py-1.5 text-xs text-fg/80 hover:text-cream hover:bg-altar rounded truncate transition-colors duration-100"
          >
            {t.name}
          </Link>
        ))}
        <Link
          to="/tools"
          search={{ cat: c.id }}
          tabIndex={open ? undefined : -1}
          className="block px-2 py-1.5 text-[11px] text-muted-fg hover:text-cream transition-colors duration-100"
        >
          Lihat semua {count} tools →
        </Link>
      </div>
    </div>
  )
}
