import { useCallback, useRef, useState } from "react"
import type { ApiResponse, ToolDef } from "@neostudio/shared"
import { runTool } from "../../lib/run"
import { pickStr, resolvePayload } from "../../lib/results"
import { GameHud, useCountdown } from "./GameHud"
import { useGameConfetti } from "./useGameConfetti"
import { LightBulbIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"

const POIN_BENAR = 10
const BIAYA_CLUE = 5
const PENALTI_LEWATI = 3

/** buka digit pertama jawaban, sisanya underscore. "-482" -> "-4__" */
function bukaDigitPertama(ans: string): string {
  const neg = ans.startsWith("-")
  const digits = neg ? ans.slice(1) : ans
  if (!digits) return ans
  return (neg ? "-" : "") + digits[0] + "_".repeat(Math.max(0, digits.length - 1))
}

export function MathQuizGame({ tool, res, params }: { tool: ToolDef; res: ApiResponse; params?: Record<string, unknown> }) {
  const payload = resolvePayload(res.data, tool.resultPath) as Record<string, unknown>
  const [soal, setSoal] = useState<Record<string, unknown>>(payload ?? {})
  const [skor, setSkor] = useState(0)
  const [tebakan, setTebakan] = useState("")
  const [clue, setClue] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<null | { benar: boolean; text: string }>(null)
  const [selesai, setSelesai] = useState(false)
  const [mengambil, setMengambil] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const confetti = useGameConfetti()

  const question = pickStr(soal, tool.questionField ?? "question") ?? ""
  const answer = pickStr(soal, tool.answerField ?? "answer") ?? ""
  const timeMs = Number(pickStr(soal, "time") ?? 0)
  const detikAwal = timeMs > 0 ? Math.round(timeMs / 1000) : 20

  const { detik, reset } = useCountdown(!selesai && !!question, () => setSelesai(true), detikAwal)

  const ambilSoal = useCallback(async (penalti = 0) => {
    setMengambil(true)
    setFeedback(null)
    setClue(null)
    setTebakan("")
    try {
      const r = await runTool(tool.id, params ?? {})
      const p = resolvePayload(r.data, tool.resultPath) as Record<string, unknown>
      setSoal(p)
      const t = Number(pickStr(p, "time") ?? 0)
      const baru = Math.max(1, (t > 0 ? Math.round(t / 1000) : detikAwal) - penalti)
      reset(baru)
      if (penalti > 0) setFeedback({ benar: true, text: `Lewati: waktu −${penalti} detik` })
    } catch {
      setFeedback({ benar: false, text: "Gagal ambil soal — klik Lewati." })
    } finally {
      setMengambil(false)
    }
  }, [tool.id, tool.resultPath, params, detikAwal, reset])

  const nextSoal = () => {
    // penalti lewati: waktu soal berikutnya −3 detik (reset di ambilSoal)
    void ambilSoal(PENALTI_LEWATI)
  }

  const cek = () => {
    if (!tebakan.trim() || !answer || feedback?.benar) return
    if (tebakan.trim() === answer.trim()) {
      setSkor((s) => s + POIN_BENAR)
      setFeedback({ benar: true, text: `Benar! +${POIN_BENAR} poin` })
      confetti()
      window.setTimeout(() => nextSoal(), 1200)
    } else {
      setFeedback({ benar: false, text: "Salah, coba lagi!" })
      inputRef.current?.select()
    }
  }

  const pakaiClue = () => {
    if (skor < BIAYA_CLUE || clue) return
    setSkor((s) => s - BIAYA_CLUE)
    setClue(bukaDigitPertama(answer))
  }

  const mainLagi = () => {
    setSkor(0)
    setSelesai(false)
    setClue(null)
    setFeedback(null)
    void ambilSoal()
  }

  if (selesai) {
    return (
      <div className="nb-card p-8 text-center flex flex-col items-center gap-4" aria-live="polite">
        <p className="font-head text-2xl">Waktu habis!</p>
        <p className="text-muted-fg">Skor akhir kamu</p>
        <p className="font-head text-5xl text-cream tabular-nums">{skor}</p>
        <button onClick={mainLagi} className="nb-btn mt-2 inline-flex items-center gap-2 min-h-[44px]">
          <ArrowPathIcon className="w-4 h-4" aria-hidden /> Main Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="nb-card p-5 sm:p-6">
      <GameHud skor={skor} detik={detik} maxDetik={detikAwal} label="poin" />
      <div className="border border-line rounded-xl bg-muted py-10 px-4 mb-4 text-center" aria-label="Soal">
        <span className="font-head text-3xl sm:text-4xl font-bold tracking-tight tabular-nums">{question || "…"}</span>
      </div>
      {clue && (
        <p className="text-center text-sm text-cream mb-3" aria-live="polite">
          Clue: <span className="font-mono font-bold">{clue}</span>
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          cek()
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          className="nb-input flex-1 min-h-[44px]"
          placeholder="Jawaban…"
          value={tebakan}
          onChange={(e) => setTebakan(e.target.value)}
          disabled={feedback?.benar || mengambil}
          aria-label="Jawaban"
          autoComplete="off"
        />
        <button type="submit" className="nb-btn min-h-[44px] disabled:opacity-50" disabled={feedback?.benar || mengambil || !tebakan.trim()}>
          Jawab
        </button>
        <button
          type="button"
          onClick={pakaiClue}
          disabled={skor < BIAYA_CLUE || !!clue}
          title={skor < BIAYA_CLUE ? "Poin kurang dari 5" : undefined}
          className="nb-btn min-h-[44px] inline-flex items-center justify-center gap-2 disabled:opacity-40"
        >
          <LightBulbIcon className="w-4 h-4" aria-hidden /> Clue (−{BIAYA_CLUE} poin)
        </button>
        <button type="button" onClick={nextSoal} disabled={mengambil} className="nb-btn min-h-[44px] inline-flex items-center justify-center gap-2">
          <ArrowPathIcon className="w-4 h-4" aria-hidden /> Lewati
        </button>
      </form>
      <div className="min-h-[28px] mt-3" aria-live="polite">
        {feedback && (
          <p className={`flex items-center gap-1.5 text-sm font-medium ${feedback.benar ? "text-cream" : "text-danger"}`}>
            {feedback.benar ? <CheckCircleIcon className="w-4 h-4" aria-hidden /> : <XCircleIcon className="w-4 h-4" aria-hidden />}
            {feedback.text}
          </p>
        )}
      </div>
    </div>
  )
}
