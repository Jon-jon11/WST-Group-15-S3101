import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ScrollManager from './ScrollManager.jsx'

export default function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-primary focus:shadow-lg"
      >
        Skip to main content
      </a>
      <ScrollManager />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
