import type { ApiResponse } from "@neostudio/shared"

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ?? ""

export async function runTool(toolId: string, params: Record<string, unknown>): Promise<ApiResponse> {
  const res = await fetch(`${API_BASE}/api/run/${toolId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolId, params }),
  })
  const json = (await res.json()) as ApiResponse
  if (!json.ok) throw new Error(json.error ?? `Gagal (${json.status})`)
  return json
}