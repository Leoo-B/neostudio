import { useCallback, useEffect, useState } from "react"
import { IconFlameFilled, IconClockFilled } from "@tabler/icons-react"

export function GameHud({ skor, detik, maxDetik, label }: { skor: number; detik?: number; maxDetik?: number; label?: string }) {
  const maut = detik !== undefined && maxDetik !== undefined && detik <= 10
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="inline-flex items-center gap-2 nb-card px-4 py-2">
        <IconFlameFilled className="w-5 h-5 text-cream" aria-hidden />
        <span className="font-head text-xl text-cream tabular-nums" aria-label={`Skor ${skor}`}>{skor}</span>
        {label && <span className="text-[11px] uppercase tracking-widest text-muted-fg ml-1">{label}</span>}
      </div>
      {detik !== undefined && (
        <div
          className={`inline-flex items-center gap-2 nb-card px-4 py-2 ${maut ? "border-danger" : ""}`}
          role="timer"
          aria-label={`Sisa waktu ${detik} detik`}
        >
          <IconClockFilled className={`w-5 h-5 ${maut ? "text-danger" : "text-muted-fg"}`} aria-hidden />
          <span className={`font-head text-xl tabular-nums ${maut ? "text-danger" : ""}`}>{detik}</span>
        </div>
      )}
    </div>
  )
}

/** timer countdown sederhana; panggil reset(n) buat mulai ulang */
export function useCountdown(running: boolean, onEnd?: () => void, initialSeconds = 0) {
  const [detik, setDetik] = useState(initialSeconds)
  const [max, setMax] = useState(initialSeconds)
  useEffect(() => {
    if (!running || detik <= 0) return
    const t = setInterval(() => setDetik((d) => Math.max(0, d - 1)), 1000)
    return () => clearInterval(t)
  }, [running, detik])
  useEffect(() => {
    if (running && detik === 0 && max > 0) onEnd?.()
  }, [detik, running])
  const reset = useCallback((n: number) => {
    setMax(n)
    setDetik(n)
  }, [])
  const kurangi = useCallback((n: number) => setDetik((d) => Math.max(0, d - n)), [])
  return { detik, max, reset, kurangi }
}
