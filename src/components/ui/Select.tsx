import { useId, type ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { controlClasses, describedBy, FieldShell } from "./Field";

export type SelectProps = ComponentProps<"select"> & {
  label: string;
  helperText?: string;
  error?: string;
};

/** Native <select>, so it works with every keyboard and screen reader. Pass <option>s as children. */
export default function Select({
  label,
  helperText,
  error,
  id,
  required,
  className = "",
  children,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <FieldShell
      id={inputId}
      label={label}
      required={required}
      helperText={helperText}
      error={error}
    >
      <div className="relative">
        <select
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(inputId, helperText, error)}
          className={`${controlClasses(Boolean(error))} min-h-12 appearance-none pe-12 ${className}`.trim()}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-ink"
        />
      </div>
    </FieldShell>
  );
}
