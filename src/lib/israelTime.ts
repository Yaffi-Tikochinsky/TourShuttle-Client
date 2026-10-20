/*
  <input type="datetime-local"> speaks "2026-10-23T09:00" with no time zone, and the browser would read it in
  the computer's zone. The admin means Israel time wherever they sit, and the server wants UTC, so these two
  functions convert between the input's text and UTC explicitly, in Asia/Jerusalem (summer and winter time included).
*/

const TIME_ZONE = 'Asia/Jerusalem'

const partsFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** The wall-clock reading in Israel at an instant, as numbers. */
function israelParts(instant: Date) {
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(partsFormat.formatToParts(instant).find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') }
}

/** How many minutes Israel is ahead of UTC at that instant (120 in winter, 180 in summer). */
function israelOffsetMinutes(instant: Date): number {
  const p = israelParts(instant)
  const asIfUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute)
  return Math.round((asIfUtc - instant.getTime()) / 60_000)
}

const pad = (n: number) => String(n).padStart(2, '0')

/** "2026-10-23T06:00:00Z" -> "2026-10-23T09:00", the value for a datetime-local input. */
export function utcToIsraelInput(iso: string): string {
  const p = israelParts(new Date(iso))
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`
}

/** "2026-10-23T09:00" (Israel) -> "2026-10-23T06:00:00.000Z". Empty or malformed input gives null. */
export function israelInputToUtc(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  const [, y, mo, d, h, mi] = match.map(Number) as [number, number, number, number, number, number]
  const asIfUtc = Date.UTC(y, mo - 1, d, h, mi)
  // First guess with the offset at that moment, then correct once in case the guess crossed a clock change.
  let instant = asIfUtc - israelOffsetMinutes(new Date(asIfUtc)) * 60_000
  instant = asIfUtc - israelOffsetMinutes(new Date(instant)) * 60_000
  return new Date(instant).toISOString()
}
