import type { ComponentProps } from "react";

export type ChipColor =
  | "coral"
  | "amber"
  | "teal"
  | "violet"
  | "sky"
  | "neutral";

// Pastel tint (10-15% of the brand color) with a matching dark text color.
// All pairs measure at least 5.9:1 on white and cream.
const colors: Record<ChipColor, string> = {
  coral: "bg-coral/15 text-[#9f1f35]",
  amber: "bg-amber/15 text-[#7a4b00]",
  teal: "bg-teal/15 text-[#0b5e56]",
  violet: "bg-violet/15 text-[#4b23b8]",
  sky: "bg-sky/15 text-[#0b5f86]",
  neutral: "bg-ink/10 text-ink",
};

export default function Chip({
  color = "violet",
  className = "",
  children,
  ...rest
}: ComponentProps<"span"> & { color?: ChipColor }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-pill px-3 text-sm font-semibold ${colors[color]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
