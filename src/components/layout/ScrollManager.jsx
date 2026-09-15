import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { scrollToElement } from '../../lib/scroll.js'

export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null

    if (target) {
      scrollToElement(target)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, key])

  return null
}
