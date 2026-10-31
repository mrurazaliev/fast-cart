import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ru from './ru.json'
import tg from './tg.json'

export type Language = 'en' | 'ru' | 'tg'
export const languageKey = 'fastcart-language'
export const isLanguage = (value: unknown): value is Language =>
  value === 'en' || value === 'ru' || value === 'tg'

const readLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(languageKey)
    return isLanguage(saved) ? saved : 'en'
  } catch {
    return 'en'
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    tg: { translation: tg },
  },
  lng: readLanguage(),
  supportedLngs: ['en', 'ru', 'tg'],
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  initAsync: false,
  interpolation: { escapeValue: false },
  returnNull: false,
})

const applyLanguage = (language: string) => {
  if (typeof document !== 'undefined') document.documentElement.lang = language
  try {
    localStorage.setItem(languageKey, language)
  } catch {
    return
  }
}

i18n.on('languageChanged', applyLanguage)
applyLanguage(i18n.resolvedLanguage || 'en')

if (typeof window !== 'undefined')
  window.addEventListener('storage', (event) => {
    if (event.key === languageKey)
      void i18n.changeLanguage(
        isLanguage(event.newValue) ? event.newValue : 'en',
      )
  })

export const getLocale = () =>
  ({ en: 'en-US', ru: 'ru-RU', tg: 'tg-TJ' })[i18n.resolvedLanguage || 'en'] ||
  'en-US'
export default i18n
