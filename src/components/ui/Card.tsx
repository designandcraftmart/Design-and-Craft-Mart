import type { ComponentProps } from "react";

export type CardProps = ComponentProps<"div"> & {
  /** Lifts 4px on hover. Turn off for cards that are not clickable. */
  lift?: boolean;
};

export default function Card({
  lift = true,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-card bg-white shadow-soft ${
        lift
          ? "motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1"
          : ""
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
