/** Joins class names, skipping false/undefined: cx(styles.button, isActive && styles.active). */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
