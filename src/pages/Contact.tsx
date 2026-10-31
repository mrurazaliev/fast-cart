import { useText } from '@/shared/i18n/useText'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { contactSchema } from '@/features/contact/contactSchema'
import type { ContactValues } from '@/features/contact/contactSchema'

const Contact = () => {
  const { t } = useText()

  const [detailsChecked, setDetailsChecked] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  })

  return (
    <div className="pt-2 pb-16 sm:pt-6 sm:pb-24">
      <nav aria-label={t('Breadcrumb')} className="mb-10 text-sm sm:mb-14">
        <ol className="flex flex-wrap items-center gap-3">
          <li>
            <Link
              to="/"
              className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {t('Home')}
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground">
            /
          </li>
          <li aria-current="page">{t('Contact')}</li>
        </ol>
      </nav>
      <h1 className="sr-only">{t('Contact FastCart')}</h1>
      <div className="grid items-start gap-7 lg:grid-cols-[.8fr_1.8fr]">
        <aside
          aria-label={t('Contact information')}
          className="rounded-sm p-6 shadow-[0_1px_16px_0_#0000000f] sm:p-8"
        >
          <section aria-labelledby="contact-call" className="space-y-5 pb-7">
            <h2
              id="contact-call"
              className="flex items-center gap-4 font-medium"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              {t('Call To Us')}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {t(
                'A verified customer support phone number is not available yet.',
              )}
            </p>
          </section>
          <section
            aria-labelledby="contact-write"
            className="space-y-5 border-t pt-7"
          >
            <h2
              id="contact-write"
              className="flex items-center gap-4 font-medium"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              {t('Write To Us')}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {t(
                'Message delivery and a verified support email are not available yet. No response time has been confirmed.',
              )}
            </p>
          </section>
        </aside>
        <form
          noValidate
          onSubmit={handleSubmit(
            () => setDetailsChecked(true),
            () => setDetailsChecked(false),
          )}
          onChange={() => setDetailsChecked(false)}
          aria-label={t('Contact message')}
          aria-describedby="contact-unavailable"
          className="min-w-0 space-y-6 rounded-sm p-6 shadow-[0_1px_16px_0_#0000000f] sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="min-w-0 space-y-2">
              <label htmlFor="contact-name" className="text-sm">
                {t('Your name')} <span aria-hidden="true">*</span>
              </label>
              <Input
                {...register('name')}
                id="contact-name"
                autoComplete="name"
                required
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? 'contact-name-error' : undefined
                }
                className="h-12 rounded-sm"
              />
              {errors.name && (
                <p
                  id="contact-name-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {t(errors.name.message || '')}
                </p>
              )}
            </div>
            <div className="min-w-0 space-y-2">
              <label htmlFor="contact-email" className="text-sm">
                {t('Email')} <span aria-hidden="true">*</span>
              </label>
              <Input
                {...register('email')}
                id="contact-email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? 'contact-email-error' : undefined
                }
                className="h-12 rounded-sm"
              />
              {errors.email && (
                <p
                  id="contact-email-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {t(errors.email.message || '')}
                </p>
              )}
            </div>
            <div className="min-w-0 space-y-2">
              <label htmlFor="contact-phone" className="text-sm">
                {t('Phone (optional)')}
              </label>
              <Input
                {...register('phone')}
                id="contact-phone"
                type="tel"
                autoComplete="tel"
                className="h-12 rounded-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-message" className="text-sm">
              {t('Your Message')} <span aria-hidden="true">*</span>
            </label>
            <textarea
              {...register('message')}
              id="contact-message"
              rows={7}
              required
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message ? 'contact-message-error' : undefined
              }
              className="min-h-48 w-full resize-y rounded-sm border bg-transparent px-3 py-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive"
            />
            {errors.message && (
              <p
                id="contact-message-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {t(errors.message.message || '')}
              </p>
            )}
          </div>
          <p
            id="contact-unavailable"
            className="text-sm leading-6 text-muted-foreground"
          >
            {t(
              'Message delivery is currently unavailable. You can check these fields, but nothing will be sent or saved. Fields marked * are required.',
            )}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" variant="outline" className="h-12 rounded-sm">
              {t('Check Details')}
            </Button>
            <Button
              type="button"
              disabled
              aria-describedby="contact-unavailable"
              className="h-12 rounded-sm px-8"
            >
              {t('Send Message')}
            </Button>
          </div>
          {detailsChecked && (
            <p role="status" className="text-sm leading-6">
              {t(
                'The fields are valid. Nothing has been sent. Message delivery is currently unavailable.',
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Contact
