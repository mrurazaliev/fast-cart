import { useRef } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector } from '@/app/hooks'
import { registerSchema } from '@/features/auth/authSchemas'
import type { RegisterValues } from '@/features/auth/authSchemas'
import { registerAccount, getAuthErrors } from '@/features/auth/authApi'
import AuthLayout from '@/features/auth/AuthLayout'
import AuthField from '@/features/auth/AuthField'
import { Button } from '@/components/ui/button'

const Register = () => {
  const session = useAppSelector((state) => state.auth.session)
  const navigate = useNavigate()
  const submitting = useRef(false)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerAccount(values)
      reset()
      navigate('/login', {
        replace: true,
        state: { registrationComplete: true },
      })
    } catch (error) {
      const result = getAuthErrors(error)
      setError('root', { message: result.message })
      for (const field of [
        'userName',
        'phoneNumber',
        'email',
        'password',
        'confirmPassword',
      ] as const) {
        if (result.fields[field])
          setError(field, { message: result.fields[field] })
      }
    }
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    try {
      await handleSubmit(onSubmit, () => {
        setError('root', {
          message:
            'Please correct the highlighted fields. No registration request was sent.',
        })
      })(event)
    } catch {
      setError('root', {
        message: 'The form could not be submitted. Please try again.',
      })
    } finally {
      submitting.current = false
    }
  }

  if (session) return <Navigate to="/" replace />

  return (
    <AuthLayout title="Create an account">
      <form
        noValidate
        onSubmit={(event) => void handleFormSubmit(event)}
        className="space-y-6"
        aria-busy={isSubmitting}
      >
        <fieldset disabled={isSubmitting} className="space-y-6">
          <AuthField
            label="Username"
            field={register('userName')}
            autoComplete="username"
            error={errors.userName?.message}
          />
          <AuthField
            label="Phone number"
            field={register('phoneNumber')}
            type="tel"
            autoComplete="tel"
            error={errors.phoneNumber?.message}
          />
          <AuthField
            label="Email"
            field={register('email')}
            type="email"
            autoComplete="email"
            error={errors.email?.message}
          />
          <AuthField
            label="Password"
            field={register('password')}
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
          />
          <AuthField
            label="Confirm password"
            field={register('confirmPassword')}
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-sm"
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </fieldset>
        {isSubmitting && (
          <p
            role="status"
            aria-live="polite"
            className="text-sm text-muted-foreground"
          >
            Sending registration request. Please wait…
          </p>
        )}
        {errors.root?.message && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}
      </form>
      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/login"
          className="ml-3 text-foreground underline underline-offset-4"
        >
          Log In
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register
