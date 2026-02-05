"use client"

import { useCallback } from "react"
import { useLocale as useNextIntlLocale } from "next-intl"

import { type Locale, locales, defaultLocale } from "@/i18n/config"

const LOCALE_COOKIE_NAME = "NEXT_LOCALE"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export function useLocale() {
  const locale = useNextIntlLocale() as Locale

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!locales.includes(newLocale)) {
        return
      }

      // Set cookie
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`

      // Refresh the page to apply new locale
      window.location.reload()
    },
    []
  )

  const toggleLocale = useCallback(() => {
    const currentIndex = locales.indexOf(locale)
    const nextIndex = (currentIndex + 1) % locales.length
    setLocale(locales[nextIndex])
  }, [locale, setLocale])

  return {
    locale,
    setLocale,
    toggleLocale,
    isPending: false,
    locales,
    defaultLocale,
  }
}
