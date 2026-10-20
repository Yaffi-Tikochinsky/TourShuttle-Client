/*
  Display formatting. The API speaks UTC; people in Israel read Israel time.
  This is the only place dates are converted (the "UTC everywhere, convert on display" rule of the project).
*/

const TIME_ZONE = 'Asia/Jerusalem'

const dayFormat = new Intl.DateTimeFormat('he-IL', { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'numeric' })
const shortDayFormat = new Intl.DateTimeFormat('he-IL', { timeZone: TIME_ZONE, weekday: 'short', day: 'numeric', month: 'numeric' })
const timeFormat = new Intl.DateTimeFormat('he-IL', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: false })
const dateKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
const money = new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 2, minimumFractionDigits: 0 })

/** "יום שלישי, 21.10" */
export function formatDay(iso: string): string {
  return dayFormat.format(new Date(iso))
}

/** "יום ג׳, 21.10" */
export function formatShortDay(iso: string): string {
  return shortDayFormat.format(new Date(iso))
}

/** "09:00" in Israel time. */
export function formatTime(iso: string): string {
  return timeFormat.format(new Date(iso))
}

/** "45 ₪" */
export function formatPrice(amount: number): string {
  return money.format(amount)
}

/** A seat count in natural Hebrew: "מקום אחד", "2 מקומות". */
export function formatSeats(count: number): string {
  if (count === 0) return 'אין מקומות'
  if (count === 1) return 'מקום אחד'
  return `${count} מקומות`
}

/** The calendar day in Israel ("2026-10-21"), for comparing days regardless of the hour. */
export function israelDateKey(date: Date): string {
  return dateKeyFormat.format(date)
}

/**
 * How far away a departure is, in words: "בעוד 40 דקות", "היום ב-15:00", "מחר ב-09:00", "בעוד 4 ימים".
 * `now` is a parameter, so tests and the countdown component control the clock.
 */
export function formatRelativeDeparture(iso: string, now: Date = new Date()): string {
  const departure = new Date(iso)
  const minutes = Math.round((departure.getTime() - now.getTime()) / 60_000)

  if (minutes < 0) return 'יצאה לדרך'
  if (minutes < 60) return minutes <= 1 ? 'יוצאת עכשיו' : `בעוד ${minutes} דקות`

  const today = israelDateKey(now)
  const tomorrow = israelDateKey(new Date(now.getTime() + 86_400_000))
  const day = israelDateKey(departure)

  if (day === today) return `היום ב-${formatTime(iso)}`
  if (day === tomorrow) return `מחר ב-${formatTime(iso)}`

  const days = Math.round((Date.parse(day) - Date.parse(today)) / 86_400_000)
  return `בעוד ${days} ימים`
}

/** "בני ברק · רמת גן · פתח תקווה" */
export function formatCities(cities: string[]): string {
  return cities.join(' · ')
}
