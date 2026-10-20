import type { UserRole } from '@/api/types'

/** Hebrew names of the server's roles. Kept outside component files so those files export only components. */
export const roleLabels: Record<UserRole, string> = {
  Admin: 'מנהל',
  Customer: 'לקוח',
  Driver: 'נהג',
}
