import { useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { sessionStarted } from '@/features/auth/authSlice'
import { loginSchema } from '@/features/auth/authSchemas'
import type { LoginValues } from '@/features/auth/authSchemas'
import { loginAccount, getAuthErrors } from '@/features/auth/authApi'
import AuthLayout from '@/features/auth/AuthLayout'
import AuthField from '@/features/auth/AuthField'
import { Button } from '@/components/ui/button'

const Login = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.session)
  const submitting = useRef(false)
  const {
    register,
    handleSubmit,
    setError,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userName: '', password: '' },
  })

  const onSubmit = async (values: LoginValues) => {
    if (submitting.current) return
    submitting.current = true
    try {
      const session = await loginAccount(values)
      dispatch(sessionStarted(session))
    } catch (error) {
      const result = getAuthErrors(error)
      setError('root', { message: result.message })
      for (const field of ['userName', 'password'] as const) {
        if (result.fields[field])
          setError(field, { message: result.fields[field] })
      }
    } finally {
      resetField('password', { keepError: true })
      submitting.current = false
    }
  }

  if (session) return <Navigate to="/" replace />

  return (
    <AuthLayout title="Log in to FastCart">
      <form
        noValidate
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
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
            label="Password"
            field={register('password')}
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
          />
          {errors.root?.message && (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-sm"
          >
            {isSubmitting ? 'Signing in…' : 'Log In'}
          </Button>
        </fieldset>
      </form>
      <p className="text-sm text-muted-foreground">
        Don’t have an account?{' '}
        <Link
          to="/register"
          className="ml-3 text-foreground underline underline-offset-4"
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
