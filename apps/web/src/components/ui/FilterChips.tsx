"use client"

import { useId, useRef, useState, useCallback, useMemo, type ReactNode, type KeyboardEvent } from "react"
import { motion, useReducedMotion, AnimatePresence } from "motion/react"

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const

export type ChipFilter<T> = {
  id: string
  label: string
  match: (item: T) => boolean
}

type Props<T> = {
  items: readonly T[]
  filters: readonly ChipFilter<T>[]
  getKey: (item: T) => string
  renderItem: (item: T) => ReactNode
  label: string
  value?: string
  onValueChange?: (id: string) => void
  columns?: { base: number; sm?: number; lg?: number; xl?: number }
  rowHeight?: number
  gap?: number
  emptyLabel?: string
  className?: string
}

/** Filter Grid hasil adaptasi 21st.dev (ddoemonn/filter-grid) ke token neostudio.
 *  Sliding thumb chip + live count + reflow animasi + a11y penuh (radiogroup). */
export function FilterChips<T>({
  items,
  filters,
  getKey,
  renderItem,
  label,
  value,
  onValueChange,
  columns = { base: 1, sm: 2, lg: 3, xl: 4 },
  rowHeight = 96,
  gap = 12,
  emptyLabel = "Tidak ada yang cocok",
  className = "",
}: Props<T>) {
  const uid = useId()
  const reduced = useReducedMotion()
  const fallback = filters[0]?.id ?? ""
  const [internal, setInternal] = useState(() => value ?? fallback)

  const requested = value ?? internal
  const current = filters.find((f) => f.id === requested) ?? filters[0]
  const active = current?.id ?? fallback

  const emit = useRef(onValueChange)
  emit.current = onValueChange

  const counts = useMemo(() => {
    const next: Record<string, number> = {}
    for (const filter of filters) {
      let n = 0
      for (const item of items) if (filter.match(item)) n += 1
      next[filter.id] = n
    }
    return next
  }, [filters, items])

  const visible = useMemo(() => {
    const filter = filters.find((f) => f.id === active)
    if (!filter) return [...items]
    return items.filter((item) => filter.match(item))
  }, [filters, items, active])

  const select = useCallback(
    (id: string) => {
      if (value === undefined) setInternal(id)
      if (id !== active) emit.current?.(id)
    },
    [value, active],
  )

  const chips = useRef<(HTMLButtonElement | null)[]>([])
  const gridRef = useRef<HTMLUListElement>(null)
  const heldFocus = useRef(false)

  const index = Math.max(0, filters.findIndex((f) => f.id === active))

  const choose = useCallback(
    (id: string) => {
      const grid = gridRef.current
      heldFocus.current = !!grid && grid.contains(document.activeElement) && grid !== document.activeElement
      select(id)
    },
    [select],
  )

  const go = useCallback(
    (i: number) => {
      const next = filters[(i + filters.length) % filters.length]
      if (!next) return
      const ti = (i + filters.length) % filters.length
      chips.current[ti]?.focus()
      choose(next.id)
    },
    [filters, choose],
  )

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault()
      go(i + 1)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault()
      go(i - 1)
    } else if (e.key === "Home") {
      e.preventDefault()
      go(0)
    } else if (e.key === "End") {
      e.preventDefault()
      go(filters.length - 1)
    }
  }

  const colMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }
  const gridCls = [
    colMap[columns.base] ?? "grid-cols-1",
    columns.sm ? `sm:${colMap[columns.sm]}` : "",
    columns.lg ? `lg:${colMap[columns.lg]}` : "",
    columns.xl ? `xl:${colMap[columns.xl]}` : "",
  ].join(" ")

  return (
    <div className={`w-full ${className}`}>
      <div
        role="radiogroup"
        aria-label={label}
        aria-controls={`${uid}-grid`}
        className="flex flex-wrap items-center gap-1.5"
      >
        {filters.map((filter, i) => {
          const on = i === index
          return (
            <button
              key={filter.id}
              ref={(node) => {
                chips.current[i] = node
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => choose(filter.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className="group relative inline-grid h-8 select-none place-items-center rounded-md px-3 outline-none focus-visible:ring-1 focus-visible:ring-cream/40"
              style={{ touchAction: "manipulation" }}
            >
              {on ? (
                <motion.span
                  aria-hidden
                  layoutId={reduced ? undefined : `${uid}-thumb`}
                  transition={CELL}
                  className="absolute inset-0 rounded-md bg-cream"
                />
              ) : null}

              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 rounded-md border transition-colors duration-150 group-focus-visible:border-cream/60 ${
                  on ? "border-transparent" : "border-line group-hover:border-line-strong"
                }`}
              />
              <span className="relative col-start-1 row-start-1 inline-grid">
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: on ? 0 : 1 }}
                  transition={CELL}
                  className="col-start-1 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-fg/80"
                >
                  {filter.label}
                  <span className="text-[10.5px] tabular-nums text-muted-fg">{counts[filter.id]}</span>
                </motion.span>
                <motion.span
                  aria-hidden
                  initial={false}
                  animate={{ opacity: on ? 1 : 0 }}
                  transition={CELL}
                  className="col-start-1 row-start-1 inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-oncream"
                >
                  {filter.label}
                  <span className="text-[10.5px] tabular-nums opacity-70">{counts[filter.id]}</span>
                </motion.span>
                <span className="sr-only">
                  {filter.label}, {counts[filter.id]} dari {items.length}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <ul
        id={`${uid}-grid`}
        ref={gridRef}
        tabIndex={-1}
        className={`relative mt-4 outline-none ${gridCls}`}
        style={{ gap: `${gap}px` }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item) => (
            <motion.li
              key={getKey(item)}
              layout={reduced ? false : "position"}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={reduced ? { duration: 0 } : { layout: { type: "spring", stiffness: 260, damping: 34, mass: 0.8 }, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="list-none"
              style={{ minHeight: `${rowHeight}px` }}
            >
              {renderItem(item)}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence initial={false}>
        {visible.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            className="pointer-events-none grid place-items-center py-12"
          >
            <span className="text-sm text-muted-fg">{emptyLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <p aria-live="polite" className="sr-only">
        {current?.label}: {visible.length} dari {items.length} ditampilkan
      </p>
    </div>
  )
}
