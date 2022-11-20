export function isUrl(value?: string): boolean {
    if (!value) return false
    try {
        new URL(value)
        return true
    } catch {
        return false
    }
}
