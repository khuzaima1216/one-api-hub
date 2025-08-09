import { createContext } from 'react'

export type Language = 'en' | 'zh'

export interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  getErrorMessage: (errorCode?: string, fallbackMessage?: string) => string
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)
