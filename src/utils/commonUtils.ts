export const apiGet = async <R>(
    url: string,
    params: Record<string, any>,
): Promise<R> => {
    const reducedParams = Object.entries(params).reduce(
        (accu, [key, value]) => {
            const add = value ? { [key]: value } : {}
            return {
                ...accu,
                ...add,
            }
        },
        {},
    )
    let paramStr = new URLSearchParams(reducedParams).toString()
    paramStr = paramStr ? '?' + paramStr : paramStr
    const res = await fetch(url + paramStr)
    const jsonData = await res.json()
    return jsonData as R
}

export const debounce = (callback: Function, wait: number) => {
    let timeoutId: any = null
    return (...args: any) => {
        window.clearTimeout(timeoutId)
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args)
        }, wait)
    }
}
