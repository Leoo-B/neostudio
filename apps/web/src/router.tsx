import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router"
import HomePage from "./pages/HomePage"
import ToolPage from "./pages/ToolPage"
import ToolsPage from "./pages/ToolsPage"

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  errorComponent: ({ error }) => (
    <div className="min-h-dvh flex items-center justify-center p-6 text-sm">
      <div className="nb-card p-6 max-w-md w-full">
        <p className="font-head text-lg mb-2">Ups — ada yang salah</p>
        <p className="text-muted-fg text-sm break-all">{String(error)}</p>
      </div>
    </div>
  ),
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
})

export const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tools",
  validateSearch: (search: Record<string, unknown>): { cat?: string } => ({
    cat: typeof search.cat === "string" ? search.cat : undefined,
  }),
  component: ToolsPage,
})

export const toolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tool/$id",
  component: ToolPage,
})

export const routeTree = rootRoute.addChildren([indexRoute, toolsRoute, toolRoute])
