import type { IconName } from '@/components/IconButton.vue'

declare global {
    interface Window {
        initVue: Function
    }
}

export interface ActionBtn {
    name: string
    iconName: IconName
    className?: string
    onClick(): void
}

export interface ModalDetail {
    inputValue?: string
    onInputChange?(_e: Event): void
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
    type: 'modal' | 'popup'
    onClose(): void // action will fire after close()
}

export interface MemAttributeRequest {
    [key: string]: any
}

export interface MemAttributeResponse {
    memAttributeTypes: {
        [key: string]: any
        MemAttributeOption: Record<string, any>[]
    }[]
    tnc: {
        TmsExtraType: any
    }[]
}

export interface ErrorResponse {
    error: string
}

export type APIResponse<T> = T & ErrorResponse

export interface Option<T> {
    label: string
    value: T
}

export interface ExtraTypes<T> {
    type: string
    id: string | number
    options: Option<T>[]
}

export interface OptionVal {
    type: string
    value: string
}

export interface ExtraTypePropsData {
    langKey: string
    outletId: string
    baseUrl: string
    id: string
    seq: string
    type: string
    show: boolean
    required: boolean
    validations: []
    name_l1: string
    name_l2: string
    name_l3: string
    name_l4: string
    name_l5: string
    childType: string
    params: {
        mem_attribute_types: OptionVal
        terms_n_services_enable: OptionVal
        terms_n_services_options: OptionVal
    }
}

export interface PhpProps<T = any> {
    data: any | T
    translation: Record<string, string>
    view: string
    selector: string
}
