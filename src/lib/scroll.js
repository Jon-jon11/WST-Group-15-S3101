export function scrollToElement(element) {
  if (!element) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}
