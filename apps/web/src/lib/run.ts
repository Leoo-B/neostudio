import type { ApiResponse } from "@neostudio/shared"

export async function runTool(toolId: string, params: Record<string, unknown>): Promise<ApiResponse> {
  const res = await fetch(`/api/run/${toolId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolId, params }),
  })
  const json = (await res.json()) as ApiResponse
  if (!json.ok) throw new Error(json.error ?? `Gagal (${json.status})`)
  return json
}