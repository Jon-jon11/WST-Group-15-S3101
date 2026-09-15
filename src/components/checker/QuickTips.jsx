import { ArrowRight, Lightbulb } from 'lucide-react'

const TIPS = [
  <>
    Always bring an <strong className="font-semibold text-ink">original</strong> and{' '}
    <strong className="font-semibold text-ink">photocopy</strong> of your documents.
  </>,
  'Check the official government website for the latest fee updates.',
  'Processing times are faster during weekdays (Tuesday–Thursday).',
]

export default function QuickTips() {
  return (
    <section aria-labelledby="quick-tips-heading" className="rounded-2xl border border-secondary/15 bg-secondary-soft p-5 sm:p-8">
      <h2 id="quick-tips-heading" className="flex items-center gap-3 text-lg font-bold text-primary sm:text-xl">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs">
          <Lightbulb className="size-5 text-accent" aria-hidden="true" />
        </span>
        Quick Tips
      </h2>
      <ul className="mt-5 space-y-3">
        {TIPS.map((tip, index) => (
          <li key={index} className="flex gap-3 text-slate-700">
            <ArrowRight className="mt-1 size-4 shrink-0 text-secondary" aria-hidden="true" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
