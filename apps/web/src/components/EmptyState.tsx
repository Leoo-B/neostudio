import { motion, useReducedMotion } from "motion/react"
import { IconZoomQuestion, IconBug } from "@tabler/icons-react"

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
      {/* lup + lalat muter */}
      <div className="relative h-28 mx-auto w-fit">
        <motion.div
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={reduced ? undefined : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 inline-block"
        >
          <IconZoomQuestion stroke={1.25} className="w-16 h-16 text-cream" aria-hidden />
        </motion.div>
        {/* lalat: orbit ellipse via offset-path */}
        <span className={`absolute inset-0 grid place-items-center ${reduced ? "nb-orbit-paused" : "nb-orbit"}`}>
          <IconBug
            stroke={1.5}
            className="w-5 h-5 text-muted-fg"
            style={{ rotate: "45deg" }}
            aria-hidden
          />
        </span>
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
