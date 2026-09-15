import { Link } from 'react-router'
import {
  ArrowRight,
  BadgeCheck,
  BicepsFlexed,
  Eye,
  Flag,
  Handshake,
  Lightbulb,
  Lock,
  ShieldCheck,
  Smartphone,
  Target,
  Zap,
} from 'lucide-react'
import MessageForm from '../components/MessageForm.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { buttonClass, cardClass, cx } from '../components/ui/styles.js'
import usePageTitle from '../hooks/usePageTitle.js'

const STATEMENTS = [
  {
    icon: Flag,
    title: 'Mission',
    text: 'To simplify and demystify government document requirements for all Filipinos, making the application process faster, easier, and more accessible to everyone.',
  },
  {
    icon: Eye,
    title: 'Vision',
    text: 'A Philippines where every citizen can confidently navigate government documentation without confusion or unnecessary delays.',
  },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Quick & Easy',
    description: 'Get personalized checklists in seconds based on your specific situation.',
  },
  {
    icon: BadgeCheck,
    title: 'Accurate Info',
    description: 'Information verified from official Philippine government sources.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your data is never stored or shared with third parties.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access from any device, anytime, anywhere you need it.',
  },
]

const VALUES = [
  { icon: Target, title: 'Clarity', description: 'We make complex government requirements simple and understandable.' },
  { icon: Handshake, title: 'Accessibility', description: 'Information should be free and available to all Filipinos.' },
  { icon: BicepsFlexed, title: 'Empowerment', description: 'We empower citizens to take control of their document needs.' },
  { icon: Lock, title: 'Integrity', description: 'We maintain the highest standards of accuracy and trust.' },
]

const STATS = [
  { value: '10K+', label: 'Users Helped' },
  { value: '50+', label: 'Document Types' },
  { value: '95%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'Availability' },
]

const TEAM = [
  {
    name: 'Rai',
    role: 'Programmer & Web Developer',
    bio: 'Cybersecurity enthusiast and full-stack web developer with a passion for creating user-friendly applications.',
  },
  {
    name: 'Jonathan',
    role: 'Government Affairs Specialist',
    bio: 'Expert in Philippine government documentation and procedures.',
  },
  {
    name: 'Miguel Santos',
    role: 'UX/UI Designer',
    bio: 'Creating seamless and intuitive user experiences for all.',
  },
]

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export default function AboutPage() {
  usePageTitle('About Us')

  return (
    <>
      <PageHeader
        breadcrumb="About Us"
        title="About GovReady"
        description="We help Filipinos understand government document requirements, so every application is faster, easier, and more accessible."
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:space-y-16 sm:px-6 lg:px-8 lg:py-16">
        <section id="mission" aria-labelledby="mission-heading">
          <SectionHeading id="mission-heading" title="Our Mission & Vision" />
          <div className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-2">
            {STATEMENTS.map(({ icon: Icon, title, text }) => (
              <div key={title} className={cx(cardClass, 'p-6 sm:p-8')}>
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft">
                    <Icon className="size-5 text-accent" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-primary">{title}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why-govready" aria-labelledby="why-heading">
          <SectionHeading id="why-heading" title="Why Choose GovReady?" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className={cx(cardClass, 'p-6 transition-shadow hover:shadow-md')}>
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-primary">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="values" aria-labelledby="values-heading">
          <SectionHeading id="values-heading" title="Our Core Values" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-primary p-6 text-white">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="size-6 text-accent" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="impact" aria-labelledby="impact-heading">
          <SectionHeading id="impact-heading" title="Our Impact" />
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className={cx(cardClass, 'flex flex-col-reverse p-5 text-center sm:p-6')}>
                <dt className="mt-1 text-sm font-medium text-slate-600">{stat.label}</dt>
                <dd className="text-3xl font-bold tracking-tight text-secondary sm:text-4xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="team" aria-labelledby="team-heading">
          <SectionHeading
            id="team-heading"
            title="Meet the Team"
            description="GovReady is built by passionate developers and government experts dedicated to making document requirements accessible."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className={cx(cardClass, 'flex gap-4 p-5 sm:flex-col sm:items-center sm:p-8 sm:text-center')}
              >
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-bold text-white sm:size-20 sm:text-2xl"
                >
                  {getInitials(member.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-primary">{member.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold tracking-wider text-secondary uppercase">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
          <article id="story" aria-labelledby="story-heading" className={cx(cardClass, 'p-6 sm:p-8 lg:col-span-7')}>
            <h2 id="story-heading" className="text-2xl font-bold tracking-tight text-primary">
              Our Story
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-slate-600">
              <p>
                GovReady was born from a simple frustration: getting government documents in the Philippines
                shouldn&apos;t be complicated. Our team spent countless hours helping friends and family navigate
                confusing requirements, missing documents, and long delays.
              </p>
              <p>
                We realized that with proper organization and clear information, we could help thousands of Filipinos
                save time, reduce stress, and successfully complete their document applications on the first try.
              </p>
              <p>
                Today, GovReady serves as a trusted companion for thousands of Filipinos in their journey through
                government documentation, and we&apos;re just getting started.
              </p>
            </div>
          </article>

          <aside aria-label="Get started" className="space-y-6 sm:space-y-8 lg:col-span-5">
            <div className="rounded-2xl bg-primary p-6 text-white sm:p-8">
              <h2 className="flex items-start gap-3 text-xl font-bold">
                <Lightbulb className="mt-0.5 size-6 shrink-0 text-accent" aria-hidden="true" />
                Ready to Simplify Your Document Journey?
              </h2>
              <p className="mt-3 leading-relaxed text-slate-200">
                Start by checking your requirements today. Our personalized checklist will guide you through every
                step of the process.
              </p>
              <Link to="/#checker" className={buttonClass({ variant: 'light', className: 'mt-6 w-full sm:w-auto' })}>
                Go to Requirement Checker
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <section aria-labelledby="about-questions-heading" className={cx(cardClass, 'p-6 sm:p-8')}>
              <h2 id="about-questions-heading" className="text-xl font-bold text-primary">
                Have Questions?
              </h2>
              <div className="mt-4">
                <MessageForm label="Get in touch with our team:" placeholder="Your message..." rows={4} />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
