import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

/** Classes shared by Input, Textarea and Select. */
export function controlClasses(hasError: boolean) {
  return `ui-focus w-full rounded-input border-2 bg-white px-4 text-base text-ink placeholder:text-soft-gray ${
    hasError ? "border-[#b4233a]" : "border-ink/50 focus:border-teal"
  }`;
}

export function describedBy(id: string, helperText?: string, error?: string) {
  const ids = [];
  if (error) ids.push(`${id}-error`);
  if (helperText) ids.push(`${id}-help`);
  return ids.length ? ids.join(" ") : undefined;
}

/** Label above the control, helper text and inline error below it. */
export function FieldShell({
  id,
  label,
  required,
  helperText,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-semibold text-ink">
        {label}
        {required ? (
          <span aria-hidden className="ms-1 text-[#b4233a]">
            *
          </span>
        ) : null}
      </label>
      {children}
      {helperText ? (
        <p id={`${id}-help`} className="text-sm text-soft-gray">
          {helperText}
        </p>
      ) : null}
      {error ? (
        // Error text is a darker coral (#B4233A, 6.1:1 on cream); the bright
        // brand coral is only 2.8:1 and fails for small text.
        <p
          id={`${id}-error`}
          className="flex items-start gap-1.5 text-sm font-semibold text-[#b4233a]"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
