"use client"

import { useCallback } from "react"
import { Globe, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"
import { localeLabels, localeFlags, type Locale } from "@/i18n/config"
import { cn } from "@/utils/cn"

interface LanguageSwitcherProps {
  variant?: "default" | "minimal" | "dropdown"
  className?: string
}

export function LanguageSwitcher({ variant = "default", className }: LanguageSwitcherProps) {
  const { locale, setLocale, isPending, locales } = useLocale()

  const handleChange = useCallback(
    (newLocale: Locale) => {
      if (newLocale !== locale) {
        setLocale(newLocale)
      }
    },
    [locale, setLocale]
  )

  // Minimal variant - just shows current locale with flag
  if (variant === "minimal") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleChange(locale === "en" ? "vi" : "en")}
        disabled={isPending}
        className={cn("gap-2", className)}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>{localeFlags[locale]}</span>
            <span className="hidden sm:inline">{localeLabels[locale]}</span>
          </>
        )}
      </Button>
    )
  }

  // Dropdown variant - shows all options
  if (variant === "dropdown") {
    return (
      <div className={cn("relative inline-block", className)}>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          {locales.map((loc) => (
            <Button
              key={loc}
              variant={locale === loc ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleChange(loc)}
              disabled={isPending}
              className={cn(
                "gap-1.5 px-2 py-1 text-xs",
                locale === loc && "bg-primary/10 text-primary"
              )}
            >
              {isPending && locale === loc ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <span>{localeFlags[loc]}</span>
                  <span>{localeLabels[loc]}</span>
                  {locale === loc && <Check className="h-3 w-3" />}
                </>
              )}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // Default variant - icon button that cycles through locales
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => handleChange(locale === "en" ? "vi" : "en")}
      disabled={isPending}
      className={cn("relative", className)}
      aria-label={`Change language (current: ${localeLabels[locale]})`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Globe className="h-4 w-4" />
          <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">
            {localeFlags[locale]}
          </span>
        </>
      )}
    </Button>
  )
}
