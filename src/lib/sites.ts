/** The drawings available for a site. A destination the admin adds later gets "default" until it has its own. */
export type SiteKind = 'wall' | 'cityOfDavid' | 'safed' | 'tower' | 'default'

const byName: Array<[RegExp, SiteKind]> = [
  [/כותל/, 'wall'],
  [/עיר דוד/, 'cityOfDavid'],
  [/צפת/, 'safed'],
  [/מגדל דוד/, 'tower'],
]

/** Picks a drawing from the destination's name and city, for example "הכותל המערבי" -> wall. */
export function siteKindFor(name: string, city?: string): SiteKind {
  const text = `${name} ${city ?? ''}`
  return byName.find(([pattern]) => pattern.test(text))?.[1] ?? 'default'
}
