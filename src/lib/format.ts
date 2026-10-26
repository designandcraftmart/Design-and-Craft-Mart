import type { Locale } from "./i18n";

/** 450 -> "450" in English, "৪৫০" in Bangla. */
export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}
