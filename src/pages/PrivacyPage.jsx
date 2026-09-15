import LegalContent from '../components/LegalContent.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import usePageTitle from '../hooks/usePageTitle.js'

const SECTIONS = [
  {
    heading: 'Information You Enter in the Requirement Checker',
    body: 'The answers you provide in the Requirement Checker, such as your age, status, and the document you are applying for, are used only to build your checklist in your browser. They are not stored or shared.',
  },
  {
    heading: 'Messages You Send Us',
    body: 'If you contact us through one of our forms, the details you include are used only to respond to your question. We never sell or share this information with third parties.',
  },
  {
    heading: 'Links to Government Websites',
    body: 'GovReady links to official government websites for your convenience. Those websites have their own privacy policies, and we are not responsible for how they handle your information.',
  },
  {
    heading: 'Educational Project',
    body: 'GovReady is an educational project and is not affiliated with any government agency. Always verify final requirements with the official government agency.',
  },
]

export default function PrivacyPage() {
  usePageTitle('Privacy Policy')

  return (
    <>
      <PageHeader
        breadcrumb="Privacy Policy"
        title="Privacy Policy"
        description="How GovReady handles the information you share while using the site."
      />
      <LegalContent sections={SECTIONS} />
    </>
  )
}
