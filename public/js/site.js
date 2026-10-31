/* Shared behavior: icons, mobile navigation, form helpers, footer year. */

function scrollToElement(element) {
  if (!element) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

function setFieldError(field, message) {
  const error = field.querySelector('.field__error')
  const input = field.querySelector('input, select, textarea')

  if (error) {
    error.hidden = !message
    error.querySelector('[data-error-text]').textContent = message || ''
  }

  if (input) {
    input.setAttribute('aria-invalid', message ? 'true' : 'false')
  }
}

function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle')
  const menu = document.getElementById('mobile-menu')
  const overlay = document.getElementById('menu-overlay')

  if (!toggle || !menu) return

  function setMenuOpen(isOpen) {
    menu.hidden = !isOpen
    if (overlay) overlay.hidden = !isOpen

    toggle.setAttribute('aria-expanded', String(isOpen))
    toggle.querySelector('[data-icon]').dataset.icon = isOpen ? 'x' : 'menu'
    toggle.querySelector('.sr-only').textContent = isOpen ? 'Close menu' : 'Open menu'
    renderIcons(toggle)
  }

  toggle.addEventListener('click', function () {
    setMenuOpen(menu.hidden)
  })

  if (overlay) {
    overlay.addEventListener('click', function () {
      setMenuOpen(false)
    })
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !menu.hidden) {
      setMenuOpen(false)
      toggle.focus()
    }
  })

  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (event) {
    if (event.matches) setMenuOpen(false)
  })
}

/* On the home page, "Home" and "Requirement Checker" point at the same page,
   so the active link follows the hash. */
function setupHomeNavHighlight() {
  if (document.body.dataset.page !== 'home') return

  function update() {
    const onChecker = window.location.hash === '#checker'

    document.querySelectorAll('[data-nav]').forEach(function (link) {
      const isCurrent = link.dataset.nav === (onChecker ? 'checker' : 'home')

      if (isCurrent) {
        link.setAttribute('aria-current', 'page')
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }

  update()
  window.addEventListener('hashchange', update)
}

function setCurrentYear() {
  const target = document.getElementById('current-year')
  if (target) target.textContent = String(new Date().getFullYear())
}

renderIcons()
setupMobileMenu()
setupHomeNavHighlight()
setCurrentYear()
