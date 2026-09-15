import { Link } from 'react-router'
import { ArrowRight, ExternalLink } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import { buttonClass, cardClass, cx } from '../components/ui/styles.js'
import { DOCUMENT_TYPES } from '../data/documents.js'
import usePageTitle from '../hooks/usePageTitle.js'

function GuideCard({ documentType }) {
  const { id, name, icon: Icon, agency, summary, steps, website } = documentType

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cx(cardClass, 'p-5 sm:p-8')}>
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 id={`${id}-heading`} className="text-xl font-bold text-primary sm:text-2xl">
            {name}
          </h2>
          <p className="mt-0.5 text-sm font-medium text-slate-500">{agency}</p>
        </div>
      </div>

      <p className="mt-4 text-slate-600">{summary}</p>

      <ol className="mt-6">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
            {index < steps.length - 1 && (
              <span aria-hidden="true" className="absolute top-10 bottom-1 left-4 w-px bg-slate-200" />
            )}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {index + 1}
            </span>
            <div className="pt-1">
              <h3 className="font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
        <Link to={`/?document=${id}#checker`} className={buttonClass()}>
          Check My Requirements
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <a href={website.url} target="_blank" rel="noreferrer" className={buttonClass({ variant: 'outline' })}>
          {website.label}
          <ExternalLink className="size-4" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </section>
  )
}

export default function GuidesPage() {
  usePageTitle('How-To Guides')

  return (
    <>
      <PageHeader
        breadcrumb="How-To Guides"
        title="How-To Guides"
        description="Step-by-step instructions for common Philippine government ID applications. For a checklist based on your situation, use the Requirement Checker."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
          <nav aria-label="Guides" className="mb-6 lg:sticky lg:top-28 lg:col-span-4 lg:mb-0 xl:col-span-3">
            <p className="mb-3 text-sm font-semibold tracking-wider text-slate-500 uppercase">Jump to a guide</p>
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 lg:flex-col">
              {DOCUMENT_TYPES.map(({ id, name, icon: Icon }) => (
                <li key={id} className="shrink-0">
                  <Link
                    to={`#${id}`}
                    className="flex min-h-11 items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-secondary hover:text-secondary lg:rounded-lg"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6 sm:space-y-8 lg:col-span-8 xl:col-span-9">
            {DOCUMENT_TYPES.map((documentType) => (
              <GuideCard key={documentType.id} documentType={documentType} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
