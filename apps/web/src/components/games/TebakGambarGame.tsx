import { useCallback, useEffect, useRef, useState } from "react"
import type { ApiResponse, ToolDef } from "@neostudio/shared"
import { runTool } from "../../lib/run"
import { pickStr, resolvePayload, toUrl } from "../../lib/results"
import { GameHud, useCountdown } from "./GameHud"
import { useGameConfetti } from "./useGameConfetti"
import { IconTrophy, IconReload, IconCircleCheck, IconCircleX } from "@tabler/icons-react"

const GAME_SECONDS = 90
const POIN_BENAR = 5

const norm = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")

type Soal = { index: number; jawaban: string; img?: string; deskripsi?: string }

export function TebakGambarGame({ tool, res, params }: { tool: ToolDef; res: ApiResponse; params?: Record<string, unknown> }) {
  const toSoal = (data: unknown): Soal => {
    const p = (resolvePayload(data, tool.resultPath) ?? {}) as Record<string, unknown>
    return {
      index: Number(p["index"] ?? Math.random() * 1e9),
      jawaban: pickStr(p, tool.answerField ?? "jawaban") ?? "",
      img: toUrl(pickStr(p, tool.imageField ?? "img")),
      deskripsi: pickStr(p, tool.descriptionField ?? "deskripsi"),
    }
  }

  const [skor, setSkor] = useState(0)
  const [soal, setSoal] = useState<Soal>(() => toSoal(res.data))
  const [tebakan, setTebakan] = useState("")
  const [diJawab, setDiJawab] = useState(false)
  const [feedback, setFeedback] = useState<null | { benar: boolean; text: string }>(null)
  const [selesai, setSelesai] = useState(false)
  const [mengambil, setMengambil] = useState(false)
  const [gagal, setGagal] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const confetti = useGameConfetti()
  const { detik, reset } = useCountdown(!selesai, () => setSelesai(true))

  useEffect(() => {
    reset(GAME_SECONDS)
  }, [reset])

  const ambilSoal = useCallback(async () => {
    setMengambil(true)
    setGagal(false)
    try {
      const r = await runTool(tool.id, params ?? {})
      setSoal(toSoal(r.data))
      setDiJawab(false)
      setTebakan("")
      setFeedback(null)
    } catch {
      setGagal(true)
      setFeedback({ benar: false, text: "Gagal ambil soal baru — klik Lewati lagi." })
    } finally {
      setMengambil(false)
    }
  }, [tool.id, tool.resultPath, params])

  const cek = () => {
    if (!tebakan.trim() || !soal.jawaban || diJawab) return
    if (norm(tebakan) === norm(soal.jawaban)) {
      setSkor((s) => s + POIN_BENAR)
      setDiJawab(true)
      setFeedback({ benar: true, text: `Benar! +${POIN_BENAR} poin` })
      confetti()
      window.setTimeout(() => void ambilSoal(), 2000)
    } else {
      setFeedback({ benar: false, text: "Belum tepat, coba lagi!" })
      inputRef.current?.select()
    }
  }

  const mainLagi = () => {
    setSkor(0)
    setSelesai(false)
    setDiJawab(false)
    setTebakan("")
    setFeedback(null)
    setGagal(false)
    reset(GAME_SECONDS)
    void ambilSoal()
  }

  if (selesai) {
    return (
      <div className="nb-card p-8 text-center flex flex-col items-center gap-4" aria-live="polite">
        <IconTrophy className="w-12 h-12 text-cream" aria-hidden />
        <p className="font-head text-2xl">Waktu habis!</p>
        <p className="text-muted-fg">Skor akhir kamu</p>
        <p className="font-head text-5xl text-cream tabular-nums">{skor}</p>
        <button onClick={mainLagi} className="nb-btn mt-2 inline-flex items-center gap-2 min-h-[44px]">
          <IconReload className="w-4 h-4" aria-hidden /> Main Lagi
        </button>
      </div>
    )
  }

  const inputMati = diJawab || mengambil || selesai

  return (
    <div className="nb-card p-5 sm:p-6">
      <GameHud skor={skor} detik={detik} maxDetik={GAME_SECONDS} label="poin" />
      <div className="border border-line rounded-xl overflow-hidden bg-black grid place-items-center mb-4" aria-label="Gambar tebakan">
        <div className="relative w-full">
          {mengambil ? (
            <div className="aspect-video grid place-items-center">
              <span className="inline-block w-8 h-8 border-2 border-line border-t-cream rounded-full animate-spin" aria-label="Memuat soal baru" />
            </div>
          ) : soal.img ? (
            <img
              src={soal.img}
              alt="Gambar clue — tebak jawabannya"
              className="w-full h-auto max-h-[60vh] object-contain"
            />
          ) : (
            <div className="nb-skeleton aspect-video w-full" />
          )}
        </div>
      </div>
      {soal.deskripsi && !mengambil && (
        <p className="text-sm text-muted-fg text-center mb-4">Clue: {soal.deskripsi}</p>
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
          className="nb-input flex-1 min-h-[44px]"
          placeholder={diJawab ? "Tepat! Soal berikutnya…" : "Tulis tebakanmu…"}
          value={tebakan}
          onChange={(e) => setTebakan(e.target.value)}
          disabled={inputMati}
          aria-label="Tebakan"
          autoComplete="off"
        />
        <button type="submit" className="nb-btn min-h-[44px] disabled:opacity-50" disabled={inputMati || !tebakan.trim()}>
          Tebak!
        </button>
        <button
          type="button"
          className="nb-btn min-h-[44px] inline-flex items-center justify-center gap-2 disabled:opacity-40"
          onClick={() => void ambilSoal()}
          disabled={mengambil}
        >
          {mengambil ? (
            <span className="inline-block w-4 h-4 border-2 border-line border-t-cream rounded-full animate-spin" aria-hidden />
          ) : (
            <IconReload className="w-4 h-4" aria-hidden />
          )}
          {mengambil ? "Memuat…" : "Lewati"}
        </button>
      </form>
      <div className="min-h-[28px] mt-3" aria-live="polite">
        {feedback && (
          <p className={`flex items-center gap-1.5 text-sm font-medium ${feedback.benar ? "text-cream" : "text-danger"}`}>
            {feedback.benar ? <IconCircleCheck className="w-4 h-4" aria-hidden /> : <IconCircleX className="w-4 h-4" aria-hidden />}
            {feedback.text}
            {gagal && <span className="text-muted-fg text-xs">(soal tidak berubah)</span>}
          </p>
        )}
      </div>
    </div>
  )
}
