import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: ButtonProps) {
  const tone =
    variant === "solid"
      ? "border-transparent bg-ink text-paper [--stripe:rgba(255,255,255,0.18)]"
      : "border-line-strong bg-background text-foreground [--stripe:rgba(0,0,0,0.14)]";

  return (
    <Link
      href={href}
      className={`group relative inline-flex h-[31px] items-center justify-center overflow-hidden border px-3.5 font-mono text-[0.8125rem] leading-none tracking-[-0.0175rem] uppercase ${tone} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        aria-hidden
        className="stripe-hover pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
      />
    </Link>
  );
}

export function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
