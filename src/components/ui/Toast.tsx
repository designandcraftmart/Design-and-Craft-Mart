"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

type ToastItem = { id: number; type: ToastType; message: string };

type ToastApi = {
  show: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/** Call inside any Client Component under <ToastProvider>. */
export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
}

const styles: Record<ToastType, { bar: string; icon: ReactNode }> = {
  success: {
    bar: "bg-teal",
    icon: <CircleCheck aria-hidden className="size-6 text-[#0b5e56]" />,
  },
  error: {
    bar: "bg-coral",
    icon: <CircleAlert aria-hidden className="size-6 text-[#b4233a]" />,
  },
  info: {
    bar: "bg-sky",
    icon: <Info aria-hidden className="size-6 text-[#0b5f86]" />,
  },
};

const DURATION_MS = 6000;

export function ToastProvider({
  children,
  dismissLabel,
}: {
  children: ReactNode;
  /** Accessible name for the dismiss button, already translated. */
  dismissLabel: string;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current.slice(-3), { id, type, message }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DURATION_MS),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      dismiss,
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      info: (message) => show("info", message),
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className="toast-in pointer-events-auto flex w-full max-w-md items-center gap-3 overflow-hidden rounded-card bg-white py-3 pe-2 ps-0 shadow-soft"
          >
            <span aria-hidden className={`h-10 w-1.5 shrink-0 rounded-pill ${styles[toast.type].bar}`} />
            {styles[toast.type].icon}
            <p className="flex-1 font-semibold text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label={dismissLabel}
              className="ui-focus inline-flex size-11 shrink-0 items-center justify-center rounded-pill hover:bg-ink/5"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
