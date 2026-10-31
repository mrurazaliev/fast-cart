import { useTranslation } from 'react-i18next'
import i18n from './i18n'
import en from './en.json'

type Values = Record<string, string | number | boolean | null | undefined>

const patterns = Object.keys(en)
  .filter((key) => key.includes('{{'))
  .map((key) => {
    const names = [...key.matchAll(/\{\{(\w+)\}\}/g)].map(
      (match) => match[1] || '',
    )
    const source = key
      .split(/\{\{\w+\}\}/g)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('(.+?)')
    return { key, names, expression: new RegExp(`^${source}$`, 's') }
  })

export const translateText = (value: unknown, values?: Values): string => {
  if (typeof value !== 'string') return value == null ? '' : String(value)
  if (i18n.exists(value))
    return i18n.t(value, { ...values, defaultValue: value })
  for (const pattern of patterns) {
    const match = pattern.expression.exec(value)
    if (!match) continue
    const variables: Values = {}
    pattern.names.forEach((name, index) => {
      const captured = match[index + 1] || ''
      variables[name] = i18n.exists(captured) ? i18n.t(captured) : captured
    })
    return i18n.t(pattern.key, { ...variables, defaultValue: value })
  }
  return value
}

export const useText = () => {
  useTranslation()
  return { t: translateText }
}
