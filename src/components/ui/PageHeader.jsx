import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

export default function PageHeader({ title, description, breadcrumb, children }) {
  return (
    <div className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-1.5 text-sm text-slate-300">
              <li>
                <Link to="/" className="rounded-sm hover:text-white hover:underline focus-visible:outline-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="font-medium text-white">
                {breadcrumb}
              </li>
            </ol>
          </nav>
        )}
        <h1 className="max-w-3xl text-3xl/tight font-bold tracking-tight text-balance sm:text-4xl/tight">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base text-slate-200 sm:text-lg">{description}</p>}
        {children}
      </div>
    </div>
  )
}
