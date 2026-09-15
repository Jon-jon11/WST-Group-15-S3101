import { Link } from 'react-router'
import {
  BookOpen,
  CalendarCheck,
  Check,
  ClipboardList,
  ExternalLink,
  FileSearch,
  Info,
  MapPin,
  RotateCcw,
  TriangleAlert,
  Wallet,
} from 'lucide-react'
import { buttonClass, cardClass, cx } from '../ui/styles.js'

const NOTICE_STYLES = {
  info: { icon: Info, className: 'border-secondary/20 bg-secondary-soft text-primary', iconClass: 'text-secondary' },
  warning: { icon: TriangleAlert, className: 'border-amber-300 bg-amber-50 text-amber-950', iconClass: 'text-amber-600' },
}

function Notice({ tone, message }) {
  const { icon: Icon, className, iconClass } = NOTICE_STYLES[tone]

  return (
    <div className={cx('mt-5 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed', className)}>
      <Icon className={cx('mt-0.5 size-5 shrink-0', iconClass)} aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

function DetailRow({ icon: Icon, term, children }) {
  return (
    <div className="px-4 py-3.5">
      <dt className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {term}
      </dt>
      <dd className="mt-1 pl-6 text-ink">{children}</dd>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center sm:py-14">
      <span className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
        <FileSearch className="size-7 text-secondary" aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-ink">Your checklist will appear here</p>
      <p className="mt-1 max-w-xs text-sm text-slate-600">
        Complete the form to see the required documents, estimated fees, and where to apply.
      </p>
    </div>
  )
}

function ChecklistDetails({ result, onReset }) {
  const { documentType, appointment } = result

  return (
    <>
      <ul aria-label="Your answers" className="mt-4 flex flex-wrap gap-2">
        {result.summary.map((item) => (
          <li key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            {item}
          </li>
        ))}
      </ul>

      {result.notices.map((notice) => (
        <Notice key={notice.message} {...notice} />
      ))}

      {result.eligible && (
        <>
          <section aria-labelledby="required-documents-heading" className="mt-6">
            <h3 id="required-documents-heading" className="text-lg font-semibold text-secondary">
              Required Documents
            </h3>
            <ul className="mt-3 space-y-3">
              {result.requirements.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{item.label}</p>
                    <p className="text-sm text-slate-600">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="appointment-fees-heading" className="mt-6">
            <h3 id="appointment-fees-heading" className="text-lg font-semibold text-secondary">
              Appointment &amp; Fees
            </h3>
            <dl className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200">
              <DetailRow icon={CalendarCheck} term="Appointment required?">
                <span className={cx('font-semibold', appointment.required ? 'text-emerald-700' : 'text-slate-800')}>
                  {appointment.required ? 'Yes' : 'No'}
                </span>
                <span className="block text-sm text-slate-600">{appointment.detail}</span>
              </DetailRow>
              <DetailRow icon={Wallet} term="Estimated Fees">
                {result.fees}
              </DetailRow>
              <DetailRow icon={MapPin} term="Where to apply">
                {result.location}
              </DetailRow>
            </dl>
          </section>

          {result.notes.length > 0 && (
            <section aria-labelledby="good-to-know-heading" className="mt-6">
              <h3 id="good-to-know-heading" className="text-lg font-semibold text-secondary">
                Good to Know
              </h3>
              <ul className="mt-3 space-y-2">
                {result.notes.map((note) => (
                  <li key={note} className="flex gap-3 text-sm text-slate-700">
                    <Info className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:flex-wrap">
        {result.eligible && (
          <Link to={`/guides#${documentType.id}`} className={buttonClass()}>
            <BookOpen className="size-4" aria-hidden="true" />
            View Step-by-Step Guide
          </Link>
        )}
        <a
          href={documentType.website.url}
          target="_blank"
          rel="noreferrer"
          className={buttonClass({ variant: 'outline' })}
        >
          Visit {documentType.agencyShort} Website
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <button type="button" onClick={onReset} className={buttonClass({ variant: 'ghost' })}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Start Over
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Requirements and fees are estimates based on publicly available information and may change. Always confirm
        with the {documentType.agency} before your visit.
      </p>
    </>
  )
}

export default function ChecklistResults({ result, headingRef, onReset, className }) {
  return (
    <article id="results" aria-labelledby="results-heading" className={cx(cardClass, 'p-5 sm:p-8', className)}>
      <h2
        id="results-heading"
        ref={headingRef}
        tabIndex={-1}
        className="flex items-center gap-2.5 text-xl font-bold text-primary focus:outline-none sm:text-2xl"
      >
        <ClipboardList className="size-6 shrink-0 text-accent" aria-hidden="true" />
        Your Personalized Checklist
      </h2>
      {result ? <ChecklistDetails result={result} onReset={onReset} /> : <EmptyState />}
    </article>
  )
}
