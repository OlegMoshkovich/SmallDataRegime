export function Interior({
  eyebrow,
  title,
  lede,
  children,
  accent = false,
}: {
  eyebrow?: string;
  title?: string;
  lede?: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  const hasIntro = Boolean(eyebrow || title || lede);
  return (
    <article className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-9 lg:py-24">
      {hasIntro ? (
        <>
          {eyebrow ? (
            <p
              className={`font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${accent ? "text-accent" : "text-muted"}`}
            >
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h1 className="mt-4 max-w-3xl text-[2.125rem] leading-[1.08] tracking-[-0.045em] lg:text-[2.75rem]">
              {title}
            </h1>
          ) : null}
          {lede ? (
            <p className="mt-5 max-w-xl text-base leading-snug whitespace-pre-line text-faint">
              {lede}
            </p>
          ) : null}
        </>
      ) : null}
      <div className={hasIntro ? "mt-14" : undefined}>{children}</div>
    </article>
  );
}
