import { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import { useAppDispatch } from '@/app/hooks'
import type { RootState } from '@/app/store'
import { ApiError } from '@/shared/api/types'
import { getBrandError } from './brandsApi'
import { fetchBrands } from './brandsSlice'

const useBrandMutation = () => {
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
    const request = dispatch(fetchBrands())
    const abort = () => request.abort()
    signal?.addEventListener('abort', abort, { once: true })
    try {
      const result = await request
      if (!signal?.aborted && !fetchBrands.fulfilled.match(result))
        setRefreshError(
          'The brand list could not be refreshed. Reload the list before making more changes.',
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
          'The change could not be confirmed. Check the refreshed list before making another attempt.',
        )
      await reload(operation.signal)
      return success
    } catch (failure) {
      if (operation.signal.aborted) {
        blocked.current = true
        setLocked(true)
        setError(
          'The session changed or the request was stopped. Reload the list before continuing.',
        )
        return false
      }
      setError(getBrandError(failure))
      if (
        failure instanceof ApiError &&
        (failure.status === undefined ||
          failure.status >= 500 ||
          failure.status === 408)
      ) {
        blocked.current = true
        setLocked(true)
        setError(
          `${getBrandError(failure)} The result is unverified. Check the list before retrying.`,
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
  return { run, pending, locked, confirmed, error, refreshError, reload }
}
export default useBrandMutation
