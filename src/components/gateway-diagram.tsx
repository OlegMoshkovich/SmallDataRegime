const governance = [
  {
    name: "Risk",
    body: "What the use case is allowed to do.",
  },
  {
    name: "Budget",
    body: "How much the call may spend.",
  },
  {
    name: "Rules",
    body: "What must stay with a human.",
  },
];

const models = [
  ["Frontier APIs", "A new use case starts here."],
  ["Open models", "Heavy steps, on the enterprise’s own machines."],
  ["Shared model", "Used across fraud, cross-sell, and credit."],
];

function Question({ className = "h-10 w-10 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect x="1.5" y="1.5" width="45" height="45" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19 19.5c0-4.2 2.6-7 5.8-7 3.4 0 5.7 2.2 5.7 5.2 0 3.6-2.8 5-5.6 6.6-.4.2-.9.6-.9 1.2V29"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="24" cy="34.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Person({ className = "h-16 w-10 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 72" className={className} aria-hidden>
      <circle cx="24" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 70V42h28v28" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Arrow({ className = "h-4 w-8 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 16" className={className} aria-hidden>
      <path d="M0 8h26M20 2l8 6-8 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg viewBox="0 0 16 28" className="h-7 w-4 text-accent" aria-hidden>
      <path d="M8 0v22M2 16l6 8 6-8" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function GatewayDiagram() {
  return (
    <figure
      className="border border-line bg-surface"
      aria-label="A question enters one gateway. The gateway holds risk, budget, and rules, routes a fraud question to the anti-fraud agent, or sends a general question straight to a model. If the chosen model fails, the call moves to the fallback. The call is stored, judged, and sampled, and a human owns a decision that changes a customer."
    >
      <div className="grid gap-6 border-b border-line p-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:p-6">
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <div className="grid justify-items-center gap-2">
            <Person />
            <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
              Question
            </p>
          </div>
          <Arrow />
          <div className="border border-line px-5 py-6">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Gateway</p>
            <p className="mt-2 max-w-[16rem] text-sm leading-snug">
              One entry for every model call.
            </p>
            <p className="mt-1 max-w-[16rem] text-sm leading-snug text-faint">
              The product arrives here. If the chosen model fails, the call moves to the
              fallback.
            </p>
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-3">
          {governance.map((rule) => (
            <li key={rule.name} className="border border-line px-3 py-3">
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">
                {rule.name}
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">{rule.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="grid gap-4 border-b border-line p-4 lg:border-r lg:border-b-0 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="grid justify-items-center gap-1">
              <Question className="h-7 w-7 shrink-0" />
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                Fraud
              </p>
            </div>
            <Arrow className="h-4 w-8 shrink-0" />
            <div>
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                Through an agent
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">
                The question arrives on the case surface and is handed to the anti-fraud agent.
              </p>
            </div>
          </div>
          <div className="border border-line px-4 py-4">
            <p className="text-sm">Anti-fraud agent</p>
            <p className="mt-1 text-sm leading-snug text-faint">
              Opens the systems the question needs, then calls a model.
            </p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {["KYC", "AML"].map((system) => (
              <li key={system} className="border border-line px-3 py-3">
                <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                  MCP
                </p>
                <p className="mt-2 text-sm">{system}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-4 p-4 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="grid justify-items-center gap-1">
              <Question className="h-7 w-7 shrink-0" />
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                General
              </p>
            </div>
            <Arrow className="h-4 w-8 shrink-0" />
            <div>
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                Straight to a model
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">
                The question arrives on the chat surface and goes to a model.
              </p>
            </div>
          </div>
          <div className="border border-line px-4 py-4">
            <p className="text-sm">The orchestrator calls the model.</p>
            <p className="mt-1 text-sm leading-snug text-faint">
              Risk, budget, and rules still apply to the call.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-4 lg:p-6">
        <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">Model</p>
        <p className="mt-2 text-sm leading-snug text-faint">
          Both paths end here. The orchestrator picks the one the request is allowed to use.
        </p>
        <ol className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          {models.map(([name, body], index, list) => (
            <li key={name} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1 border border-line bg-surface px-3 py-3">
                <p className="text-sm">{name}</p>
                <p className="mt-1 text-sm leading-snug text-faint">{body}</p>
              </div>
              {index < list.length - 1 ? (
                <>
                  <div className="flex justify-center sm:hidden">
                    <ArrowDown />
                  </div>
                  <Arrow className="hidden h-4 w-8 shrink-0 text-accent sm:block" />
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-line p-4 lg:p-6">
        <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
          Record
        </p>
        <ol className="mt-4 grid gap-2">
          {[
            "The input and the output are stored, so the decision can be replayed.",
            "Judges score the live answer, including one judge for hallucination.",
            "People sample the chats. Each model is watched on its own.",
          ].map((item) => (
            <li key={item} className="border border-line bg-surface px-3 py-2 text-sm leading-snug">
              {item}
            </li>
          ))}
          <li className="border border-line bg-surface px-3 py-2 text-sm leading-snug">
            A decision that changes a customer’s position stays with a human.
          </li>
        </ol>
      </div>
    </figure>
  );
}
