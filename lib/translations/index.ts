import { uzTranslations } from "./uz"

export const translations = {
  uz: uzTranslations,
}

export type Language = keyof typeof translations
export type TranslationPath = string

// Helper function to get nested translation
export function getTranslation(lang: Language, path: string): string {
  const keys = path.split(".")
  let current: any = translations[lang]

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return path // Return the path if translation not found
    }
  }

  return typeof current === "string" ? current : path
}

// Hook for translations
export function useTranslation(lang: Language = "uz") {
  return {
    t: (path: string) => getTranslation(lang, path),
    lang,
  }
}
