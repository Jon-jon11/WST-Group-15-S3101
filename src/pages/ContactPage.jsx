import { Link } from 'react-router'
import { BookOpen, ChevronRight, ClipboardCheck, ExternalLink } from 'lucide-react'
import MessageForm from '../components/MessageForm.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { cardClass, cx } from '../components/ui/styles.js'
import { DOCUMENT_TYPES } from '../data/documents.js'
import usePageTitle from '../hooks/usePageTitle.js'

const SELF_SERVICE_LINKS = [
  {
    to: '/#checker',
    icon: ClipboardCheck,
    title: 'Requirement Checker',
    description: 'Get a checklist for your situation',
  },
  {
    to: '/guides',
    icon: BookOpen,
    title: 'How-To Guides',
    description: 'Follow step-by-step application guides',
  },
]

export default function ContactPage() {
  usePageTitle('Contact Support')

  return (
    <>
      <PageHeader
        breadcrumb="Contact Support"
        title="Contact Support"
        description="Have a question about your document requirements? Send us a message and our team will help point you in the right direction."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-12">
          <section aria-labelledby="contact-form-heading" className={cx(cardClass, 'p-5 sm:p-8 lg:col-span-7')}>
            <h2 id="contact-form-heading" className="text-xl font-bold text-primary sm:text-2xl">
              Send Us a Message
            </h2>
            <p className="mt-2 text-slate-600">
              Include the document you&apos;re applying for and any details that will help us understand your question.
            </p>
            <div className="mt-6">
              <MessageForm
                withContactFields
                label="Your message"
                placeholder="Describe your question or concern..."
                rows={6}
              />
            </div>
          </section>

          <aside aria-label="More ways to get help" className="space-y-6 sm:space-y-8 lg:col-span-5">
            <section aria-labelledby="self-service-heading" className={cx(cardClass, 'p-5 sm:p-6')}>
              <h2 id="self-service-heading" className="text-lg font-bold text-primary">
                Find Answers Faster
              </h2>
              <ul className="mt-4 space-y-3">
                {SELF_SERVICE_LINKS.map(({ to, icon: Icon, title, description }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-secondary hover:bg-secondary-soft"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary-soft text-secondary group-hover:bg-white">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-ink">{title}</span>
                        <span className="block text-sm text-slate-600">{description}</span>
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-slate-400 group-hover:text-secondary" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="agency-links-heading" className={cx(cardClass, 'p-5 sm:p-6')}>
              <h2 id="agency-links-heading" className="text-lg font-bold text-primary">
                Official Agency Websites
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                GovReady is not affiliated with any government agency. For official concerns, contact the issuing agency
                directly.
              </p>
              <ul className="mt-3 divide-y divide-slate-200">
                {DOCUMENT_TYPES.map((documentType) => (
                  <li key={documentType.id}>
                    <a
                      href={documentType.website.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex min-h-14 items-center justify-between gap-3 rounded-sm py-3"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink group-hover:text-secondary">
                          {documentType.agencyShort}
                        </span>
                        <span className="block text-sm text-slate-600">{documentType.name}</span>
                      </span>
                      <ExternalLink className="size-4 shrink-0 text-slate-400 group-hover:text-secondary" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
