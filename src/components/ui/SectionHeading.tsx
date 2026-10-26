import type { ReactNode } from "react";

export default function SectionHeading({
  title,
  subtitle,
  as: Tag = "h2",
  align = "start",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center" : ""}>
      <Tag className="text-[26px] font-bold text-balance lg:text-[40px]">
        {title}
      </Tag>
      <div
        aria-hidden
        className={`mt-2 h-1.5 w-16 rounded-pill bg-sunset ${centered ? "mx-auto" : ""}`}
      />
      {subtitle ? (
        <p
          className={`mt-3 max-w-2xl text-lg text-ink ${centered ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
