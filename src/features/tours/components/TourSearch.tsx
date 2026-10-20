import { useActionState } from 'react'
import { useNavigate } from 'react-router'
import { Landmark, MapPin, Search } from 'lucide-react'
import { Button, Select } from '@/components/ui'
import { cx } from '@/lib/cx'
import { useCities, useDestinations } from '../hooks/useTourData'
import styles from './TourSearch.module.css'

interface TourSearchProps {
  /** Pre-selected values, for example from the URL on the tours page. */
  defaultCity?: string
  defaultDestinationId?: number
  /** "hero" is the large search on the home page; "bar" sits above the tours list. */
  variant?: 'hero' | 'bar'
  className?: string
}

/**
 * "Where are you leaving from? Where to?" Sends the choice to /tours as URL parameters,
 * so the results page can be bookmarked and shared, and Back returns to the previous search.
 */
export function TourSearch({ defaultCity = '', defaultDestinationId, variant = 'hero', className }: TourSearchProps) {
  const navigate = useNavigate()
  const cities = useCities()
  const destinations = useDestinations()

  // A form action again: no state per select, React reads the values when the form is sent.
  const [, search, isPending] = useActionState<null, FormData>(async (_previous, form) => {
    const params = new URLSearchParams()
    const city = String(form.get('city') ?? '')
    const destinationId = String(form.get('destinationId') ?? '')
    if (city) params.set('city', city)
    if (destinationId) params.set('destinationId', destinationId)
    navigate(`/tours${params.size ? `?${params}` : ''}`, { viewTransition: true })
    return null
  }, null)

  return (
    <form action={search} className={cx(styles.search, styles[variant], className)} role="search">
      <Select
        label="מאיפה יוצאים?"
        hideLabel={variant === 'bar'}
        name="city"
        icon={<MapPin />}
        defaultValue={defaultCity}
        // A new key remounts the select once the options arrive, so the default value can select one of them.
        key={`city-${cities.status}-${defaultCity}`}
        disabled={cities.status === 'loading'}
      >
        <option value="">כל הערים</option>
        {cities.status === 'success' &&
          cities.data.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
      </Select>

      <Select
        label="לאן?"
        hideLabel={variant === 'bar'}
        name="destinationId"
        icon={<Landmark />}
        defaultValue={defaultDestinationId ?? ''}
        key={`destination-${destinations.isSuccess}-${defaultDestinationId ?? ''}`}
        disabled={destinations.isPending}
      >
        <option value="">כל האתרים</option>
        {destinations.data?.map((destination) => (
          <option key={destination.id} value={destination.id}>
            {destination.name}
          </option>
        ))}
      </Select>

      <Button type="submit" size={variant === 'hero' ? 'lg' : 'md'} icon={<Search />} isLoading={isPending} className={styles.submit}>
        {variant === 'hero' ? 'חיפוש הסעה' : 'חיפוש'}
      </Button>
    </form>
  )
}
