import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

/** Friendly error block with an optional retry action. Pass translated text. */
export default function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center rounded-card bg-[linear-gradient(135deg,rgba(255,93,115,0.12),rgba(255,176,32,0.14))] px-6 py-10 text-center"
    >
      <div
        aria-hidden
        className="flex size-16 items-center justify-center rounded-pill bg-white text-[#b4233a] shadow-soft"
      >
        <CircleAlert className="size-8" strokeWidth={1.75} />
      </div>
      <h2 className="mt-4 text-[26px] font-bold">{title}</h2>
      {description ? <p className="mt-1 max-w-sm text-lg">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
