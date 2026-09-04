import { useEffect, useRef } from "react"
import { getGsap } from "../lib/gsap"

export function AnimatedCounter({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const gsap = getGsap()

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      el.textContent = String(to)
      return
    }

    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: "power2.out",
      snap: { v: 1 },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v))
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [to, duration])

  return <span ref={ref}>0</span>
}
