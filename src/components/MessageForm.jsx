import { useId, useState } from 'react'
import { CircleCheck, Send } from 'lucide-react'
import { Field } from './ui/FormControls.jsx'
import { buttonClass, cx, fieldClass } from './ui/styles.js'

const EMPTY_VALUES = { name: '', email: '', message: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values, withContactFields) {
  const errors = {}

  if (withContactFields) {
    if (!values.name.trim()) errors.name = 'Enter your name.'

    if (!values.email.trim()) {
      errors.email = 'Enter your email address.'
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      errors.email = 'Enter a valid email address, like juan@example.com.'
    }
  }

  if (!values.message.trim()) errors.message = 'Enter your message before sending.'

  return errors
}

export default function MessageForm({
  label,
  placeholder,
  submitLabel = 'Send Message',
  rows = 4,
  withContactFields = false,
}) {
  const id = useId()
  const [values, setValues] = useState(EMPTY_VALUES)
  const [errors, setErrors] = useState({})
  const [isSent, setIsSent] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values, withContactFields)
    const firstInvalid = Object.keys(nextErrors)[0]

    if (firstInvalid) {
      setErrors(nextErrors)
      event.currentTarget.elements.namedItem(firstInvalid).focus()
      return
    }

    setValues(EMPTY_VALUES)
    setErrors({})
    setIsSent(true)
  }

  function inputProps(name) {
    return {
      id: `${id}-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
    }
  }

  if (isSent) {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
        <div className="flex gap-3">
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="font-semibold text-emerald-900">Thanks for reaching out!</p>
            <p className="mt-1 text-sm text-emerald-800">
              Your message has been received.
              {withContactFields && " We'll reply to the email address you provided."}
            </p>
            <button
              type="button"
              onClick={() => setIsSent(false)}
              className="mt-3 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-secondary hover:underline"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4">
      {withContactFields && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id={`${id}-name`} label="Full name" error={errors.name}>
            <input type="text" autoComplete="name" className={fieldClass} {...inputProps('name')} />
          </Field>
          <Field id={`${id}-email`} label="Email address" error={errors.email}>
            <input type="email" autoComplete="email" inputMode="email" className={fieldClass} {...inputProps('email')} />
          </Field>
        </div>
      )}

      <Field id={`${id}-message`} label={label} error={errors.message}>
        <textarea rows={rows} placeholder={placeholder} className={cx(fieldClass, 'resize-y')} {...inputProps('message')} />
      </Field>

      <button type="submit" className={buttonClass({ className: 'w-full sm:w-auto' })}>
        <Send className="size-4" aria-hidden="true" />
        {submitLabel}
      </button>
    </form>
  )
}
