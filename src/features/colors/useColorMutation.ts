import { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import { useAppDispatch } from '@/app/hooks'
import type { RootState } from '@/app/store'
import { ApiError } from '@/shared/api/types'
import { getColorError } from './colorsApi'
import { fetchColors } from './colorsSlice'

const useColorMutation = () => {
  const store = useStore<RootState>()
  const dispatch = useAppDispatch()
  const session = useRef(store.getState().auth.session)
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
    if (!session.current || store.getState().auth.session !== session.current) {
      setRefreshError('The session changed. Sign in again before reloading.')
      return
    }
    setRefreshError(null)
    const request = dispatch(fetchColors())
    const abort = () => request.abort()
    signal?.addEventListener('abort', abort, { once: true })
    try {
      const result = await request
      if (!signal?.aborted && !fetchColors.fulfilled.match(result))
        setRefreshError(
          'The color list could not be refreshed. Try loading it again.',
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
    const unsubscribe = store.subscribe(() => {
      if (store.getState().auth.session !== session.current) operation.abort()
    })
    try {
      if (!session.current || store.getState().auth.session !== session.current)
        throw new Error('Please sign in again before making changes.')
      const success = await action(operation.signal)
      if (operation.signal.aborted) return false
      blocked.current = true
      setLocked(true)
      setConfirmed(success)
      if (!success)
        setError(
          'The change could not be confirmed. Close and check the color list before trying again.',
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
      setError(getColorError(failure))
      if (
        failure instanceof ApiError &&
        (failure.status === undefined ||
          failure.status >= 500 ||
          failure.status === 408)
      ) {
        blocked.current = true
        setLocked(true)
        setError(
          `${getColorError(failure)} The result is unverified. Check the color list before trying again.`,
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
export default useColorMutation
