import { useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

type QA = { q: string; a: string }
type Group = { title: string; items: QA[] }

export function FAQ({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <div key={g.title}>
          <h3 className="font-head text-lg text-cream mb-3">{g.title}</h3>
          <div className="space-y-3">
            {g.items.map((it) => {
              const key = `${g.title}:${it.q}`
              const isOpen = open === key
              return (
                <div key={key} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer bg-transparent border-none"
                  >
                    <span className="font-medium text-sm sm:text-base">{it.q}</span>
                    <ChevronDownIcon className="t-accordion-icon w-5 h-5 shrink-0 text-muted-fg" />
                  </button>
                  <div className={`t-accordion-body ${isOpen ? "is-open" : ""}`}>
                    <div className="t-accordion-inner">
                      <p className="px-5 pb-5 text-sm text-muted-fg leading-relaxed">{it.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
