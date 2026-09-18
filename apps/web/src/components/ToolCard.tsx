import { Link } from "@tanstack/react-router"
import { IconTool, IconPhoto, IconDownload, IconNews, IconPuzzle, IconSparkles, IconSearch, IconEye } from "@tabler/icons-react"
import type { ToolDef } from "@neostudio/shared"

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  IconTool,
  IconPhoto,
  IconDownload,
  IconNews,
  IconPuzzle,
  IconSparkles,
  IconSearch,
  IconEye,
}

export function ToolCard({ tool, icon, cat }: { tool: ToolDef; icon?: React.ComponentType<{ className?: string }>; cat?: string }) {
  const Icon = icon ?? IconTool
  return (
    <Link
      to="/tool/$id"
      params={{ id: tool.id }}
      search={cat ? { cat } : undefined}
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
