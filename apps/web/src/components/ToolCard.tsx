import { Link } from "@tanstack/react-router"
import { WrenchScrewdriverIcon, PhotoIcon, ArrowDownTrayIcon, NewspaperIcon, PuzzlePieceIcon, SparklesIcon, MagnifyingGlassIcon, EyeIcon } from "@heroicons/react/24/outline"
import type { ToolDef } from "@neostudio/shared"

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WrenchScrewdriverIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  NewspaperIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  EyeIcon,
}

export function ToolCard({ tool, icon }: { tool: ToolDef; icon?: React.ComponentType<{ className?: string }> }) {
  const Icon = icon ?? WrenchScrewdriverIcon
  return (
    <Link
      to="/tool/$id"
      params={{ id: tool.id }}
      className="nb-card nb-lift p-4 flex items-start gap-3 cursor-pointer"
    >
      <div className="shrink-0 w-10 h-10 grid place-items-center rounded-xl border border-line bg-altar">
        <Icon className="w-5 h-5 text-cream" />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-sm leading-tight">{tool.name}</p>
        <p className="text-xs text-muted-fg mt-1 line-clamp-2">{tool.desc}</p>
      </div>
    </Link>
  )
}
