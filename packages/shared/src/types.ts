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

/** cara render hasil yang ramah pengguna; fallback = json */
export type ToolRenderKind =
  | "image"
  | "mediaList"
  | "resultList"
  | "articleList"
  | "profileCard"
  | "quoteCard"
  | "keyValue"
  | "codeBlock"
  | "downloadCard"
  | "imagePair"
  | "prayerTimes"
  | "quiz"

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
  /** bagaimana hasil harus ditampilkan di UI (default: fallback = codeBlock) */
  renderKind?: ToolRenderKind
  /** cara mengambil data dari respons API (nested path) */
  resultPath?: string
  /** nama field untuk judul / nama / link utama (fallback) */
  titleField?: string
  imageField?: string
  descriptionField?: string
  linkField?: string
  metaFields?: string[]
  /** downloader: primary download field (URL final) */
  downloadField?: string
  /** downloader: daftar field URL untuk tombol graded (audio/hd/sd/dll) */
  downloadFields?: string[]
  /** downloader: field thumbnail */
  thumbnailField?: string
  /** imagePair: dua gambar bersebelahan (mis. ppcouple cowo/cewe) */
  leftField?: string
  rightField?: string
  /** prayerTimes: object berisi jam-jam sholat */
  jadwalField?: string
  /** quiz: soal + jawaban yang bisa dibuka */
  questionField?: string
  answerField?: string
  /** tool alternatif saat upstream gagal (mis. all-dl) */
  fallbackToolId?: string
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
