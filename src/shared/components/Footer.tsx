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
            Exclusive
          </h2>
          <h3 className="text-xl font-medium">Subscribe</h3>
          <p className="text-sm">Get updates from our store</p>
          <SubscribeForm />
        </section>
        <section aria-labelledby="footer-support" className="space-y-6">
          <h2 id="footer-support" className="text-xl font-medium">
            Support
          </h2>
          <address className="space-y-4 text-sm leading-6 not-italic">
            <p>
              111 Bijoy sarani, Dhaka,
              <br />
              DH 1515, Bangladesh.
            </p>
            <p className="break-words">exclusive@gmail.com</p>
            <p>+88015-88888-9999</p>
          </address>
        </section>
        <nav aria-labelledby="footer-account" className="space-y-6">
          <h2 id="footer-account" className="text-xl font-medium">
            Account
          </h2>
          <ul className="space-y-4 text-sm">
            {accountLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-labelledby="footer-links" className="space-y-6">
          <h2 id="footer-links" className="text-xl font-medium">
            Quick Link
          </h2>
          <ul className="space-y-4 text-sm">
            {['Privacy Policy', 'Terms Of Use', 'FAQ'].map((label) => (
              <li key={label}>
                <span
                  aria-disabled="true"
                  title="Not available yet"
                  className="text-neutral-400"
                >
                  {label}
                </span>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <section aria-labelledby="footer-social" className="space-y-6">
          <h2 id="footer-social" className="text-xl font-medium">
            Social
          </h2>
          <SocialIcons />
        </section>
      </div>
      <div className="border-t border-white/10">
        <p className="container flex items-start justify-center gap-2 py-5 text-center text-xs leading-5 text-neutral-500 sm:text-sm">
          <Copyright className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>Copyright Rimel 2022. All rights reserved</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
