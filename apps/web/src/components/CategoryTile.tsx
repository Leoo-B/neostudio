import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { TOOLS, type CategoryDef } from "@neostudio/shared"
import { CATEGORY_ICONS } from "./ToolCard"

export function CategoryTile({ c }: { c: CategoryDef }) {
  const [open, setOpen] = useState(false)
  const Icon = CATEGORY_ICONS[c.icon] ?? CATEGORY_ICONS.WrenchScrewdriverIcon
  const tools = TOOLS.filter((t) => t.category === c.id).slice(0, 3)
  const count = TOOLS.filter((t) => t.category === c.id).length

  return (
    <div
      className="nb-card nb-lift relative p-4 flex flex-col items-start gap-2.5 cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setOpen((v) => !v)
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

      {/* overlay preview — absolute, zero layout shift */}
      {open ? (
        <div
          className="absolute left-0 right-0 top-full z-20 mt-1 nb-card bg-card shadow-lift p-2 rounded-lg"
          onClick={(e) => e.stopPropagation()}
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
              className="block px-2 py-1.5 text-xs text-fg/80 hover:text-cream hover:bg-altar rounded truncate transition-colors duration-100"
            >
              {t.name}
            </Link>
          ))}
          <Link
            to="/tools"
            search={{ cat: c.id }}
            className="block px-2 py-1.5 text-[11px] text-muted-fg hover:text-cream transition-colors duration-100"
          >
            Lihat semua {count} tools →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
