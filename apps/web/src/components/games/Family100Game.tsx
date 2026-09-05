import { useCallback, useEffect, useRef, useState } from "react"
import type { ApiResponse, ToolDef } from "@neostudio/shared"
import { pickStr, resolvePayload } from "../../lib/results"
import { GameHud } from "./GameHud"
import { CheckCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline"

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
  // fallback: turun proporsional, total 100
  const total = (n * (n + 1)) / 2
  return Array.from({ length: n }, (_, i) => Math.max(1, Math.round(((n - i) / total) * 100)))
}

const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ")

function clueText(jawaban: string): string {
  const j = jawaban.trim()
  if (!j) return ""
  return `${j.length} huruf · awalan ${j[0].toUpperCase()}`
}

export function Family100Game({ tool, res }: { tool: ToolDef; res: ApiResponse; params?: Record<string, unknown> }) {
  const payload = resolvePayload(res.data, tool.resultPath) as Record<string, unknown>
  const soal = pickStr(payload, tool.questionField ?? "soal") ?? ""
  const jawaban = (pickArrStr(payload, tool.answersField ?? "jawaban") ?? []).filter(Boolean)
  const poin = poinPerSlot(jawaban.length)

  const [skor, setSkor] = useState(0)
  const [input, setInput] = useState<string[]>(() => jawaban.map(() => ""))
  const [benarIdx, setBenarIdx] = useState<number[]>([])
  const [mainLagi, setMainLagi] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const cek = (i: number) => {
    if (benarIdx.includes(i)) return
    const val = input[i]?.trim() ?? ""
    if (!val) return
    if (norm(val) === norm(jawaban[i])) {
      setSkor((s) => s + poin[i])
      setBenarIdx((b) => [...b, i])
      const semua = [...benarIdx, i]
      if (semua.length === jawaban.length) {
        window.setTimeout(() => setMainLagi(true), 600)
      }
    } else {
      inputRefs.current[i]?.classList.add("t-shake")
      window.setTimeout(() => inputRefs.current[i]?.classList.remove("t-shake"), 400)
    }
  }

  const ulang = useCallback(() => {
    setSkor(0)
    setInput(jawaban.map(() => ""))
    setBenarIdx([])
    setMainLagi(false)
  }, [jawaban])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  if (mainLagi) {
    return (
      <div className="nb-card p-8 text-center flex flex-col items-center gap-4" aria-live="polite">
        <CheckCircleIcon className="w-12 h-12 text-cream" aria-hidden />
        <p className="font-head text-2xl">Semua jawaban ditemukan!</p>
        <p className="text-muted-fg">Skor</p>
        <p className="font-head text-5xl text-cream tabular-nums">{skor}</p>
        <button onClick={ulang} className="nb-btn mt-2 inline-flex items-center gap-2 min-h-[44px]">
          <ArrowPathIcon className="w-4 h-4" aria-hidden /> Main Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="nb-card p-5 sm:p-6">
      <GameHud skor={skor} label="poin" />
      <h3 className="font-head text-xl sm:text-2xl mb-5 text-center">{soal}</h3>
      <ul className="space-y-3">
        {jawaban.map((j, i) => {
          const benar = benarIdx.includes(i)
          return (
            <li key={i} className="flex items-center gap-3">
              <span className="w-14 shrink-0 text-right font-head text-sm text-muted-fg tabular-nums">{poin[i]}</span>
              <input
                ref={(el) => (inputRefs.current[i] = el)}
                className={`nb-input flex-1 min-h-[44px] ${benar ? "border-cream bg-cream/5 text-cream" : ""}`}
                placeholder={clueText(j)}
                value={input[i] ?? ""}
                onChange={(e) => {
                  const v = [...input]
                  v[i] = e.target.value
                  setInput(v)
                }}
                onKeyDown={(e) => e.key === "Enter" && cek(i)}
                disabled={benar}
                aria-label={`Jawaban ${i + 1}, poin ${poin[i]}. Clue: ${clueText(j)}`}
                autoComplete="off"
              />
              {benar && <CheckCircleIcon className="w-6 h-6 text-cream shrink-0" aria-hidden />}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function pickArrStr(obj: unknown, path: string): string[] | null {
  if (!obj || typeof obj !== "object") return null
  const v = (obj as Record<string, unknown>)[path]
  if (Array.isArray(v)) return v.map(String)
  return null
}
