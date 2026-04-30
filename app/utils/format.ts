// utils/format.ts — Shared formatting helpers

/** Format large numbers: 12400 → "12.4k" */
export function formatCount(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
    return String(n)
}

/** Format currency: 1200 → "$1,200" */
export function formatPrice(n: number, currency = '$'): string {
    return `${currency}${n.toLocaleString()}`
}

/** Relative time: "3h ago" */
export function timeAgo(dateStr: string): string {
    console.log('dateStr', dateStr)
    const diff = Date.now() - new Date(dateStr).getTime()
    const secs = Math.floor(diff / 1000)
    if (secs < 60) return 'just now'
    const mins = Math.floor(secs / 60)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    console.log('dateStr', dateStr)
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Truncate text to n chars */
export function truncate(str: string, n = 120): string {
    return str.length > n ? `${str.slice(0, n).trimEnd()}…` : str
}

/** Slugify a string */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

/** Format date: "June 10, 2025" */
export function fmtDate(d: string, opts?: Intl.DateTimeFormatOptions): string {
    console.log('d', d, opts)
    return new Date(d).toLocaleDateString('en-US', opts ?? {
        month: 'long', day: 'numeric', year: 'numeric',
    })
}