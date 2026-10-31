import { useText } from '@/shared/i18n/useText'
const socials = [
  {
    name: 'Facebook',
    path: (
      <path d="M14 21v-8h3l.5-4H14V7c0-1 .4-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v8" />
    ),
  },
  {
    name: 'Twitter',
    path: (
      <path d="M22 5.5c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1a3.8 3.8 0 0 0-6.5 3.5A10.8 10.8 0 0 1 4.7 4.5a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5 0 1.9 1.3 3.5 3.1 3.9-.6.2-1.2.2-1.8.1.5 1.6 1.9 2.7 3.6 2.7A7.7 7.7 0 0 1 3 17.5a10.8 10.8 0 0 0 16.6-9.1V8c.9-.7 1.6-1.5 2.4-2.5Z" />
    ),
  },
  {
    name: 'Instagram',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'LinkedIn',
    path: (
      <>
        <path d="M4 9v12M10 21V9h4v2c1-3 6-3 6 2v8M14 12v9" />
        <circle cx="4" cy="4" r="1" />
      </>
    ),
  },
]

const SocialIcons = () => {
  const { t } = useText()

  return (
    <ul aria-label={t('Social networks')} className="flex items-center gap-5">
      {socials.map(({ name, path }) => (
        <li key={name}>
          <span
            role="img"
            aria-label={t('{{value0}} — link not available', { value0: name })}
            title={t('{{value0}}: link not available', { value0: name })}
            className="inline-flex size-6 items-center justify-center text-neutral-200"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5"
              aria-hidden="true"
            >
              {path}
            </svg>
          </span>
        </li>
      ))}
    </ul>
  )
}

export default SocialIcons
