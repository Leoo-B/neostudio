import { z } from "zod"

export const toolRunSchema = z.object({
  toolId: z.string().min(1),
  params: z.record(z.union([z.string(), z.number(), z.boolean()])).default({}),
})

export type ToolRunInput = z.infer<typeof toolRunSchema>

export const apiResponseSchema = z.object({
  ok: z.boolean(),
  status: z.number(),
  kind: z.enum(["image", "text", "json", "file"]),
  /** untuk kind=json/text */
  data: z.unknown().optional(),
  /** untuk kind=image — url hasil di server kami */
  imageUrl: z.string().optional(),
  /** untuk kind=file */
  fileUrl: z.string().optional(),
  error: z.string().optional(),
})

export type ApiResponse = z.infer<typeof apiResponseSchema>
