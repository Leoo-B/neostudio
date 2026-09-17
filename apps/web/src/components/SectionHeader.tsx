export function SectionHeader({
  eyebrow,
  title,
  desc,
  align = "left",
}: {
  eyebrow: string
  title: string
  desc?: string
  align?: "left" | "center"
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="font-mono text-[11px] uppercase tracking-widest text-cream">
        {eyebrow}
      </span>
      <h2 className="font-head text-2xl sm:text-3xl tracking-tight mt-2">{title}</h2>
      {desc ? <p className="text-sm text-muted-fg mt-2 leading-relaxed">{desc}</p> : null}
    </div>
  )
}
