import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "ui-focus inline-flex select-none items-center justify-center gap-2 rounded-pill font-bold transition-[transform,background-color] motion-safe:duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-60";

// Text on the Sunset gradient is Ink, not white: white measures 1.8 to 3:1 on
// coral/amber, Ink measures 5.2 to 8.5:1.
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-sunset text-ink shadow-soft motion-safe:hover:-translate-y-0.5",
  secondary: "border-2 border-coral bg-white text-ink hover:bg-coral/10",
  ghost: "text-ink underline-offset-4 hover:bg-ink/5 hover:underline",
};

// Every size keeps a touch target of at least 44px (min-h-11).
const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-12 px-6 text-base",
  lg: "min-h-14 px-8 text-lg",
};

/** Class string for anything that must look like a Button, e.g. a Next.js <Link>. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Screen-reader text while loading, already translated by the caller. */
  loadingLabel?: string;
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingLabel,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...rest}
    >
      {loading && (
        <Loader2 aria-hidden className="size-5 motion-safe:animate-spin" />
      )}
      {children}
      {loading && loadingLabel ? (
        <span className="sr-only">{loadingLabel}</span>
      ) : null}
    </button>
  );
}
