import { useEffect, useRef, type ReactNode } from "react"
import { getGsap } from "../lib/gsap"

export function Reveal({ children, delay = 0, y = 24 }: { children: ReactNode; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window === "undefined") return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const gsap = getGsap()

    if (reduce) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.set(el, { opacity: 0, y, filter: "blur(4px)" })
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.6,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [delay, y])

  return <div ref={ref}>{children}</div>
}
