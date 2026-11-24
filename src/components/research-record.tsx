const adopters = [
  "Google",
  "Netflix",
  "Microsoft",
  "AstraZeneca",
  "Instacart",
  "Adobe",
  "Wayfair",
];

const citationBars = [8, 12, 16, 18, 22, 28, 34, 40, 48, 55, 62, 70, 78, 88, 100];

function Marker({ active = false }: { active?: boolean }) {
  return (
    <span
      className={`relative z-10 size-2 shrink-0 ${active ? "bg-foreground" : "bg-line-strong"}`}
    />
  );
}

export function ResearchRecord() {
  return (
    <section id="validation" className="mx-auto w-full max-w-[1440px] px-4 pt-40 pb-16 lg:px-9 lg:pt-64 lg:pb-24">
      <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        Foundational research applied at scale
      </p>

      <div className="mt-5 grid grid-cols-[auto_minmax(1.25rem,1fr)_auto_minmax(2.5rem,1.6fr)_auto_minmax(0.75rem,0.45fr)_auto] items-center gap-x-2 sm:gap-x-3">
        <span className="flex items-center gap-2">
          <Marker active />
          <span className="font-mono text-[0.75rem] text-foreground">2006</span>
        </span>
        <span className="h-px bg-foreground" />
        <span className="flex items-center gap-2">
          <Marker active />
          <span className="font-mono text-[0.75rem] text-foreground">2011</span>
        </span>
        <span className="relative flex items-center justify-evenly">
          <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
          {Array.from({ length: 8 }, (_, index) => (
            <Marker key={index} />
          ))}
        </span>
        <span className="flex items-center gap-2">
          <Marker active />
          <span className="font-mono text-[0.75rem] text-foreground">2025</span>
        </span>
        <span className="h-px bg-line" />
        <span className="flex items-center gap-2">
          <Marker active />
          <span className="font-mono text-[0.75rem] text-foreground">2026</span>
        </span>
      </div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
        <div className="grid gap-4">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            2006 – 2011
          </p>
          <p className="text-base leading-snug">
            Our chief scientist has a track record of identifying foundational problems
            in the field and providing fundamental solutions that
            are widely recognized and applied across industries.
          </p>
          <div className="bg-accent p-5 text-paper">
            <p className="text-lg leading-snug tracking-[-0.03em]">
              “Improved Algorithms for Linear Stochastic Bandits”
            </p>
            <p className="mt-3 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              3,006 citations
            </p>
          </div>
          <p className="text-sm leading-snug text-faint lg:text-base">
            OFUL introduces foundational online learning research.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="border border-line bg-surface p-5">
            <p className="text-sm leading-snug lg:text-base">
              OFUL becomes a basis for, and helps shape, billion-user-scale
              recommendation systems and methods now widely used across tech,
              science, pharmaceutical, manufacturing, and other industries.
            </p>
          </div>
          <div className="border border-line bg-surface p-5">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              Implemented for recommendation, personalization, and digital marketing by
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              {adopters.map((name) => (
                <li key={name} className="text-sm font-medium tracking-[-0.03em]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                OFUL / LinUCB citations
              </p>
              <p className="text-sm text-faint">Google Scholar</p>
            </div>
            <div
              className="mt-5 flex h-28 items-end gap-1"
              role="img"
              aria-label="OFUL and LinUCB citations rising from 2011 through 2026"
            >
              {citationBars.map((height, index) => (
                <span
                  key={index}
                  className="flex-1 bg-foreground"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-muted">
              <span>2011</span>
              <span>2026</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="bg-accent p-5 text-paper">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              2025
            </p>
            <p className="mt-2 text-lg leading-snug tracking-[-0.03em]">
              Hierarchical Reasoning Model
            </p>
            <p className="mt-3 text-sm leading-snug">
              Breakthrough AI architecture: a major milestone in recursive and
              hierarchical models.
            </p>
          </div>
          <div className="text-accent" aria-hidden>
            <svg viewBox="0 0 12 12" className="size-3">
              <path d="M6 1v8M2 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
          <div className="border border-line bg-surface p-5">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
              2026
            </p>
            <p className="mt-2 text-lg leading-snug tracking-[-0.03em]">
              OpenAI Astra is using recurrent reasoning.
            </p>
          </div>
          <p className="text-sm leading-snug text-faint lg:text-base">
            Resolves a decades-old bottleneck in training recursive models.
            Impressive performance on hard reasoning tasks.
          </p>
        </div>
      </div>
    </section>
  );
}
