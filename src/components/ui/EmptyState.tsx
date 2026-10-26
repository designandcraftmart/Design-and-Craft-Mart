import type { ReactNode } from "react";
import { MessageCircleHeart } from "lucide-react";

/** Friendly "nothing here yet" block. Pass translated text; action is usually a Button. */
export default function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-card bg-[linear-gradient(135deg,rgba(124,77,255,0.1),rgba(56,189,248,0.12))] px-6 py-10 text-center">
      <div
        aria-hidden
        className="flex size-16 items-center justify-center rounded-pill bg-white text-violet shadow-soft"
      >
        {icon ?? <MessageCircleHeart className="size-8" strokeWidth={1.75} />}
      </div>
      <h2 className="mt-4 text-[26px] font-bold">{title}</h2>
      {description ? <p className="mt-1 max-w-sm text-lg">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
