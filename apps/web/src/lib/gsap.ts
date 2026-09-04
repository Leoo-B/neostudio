// Registrasi plugin GSAP yang dipakai di seluruh app.
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let registered = false
export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
  return gsap
}
