import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { MessageCircle } from 'lucide-react'
import ChecklistResults from '../components/checker/ChecklistResults.jsx'
import QuickTips from '../components/checker/QuickTips.jsx'
import RequirementForm from '../components/checker/RequirementForm.jsx'
import MessageForm from '../components/MessageForm.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { cardClass, cx } from '../components/ui/styles.js'
import { DOCUMENT_TYPES } from '../data/documents.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { buildChecklist, isDocumentType } from '../lib/checklist.js'
import { scrollToElement } from '../lib/scroll.js'

export default function HomePage() {
  usePageTitle()

  const [searchParams] = useSearchParams()
  const [result, setResult] = useState(null)
  const [formVersion, setFormVersion] = useState(0)
  const checkerHeadingRef = useRef(null)
  const resultsHeadingRef = useRef(null)

  const requestedDocument = searchParams.get('document')
  const defaultPurpose = isDocumentType(requestedDocument) ? requestedDocument : undefined

  useEffect(() => {
    if (!result) return

    scrollToElement(resultsHeadingRef.current)
    resultsHeadingRef.current.focus({ preventScroll: true })
  }, [result])

  function handleReset() {
    setResult(null)
    setFormVersion((version) => version + 1)
    scrollToElement(checkerHeadingRef.current)
    checkerHeadingRef.current.focus({ preventScroll: true })
  }

  return (
    <>
      <PageHeader
        title="Your Government Document Requirement Checklist"
        description="Answer four quick questions to see the documents, fees, and appointment details you need before visiting a government office."
      >
        <div className="mt-6 hidden flex-wrap items-center gap-2 sm:flex">
          <span className="mr-1 text-sm text-slate-300">Supported documents:</span>
          {DOCUMENT_TYPES.map((documentType) => (
            <span
              key={documentType.id}
              className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/20 ring-inset"
            >
              {documentType.name}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-12">
          <section id="checker" aria-labelledby="checker-heading" className={cx(cardClass, 'p-5 sm:p-8 lg:col-span-7')}>
            <h2
              id="checker-heading"
              ref={checkerHeadingRef}
              tabIndex={-1}
              className="text-xl font-bold text-primary focus:outline-none sm:text-2xl"
            >
              Check Your Requirements
            </h2>
            <p className="mt-2 text-slate-600">
              Fill out the details below to get a personalized checklist for your government document application.
            </p>
            <RequirementForm
              key={`${formVersion}-${defaultPurpose ?? 'default'}`}
              defaultPurpose={defaultPurpose}
              onSubmit={(profile) => setResult(buildChecklist(profile))}
            />
          </section>

          <ChecklistResults
            result={result}
            headingRef={resultsHeadingRef}
            onReset={handleReset}
            className="lg:col-span-5"
          />
        </div>

        <aside aria-label="Tips and questions" className="grid gap-6 sm:gap-8 md:grid-cols-2">
          <QuickTips />
          <section aria-labelledby="question-heading" className={cx(cardClass, 'p-5 sm:p-8')}>
            <h2 id="question-heading" className="flex items-center gap-3 text-lg font-bold text-primary sm:text-xl">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary-soft">
                <MessageCircle className="size-5 text-secondary" aria-hidden="true" />
              </span>
              Have a Specific Question?
            </h2>
            <div className="mt-5">
              <MessageForm
                label="Ask us about your document requirements:"
                placeholder="Type your question here..."
                submitLabel="Send Question"
                rows={3}
              />
            </div>
          </section>
        </aside>
      </div>
    </>
  )
}
