import { motion, useReducedMotion } from "motion/react"
import { Lottie } from "lottie-react"
import { IconTrash } from "@tabler/icons-react"
import flyAnim from "../assets/fly.json"

type Props = {
  q: string
  onPick: (kw: string) => void
  onReset: () => void
}

const SUGGESTIONS = ["qr", "tiktok", "zodiak"]

export function EmptyState({ q, onPick, onReset }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30, mass: 0.7 }}
      className="nb-card p-10 text-center overflow-hidden"
    >
      {/* tempat sampah + lalat erratic */}
      <div className="relative h-32 mx-auto w-40">
        {/* sampah: float halus */}
        <motion.div
          animate={reduced ? undefined : { y: [0, -4, 0] }}
          transition={reduced ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <IconTrash stroke={1.25} className="w-16 h-16 text-muted-fg" aria-hidden />
        </motion.div>

        {/* lalat: Lottie (sayap mengepak) + orbit path irregular + jitter dart */}
        <div
          className={`absolute inset-0 grid place-items-center ${reduced ? "nb-orbit-paused" : "nb-orbit"}`}
          aria-hidden
        >
          <motion.div
            animate={
              reduced
                ? undefined
                : {
                    // jitter dart singkat — lalat gak pernah statis
                    x: [0, 3, -2, 4, -1, 2, 0],
                    y: [0, -2, 3, -1, 2, -3, 0],
                    rotate: [0, 8, -5, 10, -3, 5, 0],
                  }
            }
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
            }}
          >
            <Lottie
              src={flyAnim}
              loop
              autoplay
              style={{ width: 40, height: 40 }}
            />
          </motion.div>
        </div>
      </div>

      <p className="font-head text-lg mt-4">
        Hmm, <span className="text-cream">“{q}”</span> gak nemu
      </p>
      <p className="text-sm text-muted-fg mt-2">
        Coba kata kunci lain, atau pilih dari saran ini:
      </p>

      <div className="flex flex-wrap gap-2 justify-center mt-5">
        {SUGGESTIONS.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => onPick(kw)}
            className="nb-chip"
          >
            {kw}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-sm text-cream hover:underline mt-6 inline-block"
      >
        Reset pencarian
      </button>
    </motion.div>
  )
}
