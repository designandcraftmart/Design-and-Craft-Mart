import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import type { Locale } from "./i18n";
import type en from "@/dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  bn: () => import("@/dictionaries/bn.json").then((m) => m.default),
};

/** Resolves the locale from the /[lang] route and returns its dictionary. */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (value !== "en" && value !== "bn") notFound();
  return value;
}

export async function getDictionary(): Promise<{
  locale: Locale;
  dict: Dictionary;
}> {
  const locale = await getLocale();
  return { locale, dict: await dictionaries[locale]() };
}
