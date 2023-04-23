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

export interface MemAttributeRequest {
  [key:string]: any
}

export interface MemAttributeResponse {
  memAttributeTypes: {
    [key:string]: any
    MemAttributeOption: Record<string, any>[]
  }[]
  tnc: {
    TmsExtraType: any
  }[]
}

export interface Option<T> {
  label: string
  value: T
}

export interface ExtraTypes<T> {
  type: string
  id: string | number
  options: Option<T>[]
}