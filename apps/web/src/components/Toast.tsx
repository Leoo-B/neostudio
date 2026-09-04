import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"

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
          <div
            key={t.id}
            className="t-toast is-open nb-card pointer-events-auto bg-bg border border-line px-5 py-3 flex items-center gap-2 text-sm font-medium"
          >
            <CheckCircleIcon className="w-5 h-5 text-cream shrink-0" />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
