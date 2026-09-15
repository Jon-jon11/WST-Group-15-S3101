export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60'

const buttonVariants = {
  primary: 'bg-secondary text-white shadow-sm hover:bg-secondary-dark',
  outline: 'border border-slate-300 bg-white text-primary hover:border-slate-400 hover:bg-slate-50',
  ghost: 'text-secondary hover:bg-secondary-soft',
  light: 'bg-white text-primary shadow-sm hover:bg-slate-100 focus-visible:outline-white',
}

const buttonSizes = {
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-12 px-6 text-base',
}

export function buttonClass({ variant = 'primary', size = 'md', className } = {}) {
  return cx(buttonBase, buttonVariants[variant], buttonSizes[size], className)
}

export const cardClass = 'rounded-2xl border border-slate-200 bg-white shadow-sm'

export const labelClass = 'mb-1.5 block text-sm font-semibold text-primary'

export const fieldClass =
  'block min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base text-ink shadow-xs transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-secondary focus:outline-none focus:ring-3 focus:ring-secondary/20 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus:ring-red-600/20'
