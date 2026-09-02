export interface ToolField {
  name: string
  label: string
  type: "text" | "url" | "number" | "select" | "file"
  required?: boolean
  placeholder?: string
  options?: string[]
  defaultValue?: string
}

export type ToolResultKind = "image" | "text" | "json" | "file"

export interface ToolDef {
  id: string
  category: CategoryId
  name: string
  desc: string
  source: "siputzx" | "kyzznekoo" | "internal"
  path: string
  baseUrl: string
  method?: "GET" | "POST"
  fields: ToolField[]
  resultKind: ToolResultKind
  /** nama key hasil yang ingin ditampilkan (untuk image/file dari respons JSON) */
  resultKey?: string
  /** untuk image: dari mana ambil URL gambar */
  resultImageKey?: string
  /** gunakan client-side (tanpa API) */
  clientSide?: boolean
}

export type CategoryId =
  | "tools"
  | "canvas"
  | "downloader"
  | "news"
  | "games"
  | "primbon"
  | "search"
  | "stalker"

export interface CategoryDef {
  id: CategoryId
  name: string
  tagline: string
  desc: string
  icon: string
}
