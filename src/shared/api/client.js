import axios from 'axios'
import { store } from '@/app/store'
import {
  requestStarted,
  requestFinished,
} from '@/features/requests/requestsSlice'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://store-api.softclub.tj',
  timeout: 15000,
})

const getErrorMessage = (error) => {
  if (error.response?.status === 401) return 'Please sign in to continue.'
  if (error.response?.status === 403)
    return 'You do not have access to this action.'
  if (error.code === 'ECONNABORTED')
    return 'The request timed out. Please try again.'
  if (!error.response) return 'Unable to connect. Please try again.'
  return 'The request could not be completed. Please try again.'
}

api.interceptors.request.use((config) => {
  store.dispatch(requestStarted())
  return config
})

api.interceptors.response.use(
  (response) => {
    store.dispatch(requestFinished())
    const { statusCode, errors } = response.data || {}
    if (statusCode >= 400 || (Array.isArray(errors) && errors.length > 0)) {
      const error = new Error('The server could not complete the request.')
      error.status = statusCode
      return Promise.reject(error)
    }
    return response
  },
  (error) => {
    store.dispatch(requestFinished())
    if (axios.isCancel(error)) return Promise.reject(error)
    const requestError = new Error(getErrorMessage(error), { cause: error })
    requestError.status = error.response?.status
    return Promise.reject(requestError)
  },
)
