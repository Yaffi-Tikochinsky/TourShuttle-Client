import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cx } from '@/lib/cx'
import { Spinner } from '../Spinner/Spinner'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface StyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Icon before the text (on the right, in RTL). */
  icon?: ReactNode
  fullWidth?: boolean
}

function buttonClass({ variant = 'primary', size = 'md', fullWidth }: StyleProps, className?: string) {
  return cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)
}

// React 19: `ref` is an ordinary prop (ComponentPropsWithRef), so no forwardRef wrapper is needed.
type ButtonProps = ComponentPropsWithRef<'button'> &
  StyleProps & {
    /** Shows a spinner and blocks clicks, for example while a form is being sent. */
    isLoading?: boolean
  }

export function Button({
  variant,
  size,
  icon,
  fullWidth,
  isLoading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, fullWidth }, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? <Spinner size="sm" label="" /> : icon}
      {children && <span>{children}</span>}
    </button>
  )
}

/** A react-router link that looks like a button: same variants, same sizes. */
export function ButtonLink({ variant, size, icon, fullWidth, className, children, ...rest }: LinkProps & StyleProps) {
  return (
    <Link className={buttonClass({ variant, size, fullWidth }, className)} {...rest}>
      {icon}
      {children && <span>{children}</span>}
    </Link>
  )
}
