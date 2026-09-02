import { type ReactNode } from "react"

export function SkeletonReveal({ loading, children, skeleton }: { loading: boolean; children: ReactNode; skeleton?: ReactNode }) {
  return (
    <div className={`t-skel ${loading ? "is-pulsing" : "is-revealed"}`}>
      <div className="t-skel-content">{children}</div>
      <div className="t-skel-skeleton">
        {skeleton ?? <div className="nb-skeleton h-40 w-full" />}
      </div>
    </div>
  )
}
