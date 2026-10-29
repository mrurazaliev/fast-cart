import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loginSchema } from '@/features/auth/authSchemas'
import type { LoginValues } from '@/features/auth/authSchemas'
import { getAuthErrors, loginAccount } from '@/features/auth/authApi'
import { sessionStarted } from '@/features/auth/authSlice'
import { getAdminReturnPath } from '@/features/auth/loginReturn'
import AuthField from '@/features/auth/AuthField'
import Logo from '@/shared/components/Logo'
import { Button } from '@/components/ui/button'
import { productSaveNoticeSet } from '@/features/products/productsSlice'

const Login = () => {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.auth.session)
  const saveNotice = useAppSelector((state) => state.products.saveNotice)
  const location = useLocation()
  const submitting = useRef(false)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userName: '', password: '' },
  })

  const onSubmit = async (values: LoginValues) => {
    try {
      const nextSession = await loginAccount(values)
      reset()
      dispatch(sessionStarted(nextSession))
    } catch (error) {
      const result = getAuthErrors(error)
      setError('root', { message: result.message })
      for (const field of ['userName', 'password'] as const) {
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
      await handleSubmit(onSubmit)(event)
    } finally {
      submitting.current = false
    }
  }

  if (session)
    return <Navigate to={getAdminReturnPath(location.state)} replace />

  return (
    <main className="grid min-h-svh lg:grid-cols-[53.125%_46.875%]">
      <section
        aria-label="FastCart administration"
        className="flex flex-col justify-center gap-5 bg-[#1c2536] bg-[radial-gradient(ellipse_at_top_left,#183e47,transparent_65%)] px-6 py-10 text-white sm:px-12 lg:px-16"
      >
        <p className="text-xl font-medium sm:text-2xl">
          Welcome to admin panel
        </p>
        <Logo large />
      </section>
      <section
        aria-labelledby="login-heading"
        className="flex items-center justify-center px-6 py-12 sm:px-10"
      >
        <div className="w-full max-w-[400px] space-y-5">
          <h1 id="login-heading" className="text-2xl font-semibold">
            Log in
          </h1>
          {saveNotice && (
            <div
              role="alert"
              className="space-y-2 rounded-sm border border-amber-300 p-3 text-sm"
            >
              <p>{saveNotice}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch(productSaveNoticeSet(null))}
              >
                Dismiss save notice
              </Button>
            </div>
          )}
          <form
            noValidate
            onSubmit={(event) => void handleFormSubmit(event)}
            aria-busy={isSubmitting}
            className="space-y-6"
          >
            <fieldset disabled={isSubmitting} className="space-y-5">
              <AuthField
                label="Username"
                field={register('userName')}
                autoComplete="username"
                error={errors.userName?.message}
              />
              <div className="relative">
                <AuthField
                  label="Password"
                  field={register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={errors.password?.message}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </Button>
              </div>
              <p className="py-2 text-center text-xs text-muted-foreground">
                Password recovery is unavailable. Contact your administrator.
              </p>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[54px] w-full rounded-sm text-base"
              >
                {isSubmitting ? 'Signing in…' : 'Log in'}
              </Button>
            </fieldset>
            {isSubmitting && (
              <p role="status" className="text-sm text-muted-foreground">
                Signing in. Admin access will be checked separately.
              </p>
            )}
            {errors.root?.message && (
              <p role="alert" className="text-sm text-destructive">
                {errors.root.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login
