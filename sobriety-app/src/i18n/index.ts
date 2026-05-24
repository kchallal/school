import fr from './fr'

const translations = { fr } as const
type Lang = keyof typeof translations
type TranslationKey = keyof typeof fr

let currentLang: Lang = 'fr'

export function setLang(lang: Lang) {
  currentLang = lang
}

export function t(key: TranslationKey): string {
  return translations[currentLang][key] ?? key
}
