"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { House, MessageCircle, Menu, Store, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";

type Labels = {
  home: string;
  shop: string;
  chat: string;
  menu: string;
  howToOrder: string;
  about: string;
  contact: string;
  close: string;
  navLabel: string;
  languageLabel: string;
};

const itemClass =
  "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold text-ink transition-transform active:scale-[0.97]";

export default function BottomNav({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const pathname = usePathname();
  const base = `/${locale}`;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the menu after navigating, on Escape, or when tapping outside it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const items = [
    { href: base, label: labels.home, Icon: House, exact: true },
    { href: `${base}/shop`, label: labels.shop, Icon: Store, exact: false },
    {
      href: `${base}/chat`,
      label: labels.chat,
      Icon: MessageCircle,
      exact: false,
    },
  ];

  const menuLinks = [
    { href: `${base}/how-to-order`, label: labels.howToOrder },
    { href: `${base}/about`, label: labels.about },
    { href: `${base}/contact`, label: labels.contact },
  ];

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
    >
      {open && (
        <div
          id={panelId}
          className="mx-3 mb-2 rounded-card border border-ink/10 bg-white p-3 shadow-soft"
        >
          <ul>
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-11 items-center rounded-input px-3 font-semibold hover:bg-violet/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-ink/10 px-3 pt-3">
            <LanguageToggle locale={locale} label={labels.languageLabel} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center gap-1 rounded-pill px-3 font-semibold hover:bg-ink/5"
            >
              <X aria-hidden className="size-4" />
              {labels.close}
            </button>
          </div>
        </div>
      )}

      <nav
        aria-label={labels.navLabel}
        className="flex border-t border-ink/10 bg-white pb-[env(safe-area-inset-bottom)]"
      >
        {items.map(({ href, label, Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={itemClass}
            >
              <span
                className={`flex h-8 w-14 items-center justify-center rounded-pill ${
                  active ? "bg-violet/15" : ""
                }`}
              >
                <Icon aria-hidden className="size-5" />
              </span>
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          onClick={() => setOpen((value) => !value)}
          className={itemClass}
        >
          <span
            className={`flex h-8 w-14 items-center justify-center rounded-pill ${
              open ? "bg-violet/15" : ""
            }`}
          >
            <Menu aria-hidden className="size-5" />
          </span>
          {labels.menu}
        </button>
      </nav>
    </div>
  );
}
