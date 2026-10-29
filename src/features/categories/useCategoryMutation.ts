import { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import { useAppDispatch } from '@/app/hooks'
import type { RootState } from '@/app/store'
import { ApiError } from '@/shared/api/types'
import { getCategoryError } from './categoriesApi'
import { fetchCategories } from './categoriesSlice'

const useCategoryMutation = () => {
  const store = useStore<RootState>()
  const dispatch = useAppDispatch()
  const initialSession = useRef(store.getState().auth.session)
  const controller = useRef<AbortController | null>(null)
  const running = useRef(false)
  const blocked = useRef(false)
  const [pending, setPending] = useState(false)
  const [locked, setLocked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  useEffect(() => () => controller.current?.abort(), [])

  const reload = async (signal?: AbortSignal) => {
    if (signal?.aborted) return
    if (
      !initialSession.current ||
      store.getState().auth.session !== initialSession.current
    ) {
      setRefreshError('The session changed. Sign in again before reloading.')
      return
    }
    setRefreshError(null)
    const request = dispatch(fetchCategories())
    const abort = () => request.abort()
    signal?.addEventListener('abort', abort, { once: true })
    try {
      const result = await request
      if (!signal?.aborted && !fetchCategories.fulfilled.match(result))
        setRefreshError(
          'The category list could not be refreshed. Try loading it again.',
        )
    } finally {
      signal?.removeEventListener('abort', abort)
    }
  }

  const run = async (action: (signal: AbortSignal) => Promise<boolean>) => {
    if (running.current || blocked.current) return false
    running.current = true
    setPending(true)
    setError(null)
    const operation = new AbortController()
    controller.current = operation
    const session = store.getState().auth.session
    const unsubscribe = store.subscribe(() => {
      if (store.getState().auth.session !== session) operation.abort()
    })
    try {
      if (!session || session !== initialSession.current)
        throw new Error('Please sign in again before making changes.')
      const success = await action(operation.signal)
      if (operation.signal.aborted) return false
      blocked.current = true
      setLocked(true)
      setConfirmed(success)
      if (!success)
        setError(
          'The server did not confirm the change. Reload and check the list before making another attempt.',
        )
      await reload(operation.signal)
      return success
    } catch (failure) {
      if (operation.signal.aborted) {
        setError(
          'The session changed or the request was stopped. Reload the list before continuing.',
        )
        setLocked(true)
        blocked.current = true
        return false
      }
      setError(getCategoryError(failure))
      if (
        failure instanceof ApiError &&
        (failure.status === undefined ||
          failure.status >= 500 ||
          failure.status === 408)
      ) {
        setLocked(true)
        blocked.current = true
        setError(
          `${getCategoryError(failure)} The result is unverified. Reload and check the list before retrying.`,
        )
        await reload(operation.signal)
      }
      return false
    } finally {
      unsubscribe()
      controller.current = null
      running.current = false
      setPending(false)
    }
  }
  return { run, pending, locked, error, confirmed, refreshError, reload }
}

export default useCategoryMutation
