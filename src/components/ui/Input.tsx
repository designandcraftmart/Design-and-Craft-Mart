import { useId, type ComponentProps } from "react";
import { controlClasses, describedBy, FieldShell } from "./Field";

export type InputProps = ComponentProps<"input"> & {
  label: string;
  helperText?: string;
  error?: string;
};

export default function Input({
  label,
  helperText,
  error,
  id,
  required,
  className = "",
  ...rest
}: InputProps) {
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
      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, helperText, error)}
        className={`${controlClasses(Boolean(error))} min-h-12 ${className}`.trim()}
        {...rest}
      />
    </FieldShell>
  );
}
