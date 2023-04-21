export interface FileObj {
  url?: string
  file: File
}

export interface Folder {
  [key: string]: FileObj[]
}

export interface ActionBtn {
  name: string
  iconName: string
  className?: string
  onClick(): void
}

export interface ModalDetail {
  inputValue?: string
  onInputChange?(e: Event): void
  header?: string
  headerClass?: string
  content: any
  contentClass?: string
  footer?: string
  footerClass?: string
  actionBtns?: ActionBtn[]
}

export interface ModalObject {
  detail: ModalDetail
  component: any
  type: "modal" | "popup"
  onClose(): void // action will fire after close()
}

export type SortType = "lastModified" | "name" | "size"
export type OrderType = "desc" | "asc"
