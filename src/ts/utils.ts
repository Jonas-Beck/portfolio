// Method to return string of date
export function formatDate(date: Date): string {
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        timeZone: "UTC",
    })
}