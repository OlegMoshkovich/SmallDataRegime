export function Interior({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-9 lg:py-24">
      <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl text-[2.125rem] leading-[1.08] tracking-[-0.045em] lg:text-[2.75rem]">
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-snug whitespace-pre-line text-faint">{lede}</p>
      <div className="mt-14">{children}</div>
    </article>
  );
}
