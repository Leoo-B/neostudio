import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { IconCircleCheckFilled } from "@tabler/icons-react"

type Toast = { id: number; msg: string }

const Ctx = createContext<(msg: string) => void>(() => {})

export function useToast() {
  return useContext(Ctx)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const push = useCallback((msg: string) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200)
  }, [])

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} msg={t.msg} />
        ))}
      </div>
    </Ctx.Provider>
  )
}

function ToastItem({ msg }: { msg: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const r = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(r)
  }, [])
  return (
    <div
      className={`t-toast ${open ? "is-open" : ""} nb-card pointer-events-auto bg-bg border border-line px-5 py-3 flex items-center gap-2 text-sm font-medium`}
      role="status"
      aria-live="polite"
    >
      <IconCircleCheckFilled className="w-5 h-5 text-cream shrink-0" />
      <span>{msg}</span>
    </div>
  )
}
