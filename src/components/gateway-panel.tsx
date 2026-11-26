function Eyebrow({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
      <span className="size-1.5 bg-accent" aria-hidden />
      {children}
    </p>
  );
}

const lifecycle = [
  { name: "Question", note: "A human asks in the chat.", row: "bottom", tone: "ink" },
  { name: "Auth + policy", note: "Sign-in token, team, use case.", row: "top", tone: "accent" },
  { name: "Sensitivity", note: "Internal, then document search.", row: "bottom", tone: "accent" },
  { name: "Budget", note: "Tokens reserved.", row: "top", tone: "accent" },
  { name: "Search as user", note: "Top 8 chunks, own permissions.", row: "bottom", tone: "ink" },
  { name: "Generate, local", note: "Model proxy, then vLLM Qwen.", row: "top", tone: "ink" },
  { name: "Output guard", note: "No leaked identifiers.", row: "bottom", tone: "accent" },
  { name: "Stream answer", note: "SSE, with sources.", row: "top", tone: "accent" },
  { name: "Log", note: "Request log. Budget settled.", row: "bottom", tone: "accent" },
] as const;

function LifecycleLabel({ step }: { step: (typeof lifecycle)[number] }) {
  return (
    <>
      <p className="flex items-center justify-center gap-1.5 font-mono text-[0.65rem] tracking-[-0.01em] uppercase">
        <span className={`size-1.5 shrink-0 ${step.tone === "accent" ? "bg-accent" : "bg-foreground"}`} />
        {step.name}
      </p>
      <p className="mt-1 text-xs leading-snug text-faint">{step.note}</p>
    </>
  );
}

function RequestLifecycle() {
  const width = 1080;
  const height = 200;
  const peak = 36;
  const valley = 164;
  const xs = lifecycle.map((_, index) => ((index + 0.5) / lifecycle.length) * width);
  const yOf = (row: "top" | "bottom") => (row === "top" ? peak : valley);
  const points = lifecycle.map((step, index) => `${xs[index]},${yOf(step.row)}`).join(" ");

  return (
    <div className="mt-12">
      <Eyebrow>Request lifecycle</Eyebrow>
      <ol className="mt-8 lg:hidden">
        {lifecycle.map((step, index) => (
          <li key={step.name} className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`size-2.5 shrink-0 ${step.tone === "accent" ? "bg-accent" : "bg-foreground"}`}
              />
              {index < lifecycle.length - 1 ? <span className="w-px flex-1 bg-foreground" /> : null}
            </div>
            <div className="pb-5">
              <p className="font-mono text-[0.7rem] tracking-[-0.01em] uppercase">{step.name}</p>
              <p className="mt-1 text-sm leading-snug text-faint">{step.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 hidden lg:block">
        <div className="grid grid-cols-9">
          {lifecycle.map((step) => (
            <div key={step.name} className="px-1 text-center">
              {step.row === "top" ? <LifecycleLabel step={step} /> : null}
            </div>
          ))}
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="-my-px block h-auto w-full" aria-hidden>
          <polyline
            points={points}
            fill="none"
            stroke="#020202"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
          {lifecycle.map((step, index) => {
            const y = yOf(step.row);
            return (
              <g key={step.name}>
                <line
                  x1={xs[index]}
                  y1={y}
                  x2={xs[index]}
                  y2={step.row === "top" ? 0 : height}
                  stroke="#020202"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx={xs[index]} cy={y} r="4" fill="#020202" />
              </g>
            );
          })}
        </svg>
        <div className="grid grid-cols-9">
          {lifecycle.map((step) => (
            <div key={step.name} className="px-1 text-center">
              {step.row === "bottom" ? <LifecycleLabel step={step} /> : null}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm leading-snug text-faint">
        Orange steps run inside the gateway. Logging comes last, so a refused request is logged too.
      </p>
    </div>
  );
}

export function GatewayPanel() {
  return (
    <div className="grid min-w-0 gap-6 *:min-w-0">
      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>Gateway</Eyebrow>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["01", "Authenticate", "Validates the sign-in token or client credentials.", "auth · 401", ["Auth + policy"]],
            ["02", "Resolve identity", "Human, team, groups, and use case. Cached for five minutes.", "identity · 403", ["Auth + policy"]],
            ["03", "Load policy", "Compiled policy for this team and use case.", "policy · 403 policy_denied", ["Auth + policy"]],
            ["04", "Classify data", "Finds identifiers, account numbers, card numbers, and names, and sets sensitivity.", "sensitivity", ["Sensitivity"]],
            ["05", "Route", "Picks a model group, an agent, or a search.", "router · 422 no_route", []],
            ["06", "Check budget", "Reserves estimated tokens against the budget.", "budgets · 429", ["Budget"]],
            ["07", "Execute", "Calls the model proxy, an agent, or a search, and walks the fallbacks.", "executor · 503", ["Search as user", "Generate, local"]],
            ["08", "Guard output", "Blocks leaked identifiers and checks the output schema.", "guardrails · 422", ["Output guard"]],
            ["09", "Record", "Logs the route, model, tokens, cost, and latency, then settles the budget.", "audit", ["Log"]],
          ].map(([index, title, body, code, notes]) => {
            const marks = (notes as readonly string[]).map((name) => lifecycle.find((step) => step.name === name)!);
            const tone = marks.some((mark) => mark.tone === "accent") ? "accent" : marks.length ? "ink" : "line";
            return (
              <li
                key={index as string}
                className="border border-line px-4 py-3"
              >
                {marks.length ? (
                  <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.65rem] tracking-[-0.01em] uppercase">
                    {marks.map((mark) => (
                      <span key={mark.name} className="inline-flex items-center gap-1.5">
                        <span
                          className={`size-1.5 shrink-0 ${mark.tone === "accent" ? "bg-accent" : "bg-foreground"}`}
                        />
                        {mark.name}
                      </span>
                    ))}
                  </p>
                ) : null}
                <p className="font-mono text-[0.7rem] tracking-[-0.01em] uppercase">
                  {index as string} {title as string}
                </p>
                <p className="mt-2 text-sm leading-snug">{body as string}</p>
                <p className="mt-3 font-mono text-[0.7rem] tracking-[-0.01em] text-faint">{code as string}</p>
              </li>
            );
          })}
        </ol>
        <RequestLifecycle />
      </section>
    </div>
  );
}
