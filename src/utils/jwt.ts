
export function decodeJwtPayload<T = unknown>(token: string): T {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g,'+').replace(/_/g, '/')
    const json = decodeURIComponent(
        atob(base64).split('')
            .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
    )
    return JSON.parse(json)
}

export function isTokenExpired(token: string): boolean {
    try {
        const { exp } = decodeJwtPayload<{ exp?: number }>(token)
        if (!exp) return false
        return Date.now() >= exp * 1000
    } catch {
        return true
    }
}