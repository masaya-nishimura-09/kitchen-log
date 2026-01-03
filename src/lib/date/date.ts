export function getDateWithDayOfWeek(date: string): string {
  const [year, month, day] = date.split("-").map(Number)
  const d = new Date(year, month - 1, day)
  const dayOfWeekLong = d.toLocaleDateString("ja-JP", { weekday: "short" })

  return `${year}/${month}/${day}(${dayOfWeekLong})`
}

export function getDateStr(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function getDateOneMonthAgo(): string {
  const today = new Date()
  today.setMonth(today.getMonth() - 1)

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function formatDateToYYYYMMDD(date: Date | undefined): string {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
