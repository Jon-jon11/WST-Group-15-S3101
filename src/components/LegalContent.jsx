import { cardClass, cx } from './ui/styles.js'

export default function LegalContent({ sections }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className={cx(cardClass, 'max-w-3xl space-y-8 p-5 sm:p-8')}>
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold text-primary sm:text-xl">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
