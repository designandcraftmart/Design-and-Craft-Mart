import { useId, type ComponentProps } from "react";
import { controlClasses, describedBy, FieldShell } from "./Field";

export type TextareaProps = ComponentProps<"textarea"> & {
  label: string;
  helperText?: string;
  error?: string;
};

export default function Textarea({
  label,
  helperText,
  error,
  id,
  required,
  className = "",
  rows = 4,
  ...rest
}: TextareaProps) {
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
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, helperText, error)}
        className={`${controlClasses(Boolean(error))} min-h-28 resize-y py-3 ${className}`.trim()}
        {...rest}
      />
    </FieldShell>
  );
}
