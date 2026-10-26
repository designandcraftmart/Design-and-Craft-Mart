"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Accessible name for the close button, already translated. */
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Built on the native <dialog> element, which gives a real focus trap, Esc to
 * close, an inert page behind it, and returns focus to the trigger on close.
 * Bottom sheet below 640px, centered dialog above.
 */
export default function Modal({
  open,
  onClose,
  title,
  closeLabel,
  children,
  footer,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Stop the page behind the dialog from scrolling.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the dimmed backdrop land on the <dialog> itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className="ui-modal fixed inset-x-0 top-auto bottom-0 m-0 h-fit max-h-[88dvh] w-full max-w-none overflow-y-auto rounded-t-card border-0 bg-white p-0 text-ink shadow-soft backdrop:bg-ink/40 sm:inset-y-0 sm:m-auto sm:max-w-lg sm:rounded-card"
    >
      <div className="w-full p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-[26px] font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="ui-focus -me-2 inline-flex size-11 shrink-0 items-center justify-center rounded-pill hover:bg-ink/5"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="mt-3">{children}</div>
        {footer ? <div className="mt-6 flex flex-wrap gap-3">{footer}</div> : null}
      </div>
    </dialog>
  );
}
