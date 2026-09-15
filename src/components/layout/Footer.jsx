import { Link } from 'react-router'
import { primaryNav, supportNav } from '../../data/navigation.js'

const CURRENT_YEAR = new Date().getFullYear()

function FooterLinks({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-wider text-white uppercase">{title}</h2>
      <ul className="mt-3 space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="inline-block rounded-sm py-1 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-xl font-bold tracking-tight">GovReady</p>
            <p className="mt-1 text-sm text-slate-300">Your Government Document Requirement Checklist</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              <strong className="font-semibold text-white">Disclaimer:</strong> This is an educational project. Always
              verify final requirements with the official government agency.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-6">
            <FooterLinks title="Explore" links={primaryNav} />
            <FooterLinks title="Support" links={supportNav} />
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6">
          <p className="text-sm text-slate-300">&copy; {CURRENT_YEAR} GovReady. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
