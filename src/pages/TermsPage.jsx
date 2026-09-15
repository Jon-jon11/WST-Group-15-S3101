import LegalContent from '../components/LegalContent.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

const SECTIONS = [
  {
    heading: 'Informational Purposes Only',
    body: 'GovReady provides general guidance on Philippine government document requirements. It is an educational project and is not affiliated with, endorsed by, or operated by any government agency.',
  },
  {
    heading: 'Accuracy of Information',
    body: 'Requirements, fees, and procedures can change without notice. While we aim to keep information accurate, we cannot guarantee that it is complete or up to date. Always confirm the final requirements with the issuing agency before your visit.',
  },
  {
    heading: 'External Links',
    body: 'Links to government and third-party websites are provided for convenience. We are not responsible for the content or availability of those websites.',
  },
  {
    heading: 'Acceptable Use',
    body: 'You agree to use GovReady only for lawful purposes and not to interfere with the site or disrupt its availability for other users.',
  },
]

export default function TermsPage() {
  usePageTitle('Terms of Use')

  return (
    <>
      <PageHeader
        breadcrumb="Terms of Use"
        title="Terms of Use"
        description="The terms that apply when you use GovReady."
      />
      <LegalContent sections={SECTIONS} />
    </>
  )
}
