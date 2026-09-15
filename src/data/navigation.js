import { BookOpen, ClipboardCheck, House, Info, LifeBuoy } from 'lucide-react'

export const primaryNav = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Requirement Checker', to: '/#checker', icon: ClipboardCheck },
  { label: 'How-To Guides', to: '/guides', icon: BookOpen },
  { label: 'About Us', to: '/about', icon: Info },
  { label: 'Contact Support', to: '/contact', icon: LifeBuoy },
]

export const supportNav = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Contact Us', to: '/contact' },
]

export function getActiveNavTarget({ pathname, hash }) {
  const exactMatch = primaryNav.find((item) => item.to === `${pathname}${hash}`)
  if (exactMatch) return exactMatch.to

  return primaryNav.find((item) => item.to === pathname)?.to ?? null
}
