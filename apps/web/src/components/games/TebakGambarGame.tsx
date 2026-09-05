import { useCallback, useEffect, useRef, useState } from "react"
import type { ApiResponse, ToolDef } from "@neostudio/shared"
import { runTool } from "../../lib/run"
import { pickStr, resolvePayload, toUrl } from "../../lib/results"
import { GameHud, useCountdown } from "./GameHud"
import { useGameConfetti } from "./useGameConfetti"
import { TrophyIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"

const GAME_SECONDS = 90
const POIN_BENAR = 5

const norm = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")

export function TebakGambarGame({ tool, res, params }: { tool: ToolDef; res: ApiResponse; params?: Record<string, unknown> }) {
  const payload = resolvePayload(res.data, tool.resultPath) as Record<string, unknown>
  const [skor, setSkor] = useState(0)
  const [soal, setSoal] = useState<Record<string, unknown> | null>(payload ?? null)
  const [tebakan, setTebakan] = useState("")
  const [feedback, setFeedback] = useState<null | { benar: boolean; text: string }>(null)
  const [selesai, setSelesai] = useState(false)
  const [mengambil, setMengambil] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const confetti = useGameConfetti()
  const { detik, reset } = useCountdown(!selesai, () => setSelesai(true))

  useEffect(() => {
    reset(GAME_SECONDS)
  }, [])

  const jawaban = pickStr(soal, tool.answerField ?? "jawaban") ?? ""
  const img = toUrl(pickStr(soal, tool.imageField ?? "img"))
  const deskripsi = pickStr(soal, tool.descriptionField ?? "deskripsi")

  const ambilSoal = useCallback(async () => {
    setMengambil(true)
    setFeedback(null)
    try {
      const r = await runTool(tool.id, params ?? {})
      setSoal(resolvePayload(r.data, tool.resultPath) as Record<string, unknown>)
    } catch {
      setFeedback({ benar: false, text: "Gagal ambil soal baru — coba klik Lewati." })
    } finally {
      setMengambil(false)
    }
  }, [tool.id, tool.resultPath, params])

  const nextSoal = useCallback(() => {
    setTebakan("")
    setFeedback(null)
    void ambilSoal()
  }, [ambilSoal])

  const cek = () => {
    if (!tebakan.trim() || !jawaban || feedback?.benar) return
    if (norm(tebakan) === norm(jawaban)) {
      const poin = POIN_BENAR
      setSkor((s) => s + poin)
      setFeedback({ benar: true, text: `Benar! +${poin} poin` })
      confetti()
      window.setTimeout(() => nextSoal(), 2000)
    } else {
      setFeedback({ benar: false, text: "Belum tepat, coba lagi!" })
      inputRef.current?.select()
    }
  }

  const mainLagi = () => {
    setSkor(0)
    setSelesai(false)
    setTebakan("")
    setFeedback(null)
    reset(GAME_SECONDS)
    void ambilSoal()
  }

  if (selesai) {
    return (
      <div className="nb-card p-8 text-center flex flex-col items-center gap-4" aria-live="polite">
        <TrophyIcon className="w-12 h-12 text-cream" aria-hidden />
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
      <GameHud skor={skor} detik={detik} maxDetik={GAME_SECONDS} label="poin" />
      <div className="border border-line rounded-xl overflow-hidden bg-black aspect-video grid place-items-center mb-4" aria-label="Gambar tebakan">
        {img ? (
          <img src={img} alt="Gambar clue — tebak jawabannya" className="w-full h-full object-contain" />
        ) : (
          <div className="nb-skeleton w-full h-full" />
        )}
      </div>
      {deskripsi && <p className="text-sm text-muted-fg text-center mb-4">Clue: {deskripsi}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          cek()
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          ref={inputRef}
          className="nb-input flex-1 min-h-[44px]"
          placeholder="Tulis tebakanmu…"
          value={tebakan}
          onChange={(e) => setTebakan(e.target.value)}
          disabled={feedback?.benar || mengambil}
          aria-label="Tebakan"
          autoComplete="off"
        />
        <button type="submit" className="nb-btn min-h-[44px] disabled:opacity-50" disabled={feedback?.benar || mengambil || !tebakan.trim()}>
          Tebak!
        </button>
        <button type="button" className="nb-btn min-h-[44px] inline-flex items-center gap-2" onClick={nextSoal} disabled={mengambil}>
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
