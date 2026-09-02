import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router"
import HomePage from "./pages/HomePage"
import CategoryPage from "./pages/CategoryPage"
import ToolPage from "./pages/ToolPage"

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

export const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/c/$id",
  component: CategoryPage,
})

export const toolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tool/$id",
  component: ToolPage,
})

export const routeTree = rootRoute.addChildren([indexRoute, categoryRoute, toolRoute])
