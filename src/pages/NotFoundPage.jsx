import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { buttonClass } from '../components/ui/styles.js'
import usePageTitle from '../hooks/usePageTitle.js'

export default function NotFoundPage() {
  usePageTitle('Page Not Found')

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
      <p className="text-sm font-semibold tracking-wider text-secondary uppercase">404 error</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link to="/" className={buttonClass()}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Home
        </Link>
        <Link to="/guides" className={buttonClass({ variant: 'outline' })}>
          Browse How-To Guides
        </Link>
      </div>
    </div>
  )
}
