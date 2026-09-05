import { useCallback } from "react"
import { getGsap } from "../../lib/gsap"

const COLORS = ["#F5DEB3", "#E8C97D", "#FFF8E7", "#D4A94E", "#B8860B"]

/** Confetti ringan: ~28 partikel DOM, auto-hancur. Hormati reduced-motion. */
export function useGameConfetti() {
  return useCallback((origin?: { x: number; y: number }) => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const gsap = getGsap()
    const cx = origin?.x ?? window.innerWidth / 2
    const cy = origin?.y ?? window.innerHeight / 3

    for (let i = 0; i < 28; i++) {
      const el = document.createElement("div")
      const size = 6 + Math.random() * 8
      el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${size}px;height:${size * (Math.random() > 0.5 ? 1 : 0.5)}px;background:${COLORS[i % COLORS.length]};border-radius:${Math.random() > 0.5 ? "2px" : "50%"};pointer-events:none;z-index:9999;`
      document.body.appendChild(el)

      const angle = Math.random() * Math.PI * 2
      const dist = 80 + Math.random() * 160
      gsap.to(el, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 60,
        rotation: gsap.utils.random(-360, 360),
        opacity: 0,
        duration: 1 + Math.random() * 0.8,
        ease: "power2.out",
        onComplete: () => el.remove(),
      })
    }
  }, [])
}