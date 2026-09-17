import { useEffect, useState } from "react"
import {
  IconMapPin,
  IconClock,
  IconTimezone,
  IconGlobe,
  IconBattery1,
  IconBattery3,
  IconBattery4,
  IconBatteryCharging2,
  IconBatteryExclamation,
} from "@tabler/icons-react"

type WhereAmI = {
  ok: boolean
  ip: string | null
  city: string | null
  region: string | null
  country: string | null
  timezone: string | null
}

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ?? ""
const STROKE = 1.25

/** offset menit → label zona waktu Indonesia */
function zonaLabel(offsetMin: number | null): string | null {
  if (offsetMin === null) return null
  if (offsetMin === 420) return "WIB"
  if (offsetMin === 480) return "WITA"
  if (offsetMin === 540) return "WIT"
  return null
}

type BatteryState = {
  /** ikon sesuai level/charging */
  Icon: (typeof IconBattery4) & { displayName?: string }
  label: string
  tone: string
  charging: boolean
}

/** state-aware battery: ikon + warna dinamis */
function batteryState(level: number | null, charging: boolean | undefined): BatteryState | null {
  if (level === null) return null
  const pct = Math.round(level * 100)
  if (charging) {
    return { Icon: IconBatteryCharging2, label: `${pct}%+`, tone: "text-cream", charging: true }
  }
  if (pct < 20) {
    return { Icon: IconBattery1, label: `${pct}%`, tone: "text-red-400", charging: false }
  }
  if (pct < 50) {
    return { Icon: IconBattery3, label: `${pct}%`, tone: "text-cream", charging: false }
  }
  return { Icon: IconBattery4, label: `${pct}%`, tone: "text-muted-fg", charging: false }
}

function Skeleton() {
  return <span className="nb-skeleton inline-block w-24 h-3 rounded-sm" aria-hidden />
}

export function DeviceStrip() {
  const [info, setInfo] = useState<WhereAmI | null>(null)
  const [now, setNow] = useState<Date | null>(null)
  const [bat, setBat] = useState<{ level: number | null; charging?: boolean } | null>(null)

  // fetch lokasi sekali per session
  useEffect(() => {
    let cancelled = false
    if (!API_BASE) return
    fetch(`${API_BASE}/api/whereami`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: WhereAmI | null) => {
        if (!cancelled && d) setInfo(d)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // baterai (deprecated API — graceful fallback wajib)
  useEffect(() => {
    type BatteryLike = { level: number; charging?: boolean; addEventListener?: (t: string, l: () => void) => void }
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryLike> }
    if (!nav.getBattery) return
    nav
      .getBattery()
      .then((b) => {
        const update = () => setBat({ level: b.level, charging: b.charging })
        update()
        b.addEventListener?.("levelchange", update)
        b.addEventListener?.("chargingchange", update)
      })
      .catch(() => {})
  }, [])

  // jam per detik sesuai timezone IP
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const tz = info?.timezone ?? undefined
  const jam =
    now && tz
      ? new Intl.DateTimeFormat("id-ID", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
      : null

  // hitung offset zona dari tz (untuk label WIB/WITA/WIT)
  let offsetMin: number | null = null
  if (tz && now) {
    const dtf = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" })
    const parts = dtf.formatToParts(now)
    const off = parts.find((p) => p.type === "timeZoneName")?.value ?? ""
    const m = off.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
    if (m) {
      const sign = m[1] === "-" ? -1 : 1
      offsetMin = sign * (Number(m[2]) * 60 + Number(m[3] ?? 0))
    }
  }
  const zona = zonaLabel(offsetMin)

  const lokasi = [info?.city, info?.country].filter(Boolean).join(", ") || null
  const batState = batteryState(bat?.level ?? null, bat?.charging)

  const ready = lokasi !== null

  return (
    <div className="border-b border-line bg-altar/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-0 sm:h-9 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-0 text-[11px] font-mono">
        {/* baris 1 (mobile) / kiri (desktop): lokasi · zona · jam */}
        <div className="flex items-center gap-2 sm:gap-3">
          {ready ? (
            <span className="inline-flex items-center gap-1.5 text-fg/80">
              <IconMapPin stroke={STROKE} className="w-3.5 h-3.5 text-muted-fg shrink-0" aria-hidden />
              {lokasi}
            </span>
          ) : (
            <Skeleton />
          )}
          {zona ? (
            <span className="inline-flex sm:pl-3 sm:border-l sm:border-line items-center gap-1.5 text-cream">
              <IconTimezone stroke={STROKE} className="w-3.5 h-3.5 shrink-0" aria-hidden />
              {zona}
            </span>
          ) : null}
          {jam ? (
            <span className="inline-flex items-center gap-1.5 sm:pl-3 sm:border-l sm:border-line tabular-nums text-fg/80">
              <IconClock stroke={STROKE} className="w-3.5 h-3.5 text-muted-fg shrink-0" aria-hidden />
              {jam}
            </span>
          ) : null}
        </div>

        {/* baris 2 (mobile) / kanan (desktop): IP · baterai */}
        <div className="flex items-center gap-2 sm:gap-3 sm:ml-auto">
          {info?.ip ? (
            <span className="inline-flex items-center gap-1.5 text-fg/80">
              <IconGlobe stroke={STROKE} className="w-3.5 h-3.5 text-muted-fg shrink-0" aria-hidden />
              {info.ip}
            </span>
          ) : null}
          {batState ? (
            <span className={`inline-flex items-center gap-1.5 sm:pl-3 sm:border-l sm:border-line ${batState.tone}`}>
              {batState.charging ? (
                <IconBatteryCharging2 stroke={STROKE} className="w-4 h-4 shrink-0" aria-hidden />
              ) : (
                <batState.Icon stroke={STROKE} className="w-4 h-4 shrink-0" aria-hidden />
              )}
              {batState.label}
            </span>
          ) : bat ? (
            // level null (battery API tanpa value)
            <span className="inline-flex items-center gap-1.5 text-muted-fg sm:pl-3 sm:border-l sm:border-line">
              <IconBatteryExclamation stroke={STROKE} className="w-4 h-4 shrink-0" aria-hidden />
              —
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
