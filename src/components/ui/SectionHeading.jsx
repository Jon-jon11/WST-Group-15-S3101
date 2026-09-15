import { cx } from './styles.js'

export default function SectionHeading({ id, title, description, className }) {
  return (
    <div className={cx('max-w-3xl', className)}>
      <h2 id={id} className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {title}
      </h2>
      {description && <p className="mt-2 text-base text-slate-600">{description}</p>}
    </div>
  )
}
