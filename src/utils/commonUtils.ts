export const apiGet = async <R>(
    url: string,
    params: Record<string, any>,
): Promise<R> => {
    let paramStr = new URLSearchParams(params).toString()
    paramStr = paramStr ? '?' + paramStr : paramStr
    const res = await fetch(url + paramStr)
    const jsonData = await res.json()
    return jsonData as R
}