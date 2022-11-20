const URL_REGEX =
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/

export function isUrl(value?: string): boolean {
    if (!value) return false
    try {
        new URL(value)
        return true
    } catch {
        return false
    }
}

export function getUrl(value?: string): string | undefined {
    const url = value?.match(URL_REGEX)?.[0]
    return url
}
