import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";

/** Placeholder: links to the chat page. Chat logic arrives in a later task. */
export default async function FloatingChatButton() {
  const { locale, dict } = await getDictionary();

  return (
    <Link
      href={`/${locale}/chat`}
      aria-label={dict.floatingChat.label}
      className="fixed right-4 bottom-24 z-30 inline-flex min-h-14 min-w-14 items-center justify-center gap-2 rounded-pill bg-sunset px-4 font-semibold text-ink shadow-soft transition-transform hover:-translate-y-1 active:scale-[0.97] lg:right-6 lg:bottom-6"
    >
      <MessageCircle aria-hidden className="size-6" />
      <span className="hidden lg:inline">{dict.floatingChat.label}</span>
    </Link>
  );
}
