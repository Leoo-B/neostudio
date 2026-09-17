import { useEffect, useState } from "react"

type WhereAmI = {
  ok: boolean
  ip: string | null
  city: string | null
  region: string | null
  country: string | null
  timezone: string | null
}

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ?? ""

/** offset menit → label zona waktu Indonesia */
function zonaLabel(offsetMin: number | null): string | null {
  if (offsetMin === null) return null
  if (offsetMin === 420) return "WIB"
  if (offsetMin === 480) return "WITA"
  if (offsetMin === 540) return "WIT"
  return null
}

function Separator() {
  return <span className="text-line" aria-hidden>·</span>
}

export function DeviceStrip() {
  const [info, setInfo] = useState<WhereAmI | null>(null)
  const [now, setNow] = useState<Date | null>(null)
  const [baterai, setBaterai] = useState<string>("—")

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
    let battery: BatteryLike | null = null
    nav
      .getBattery()
      .then((b) => {
        battery = b
        const update = () => setBaterai(`${Math.round((b.level ?? 0) * 100)}%${b.charging ? "+" : ""}`)
        update()
        b.addEventListener?.("levelchange", update)
        b.addEventListener?.("chargingchange", update)
      })
      .catch(() => {})
    return () => {
      if (battery?.addEventListener) {
        // listener cleanup tidak critical — API deprecated, biarkan
      }
    }
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

  return (
    <div className="border-b border-line bg-altar/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-9 flex items-center gap-4 text-[11px] font-mono text-muted-fg overflow-hidden whitespace-nowrap">
        {lokasi ? (
          <span className="text-fg/80">{lokasi}</span>
        ) : (
          <span className="animate-pulse">mendeteksi lokasi…</span>
        )}
        {zona ? (
          <>
            <Separator />
            <span className="text-cream">{zona}</span>
          </>
        ) : null}
        {jam ? (
          <>
            <Separator />
            <span className="tabular-nums text-fg/80">{jam}</span>
          </>
        ) : null}
        {info?.ip ? (
          <>
            <Separator />
            <span className="hidden sm:inline">IP: {info.ip}</span>
          </>
        ) : null}
        <Separator />
        <span className="hidden sm:inline">baterai: {baterai}</span>
      </div>
    </div>
  )
}
