import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import type { ApiResponse, ToolDef } from "@neostudio/shared"
import { runTool } from "../../lib/run"
import { pickStr, resolvePayload } from "../../lib/results"
import { GameHud } from "./GameHud"
import { useGameConfetti } from "./useGameConfetti"
import { IconCircleCheck, IconReload, IconCircleX } from "@tabler/icons-react"

/** Poin per slot (atas paling besar), total = 100. Fallback proporsional kalau N>8. */
function poinPerSlot(n: number): number[] {
  const tabel: Record<number, number[]> = {
    2: [60, 40],
    3: [50, 30, 20],
    4: [40, 30, 20, 10],
    5: [35, 25, 20, 12, 8],
    6: [30, 25, 18, 12, 8, 7],
    7: [25, 20, 15, 12, 10, 8, 10],
    8: [22, 18, 14, 12, 10, 8, 8, 8],
  }
  if (tabel[n]) return tabel[n]
  const total = (n * (n + 1)) / 2
  return Array.from({ length: n }, (_, i) => Math.max(1, Math.round(((n - i) / total) * 100)))
}

const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ")

type Found = { jawaban: string; poin: number }

export function Family100Game({ tool, res, params }: { tool: ToolDef; res: ApiResponse; params?: Record<string, unknown> }) {
  const initial = resolvePayload(res.data, tool.resultPath) as Record<string, unknown>
  const [soal, setSoal] = useState(() => pickStr(initial, tool.questionField ?? "soal") ?? "")
  const [jawaban, setJawaban] = useState<string[]>(() =>
    (pickArrStr(initial, tool.answersField ?? "jawaban") ?? []).filter(Boolean)
  )
  const poin = poinPerSlot(jawaban.length)
  const [input, setInput] = useState("")
  const [found, setFound] = useState<Found[]>([])
  const [skor, setSkor] = useState(0)
  const [checking, setChecking] = useState(false)
  const [mengambil, setMengambil] = useState(false)
  const [feedback, setFeedback] = useState<null | { ok: boolean; text: string }>(null)
  const [shake, setShake] = useState(false)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const confetti = useGameConfetti()
  const usedNorm = new Set(found.map((f) => norm(f.jawaban)))
  const sisa = jawaban.length - found.length

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const ambilSoal = useCallback(async () => {
    setMengambil(true)
    setFound([])
    setSkor(0)
    setInput("")
    setFeedback(null)
    setDone(false)
    try {
      const r = await runTool(tool.id, params ?? {})
      const p = resolvePayload(r.data, tool.resultPath) as Record<string, unknown>
      setSoal(pickStr(p, tool.questionField ?? "soal") ?? "")
      setJawaban((pickArrStr(p, tool.answersField ?? "jawaban") ?? []).filter(Boolean))
    } catch {
      setFeedback({ ok: false, text: "Gagal ambil soal — klik Main Lagi." })
    } finally {
      setMengambil(false)
    }
  }, [tool.id, tool.resultPath, params])

  const mainLagi = () => void ambilSoal()

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    const val = input.trim()
    if (!val || checking || done || mengambil) return
    setChecking(true)
    setFeedback(null)
    setInput("")
    // tunggu ~600ms buat efek "menegangkan"
    window.setTimeout(() => {
      const n = norm(val)
      // cari jawaban yg cocok
      const idx = jawaban.findIndex((j) => norm(j) === n)
      if (idx === -1 || usedNorm.has(n)) {
        setFeedback({ ok: false, text: "Tidak ada di daftar jawaban" })
        setShake(true)
        window.setTimeout(() => setShake(false), 400)
        setChecking(false)
        inputRef.current?.focus()
        return
      }
      const p = poin[idx]
      const newFound: Found = { jawaban: jawaban[idx], poin: p }
      const newList = [...found, newFound]
      setFound(newList)
      setSkor((s) => s + p)
      setFeedback({ ok: true, text: `+${p} poin` })
      confetti()
      setChecking(false)
      if (newList.length === jawaban.length) {
        window.setTimeout(() => setDone(true), 800)
      } else {
        inputRef.current?.focus()
      }
    }, 600)
  }

  if (done) {
    return (
      <div className="nb-card p-8 text-center flex flex-col items-center gap-4" aria-live="polite">
        <IconCircleCheck className="w-12 h-12 text-cream" aria-hidden />
        <p className="font-head text-2xl">Semua jawaban ditemukan!</p>
        <p className="text-muted-fg">Skor</p>
        <p className="font-head text-5xl text-cream tabular-nums">{skor}</p>
        <button onClick={mainLagi} className="nb-btn mt-2 inline-flex items-center gap-2 min-h-[44px]" disabled={mengambil}>
          <IconReload className="w-4 h-4" aria-hidden /> Main Lagi
        </button>
      </div>
    )
  }

  if (!jawaban.length && !mengambil && !done) {
    return (
      <div className="nb-card p-8 text-center flex flex-col items-center gap-4" aria-live="polite">
        <p className="font-head text-xl">Gagal mengambil soal</p>
        <button onClick={mainLagi} className="nb-btn mt-2 inline-flex items-center gap-2 min-h-[44px]" disabled={mengambil}>
          <IconReload className="w-4 h-4" aria-hidden /> Main Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="nb-card p-5 sm:p-6">
      <GameHud skor={skor} label="poin" />
      <h3 className="font-head text-xl sm:text-2xl mb-1 text-center">{soal}</h3>
      <p className="text-center text-xs uppercase tracking-widest text-muted-fg mb-5">
        {sisa} jawaban tersisa · total 100 poin
      </p>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          ref={inputRef}
          className={`nb-input flex-1 min-h-[44px] ${shake ? "t-shake" : ""}`}
          placeholder={checking ? "Mengecek…" : "Ketik jawaban…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={checking || mengambil}
          aria-label="Jawaban"
          autoComplete="off"
        />
        <button type="submit" className="nb-btn min-h-[44px] disabled:opacity-50 inline-flex items-center justify-center gap-2" disabled={!input.trim() || checking || mengambil}>
          {checking && <span className="inline-block w-4 h-4 border-2 border-line border-t-cream rounded-full animate-spin" aria-hidden />}
          {checking ? "Cek…" : "Submit"}
        </button>
      </form>

      <div className="min-h-[28px] mb-4" aria-live="polite">
        {feedback && (
          <p className={`flex items-center gap-1.5 text-sm font-medium ${feedback.ok ? "text-cream" : "text-danger"}`}>
            {feedback.ok ? <IconCircleCheck className="w-4 h-4" aria-hidden /> : <IconCircleX className="w-4 h-4" aria-hidden />}
            {feedback.text}
          </p>
        )}
      </div>

      {found.length > 0 && (
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-fg mb-2">Jawaban ditemukan</p>
          <ul className="space-y-2">
            {found.map((f, i) => (
              <li key={i} className="flex items-center gap-3 nb-card px-4 py-2 t-fade-slide">
                <span className="w-14 shrink-0 text-right font-head text-sm text-cream tabular-nums">{f.poin} poin</span>
                <span className="flex-1 font-medium break-words">{f.jawaban}</span>
                <IconCircleCheck className="w-5 h-5 text-cream shrink-0" aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function pickArrStr(obj: unknown, path: string): string[] | null {
  if (!obj || typeof obj !== "object") return null
  const v = (obj as Record<string, unknown>)[path]
  if (Array.isArray(v)) return v.map(String)
  return null
}
