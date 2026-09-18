import { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"

type QA = { q: string; a: string }
type Group = { title: string; items: QA[] }

export function FAQ({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {groups.map((g, gi) => (
        <div key={g.title}>
          <h3 className="font-head text-lg text-cream mb-3">{g.title}</h3>
          <div className="space-y-3">
            {g.items.map((it, ii) => {
              const panelId = `faq-panel-${gi}-${ii}`
              const triggerId = `faq-trigger-${gi}-${ii}`
              const isOpen = open === panelId
              return (
                <div key={panelId} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : panelId)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    id={triggerId}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer bg-transparent border-none"
                  >
                    <span className="font-medium text-sm sm:text-base">{it.q}</span>
                    <IconChevronDown className="t-accordion-icon w-5 h-5 shrink-0 text-muted-fg" />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={`t-accordion-body ${isOpen ? "is-open" : ""}`}
                  >
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
