// Supported locales
export const locales = ["en", "vi"] as const
export type Locale = (typeof locales)[number]

// Default locale
export const defaultLocale: Locale = "en"

// Locale labels for UI
export const localeLabels: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
}

// Locale flags for UI (emoji)
export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  vi: "🇻🇳",
}
