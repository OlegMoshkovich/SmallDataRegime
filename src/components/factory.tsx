function Arrow({
  direction,
  className = "",
}: {
  direction: "up" | "down" | "left" | "right";
  className?: string;
}) {
  const rotation = { right: 0, down: 90, left: 180, up: 270 }[direction];

  return (
    <svg
      viewBox="0 0 16 16"
      className={`size-4 shrink-0 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      aria-hidden
    >
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col border border-line bg-surface">
      <p className="bg-sunken px-4 py-3 text-center text-sm font-medium tracking-[0.08em] uppercase">
        {title}
      </p>
      <div className="flex-1 px-4 py-4 text-sm leading-snug">{children}</div>
    </div>
  );
}

function Node({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-line-strong bg-surface px-3 py-2 text-center text-sm leading-snug">
      {children}
    </div>
  );
}

export function Factory() {
  return (
    <section id="factory" className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-9 lg:py-24">
      <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        Proprietory methods : Recursive self-improvement
      </p>

      <div className="mt-5 border border-line bg-sunken px-5 py-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[11rem_minmax(0,1fr)_auto_minmax(0,1.3fr)]">
          <p className="text-lg leading-snug tracking-[-0.03em]">
            Our planner vs typical agentic systems
          </p>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Node>State_Uncertainty_Goal</Node>
              <Arrow direction="right" className="text-accent" />
              <Node>Policy</Node>
              <Arrow direction="right" className="text-accent" />
              <Node>Action</Node>
              <Arrow direction="right" />
              <Node>Tools</Node>
            </div>
          </div>

          <span className="h-px bg-line-strong lg:h-16 lg:w-px lg:mx-8" />

          <div className="w-fit max-w-full">
            <div className="flex flex-wrap items-center gap-2">
              <Node>ChatGPT</Node>
              <Arrow direction="right" className="text-accent" />
              <Node>Skills</Node>
              <Arrow direction="right" />
              <Node>Tools</Node>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto] lg:gap-x-3 lg:gap-y-3">
        <div className="lg:col-start-3 lg:row-start-1">
          <Block title="Optimizer">
            Optimizes the components of the system to improve success criteria over
            training tasks. Based on Optimism in the Face of Uncertainty (OFU).
          </Block>
        </div>

        <div className="flex justify-center text-foreground lg:col-start-3 lg:row-start-2">
          <Arrow direction="down" className="text-accent" />
        </div>

        <div className="h-full self-stretch lg:col-start-1 lg:row-start-3">
          <Block title="Input">
            <ul className="grid gap-1.5">
              {["Instructions + documents", "Success criteria"].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[0.45rem] size-1.5 shrink-0 bg-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        <div className="flex justify-center text-foreground lg:col-start-2 lg:row-start-3">
          <Arrow direction="down" className="lg:hidden" />
          <Arrow direction="right" className="hidden lg:block" />
        </div>

        <div className="h-full self-stretch lg:col-start-3 lg:row-start-3">
          <Block title="Reasoning system">
            Infers goal and obligations, uncertainties, and memory, then solves a
            reasoning problem by exploring the solution space.
          </Block>
        </div>

        <div className="flex justify-center text-foreground lg:col-start-4 lg:row-start-3">
          <Arrow direction="down" className="lg:hidden" />
          <Arrow direction="right" className="hidden lg:block" />
        </div>

        <div className="h-full self-stretch lg:col-start-5 lg:row-start-3">
          <Block title="Output">
            The output is shaped according to the criteria. It could be a simple
            answer, a complex report, or a data room.
          </Block>
        </div>
      </div>
    </section>
  );
}
