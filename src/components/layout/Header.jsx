import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { ChevronRight, Menu, X } from 'lucide-react'
import logo from '../../assets/govready-logo.png'
import { getActiveNavTarget, primaryNav } from '../../data/navigation.js'
import { cx } from '../ui/styles.js'

export default function Header() {
  const location = useLocation()
  const menuButtonRef = useRef(null)
  const [menuLocationKey, setMenuLocationKey] = useState(null)

  const isMenuOpen = menuLocationKey === location.key
  const activeTarget = getActiveNavTarget(location)

  const closeMenu = () => setMenuLocationKey(null)
  const toggleMenu = () => setMenuLocationKey(isMenuOpen ? null : location.key)

  useEffect(() => {
    if (!isMenuOpen) return

    const desktopQuery = window.matchMedia('(min-width: 64rem)')

    function handleKeyDown(event) {
      if (event.key !== 'Escape') return
      setMenuLocationKey(null)
      menuButtonRef.current?.focus()
    }

    function handleViewportChange(event) {
      if (event.matches) setMenuLocationKey(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    desktopQuery.addEventListener('change', handleViewportChange)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      desktopQuery.removeEventListener('change', handleViewportChange)
    }
  }, [isMenuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link to="/" onClick={closeMenu} className="shrink-0 rounded-md">
          <img src={logo} alt="GovReady home" width={514} height={192} className="h-11 w-auto lg:h-14" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const isActive = item.to === activeTarget

              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={cx(
                      'relative flex h-11 items-center rounded-md px-3 text-[0.9375rem] font-medium transition-colors xl:px-4',
                      isActive ? 'text-primary' : 'text-slate-600 hover:bg-slate-100 hover:text-primary',
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-[18px] h-[3px] rounded-t-full bg-accent xl:inset-x-4"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-primary transition-colors hover:bg-slate-100 lg:hidden"
        >
          {isMenuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className="fixed inset-x-0 top-16 bottom-0 z-30 bg-slate-900/40 lg:hidden"
          />
          <nav
            id="mobile-menu"
            aria-label="Main"
            className="absolute inset-x-0 top-full z-40 border-b border-slate-200 bg-white shadow-lg lg:hidden"
          >
            <ul className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
              {primaryNav.map((item) => {
                const isActive = item.to === activeTarget
                const Icon = item.icon

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={closeMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={cx(
                        'flex min-h-12 items-center gap-3 rounded-lg px-3 text-base font-medium transition-colors',
                        isActive ? 'bg-secondary-soft text-primary' : 'text-slate-700 hover:bg-slate-100',
                      )}
                    >
                      <Icon
                        className={cx('size-5 shrink-0', isActive ? 'text-secondary' : 'text-slate-400')}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </>
      )}
    </header>
  )
}
