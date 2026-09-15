import { ChevronDown, CircleAlert } from 'lucide-react'
import { cx, fieldClass, labelClass } from './styles.js'

export function FieldError({ id, children }) {
  if (!children) return null

  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}

export function Field({ id, label, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  )
}

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select className={cx(fieldClass, 'cursor-pointer appearance-none pr-11', className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-slate-500"
      />
    </div>
  )
}
