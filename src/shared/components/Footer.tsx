import { useText } from '@/shared/i18n/useText'
import { Link } from 'react-router-dom'
import { Copyright } from 'lucide-react'
import SubscribeForm from '@/shared/components/footer/SubscribeForm'
import SocialIcons from '@/shared/components/footer/SocialIcons'

const accountLinks = [
  { label: 'My Account', to: '/account' },
  { label: 'Cart', to: '/cart' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Shop', to: '/products' },
]

const Footer = () => {
  const { t } = useText()

  return (
    <footer className="bg-black text-neutral-100">
      <div className="container grid grid-cols-1 gap-x-8 gap-y-10 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.2fr_1fr_.65fr_.7fr_.85fr] lg:gap-x-12">
        <section
          aria-labelledby="footer-exclusive"
          className="space-y-5 sm:col-span-2 lg:col-span-1"
        >
          <h2
            id="footer-exclusive"
            className="text-2xl font-semibold tracking-wide"
          >
            {t('Exclusive')}
          </h2>
          <h3 className="text-xl font-medium">{t('Subscribe')}</h3>
          <p className="text-sm">{t('Get updates from our store')}</p>
          <SubscribeForm />
        </section>
        <section aria-labelledby="footer-support" className="space-y-6">
          <h2 id="footer-support" className="text-xl font-medium">
            {t('Support')}
          </h2>
          <p className="text-sm leading-6 text-neutral-300">
            {t('Verified support contact details are not available yet.')}
          </p>
          <Link
            to="/contact"
            className="inline-block rounded-sm text-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t('Contact information')}
          </Link>
        </section>
        <nav aria-labelledby="footer-account" className="space-y-6">
          <h2 id="footer-account" className="text-xl font-medium">
            {t('Account')}
          </h2>
          <ul className="space-y-4 text-sm">
            {accountLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {t(label || '')}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-links" className="space-y-6">
          <h2 id="footer-links" className="text-xl font-medium">
            {t('Quick Link')}
          </h2>
          <ul className="space-y-4 text-sm">
            {['Privacy Policy', 'Terms Of Use', 'FAQ'].map((label) => (
              <li key={label}>
                <span
                  aria-disabled="true"
                  title={t('Not available yet')}
                  className="text-neutral-400"
                >
                  {t(label || '')}
                </span>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {t('Contact')}
              </Link>
            </li>
          </ul>
        </nav>
        <section aria-labelledby="footer-social" className="space-y-6">
          <h2 id="footer-social" className="text-xl font-medium">
            {t('Social')}
          </h2>
          <SocialIcons />
        </section>
      </div>
      <div className="border-t border-white/10">
        <p className="container flex items-start justify-center gap-2 py-5 text-center text-xs leading-5 text-neutral-500 sm:text-sm">
          <Copyright className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{t('Copyright Rimel 2022. All rights reserved')}</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
