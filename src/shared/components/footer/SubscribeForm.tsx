import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const subscribeSchema = z.object({
  email: z.email('Enter a valid email address.'),
})

type SubscribeValues = z.infer<typeof subscribeSchema>

const SubscribeForm = () => {
  const [message, setMessage] = useState(
    'Email subscription is not available yet.',
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: '' },
  })

  const handleSubscribe = () => {
    setMessage('Subscription is unavailable. Your email has not been sent.')
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(handleSubscribe)}
      aria-label="Email subscription"
      className="max-w-56 space-y-3"
    >
      <div className="relative">
        <Input
          {...register('email')}
          type="email"
          autoComplete="email"
          aria-label="Your email for subscription"
          aria-invalid={Boolean(errors.email)}
          aria-describedby="subscribe-message"
          placeholder="Enter your email"
          className="h-12 rounded-sm border-white bg-transparent pr-12 pl-3 text-sm text-white placeholder:text-neutral-400 focus-visible:border-white focus-visible:ring-white/40 md:text-sm"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          aria-label="Subscribe"
          className="absolute top-1 right-1 size-10 rounded-sm text-white hover:bg-white/15 hover:text-white focus-visible:ring-white/40"
        >
          <Send className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
      <p
        id="subscribe-message"
        role="status"
        className="text-xs leading-5 text-neutral-400"
      >
        {errors.email?.message || message}
      </p>
    </form>
  )
}

export default SubscribeForm
