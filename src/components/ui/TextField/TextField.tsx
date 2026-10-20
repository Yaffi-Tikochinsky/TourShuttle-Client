import { useId, useState, type ComponentPropsWithRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './TextField.module.css'

type TextFieldProps = ComponentPropsWithRef<'input'> & {
  label: string
  /** Shown under the field in red, and announced to screen readers. */
  error?: string
  /** Shown under the field when there is no error. */
  hint?: string
}

/**
 * Label + input + message, wired for accessibility: useId gives every instance unique ids, so the label
 * points at its input and the input points at its message (aria-describedby), even with many forms on a page.
 */
export function TextField({ label, error, hint, id, className, ...inputProps }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {inputProps.required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      <input
        id={inputId}
        className={cx(styles.input, error && styles.invalid)}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...inputProps}
      />
      {message && (
        <p id={messageId} className={cx(styles.message, error && styles.errorMessage)}>
          {message}
        </p>
      )}
    </div>
  )
}

/** A password field with a show/hide button: its own small piece of state (useState). */
export function PasswordField(props: Omit<TextFieldProps, 'type'>) {
  const [visible, setVisible] = useState(false)
  return (
    <div className={styles.passwordWrapper}>
      <TextField {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        className={styles.reveal}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'הסתרת הסיסמה' : 'הצגת הסיסמה'}
        aria-pressed={visible}
      >
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </button>
    </div>
  )
}
