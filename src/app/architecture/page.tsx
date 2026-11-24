import type { Metadata } from "next";
import { ArchitectureSwitch } from "@/components/architecture-switch";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "An enterprise employee chats with one orchestrator. It opens the right document, calls the right agent, and runs the model the privacy of the request allows.",
};

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

export default function ArchitecturePage() {
  return (
    <article className="bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
      <ArchitectureSwitch />

      <div className="mt-20 grid gap-16">
        <section className="hidden border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            A use case
          </p>
          <h2 className="mt-3 max-w-3xl text-2xl tracking-[-0.04em]">
            One gateway for the use case.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-faint">
            A product calls a model through one door. The use case keeps the risk,
            the budget, and the rules.
          </p>

          <figure
            className="mt-10 border border-line"
            aria-label="A product calls one gateway. The use case keeps its risk, budget, and rules. The gateway picks a model and can fall back. The call is stored, judged, and sampled. A human owns a decision that changes a customer."
          >
              <div className="border-b border-line px-4 py-5 lg:px-6">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                  The call
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-snug text-faint">
                  One path. A product enters the gateway, the use case carries the
                  rules, a model answers, and the answer is kept.
                </p>
              </div>
              <ol>
                <li className="border-b border-line">
                  <div className="grid gap-4 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] lg:p-6">
                    <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                      01 Surfaces
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        ["Chat", "Support chat"],
                        ["Case", "Fraud"],
                        ["File", "Credit"],
                      ].map(([surface, product]) => (
                        <li
                          key={surface}
                          className="flex items-center gap-3 border border-line bg-surface px-3 py-3"
                        >
                          <div className="grid justify-items-center gap-1">
                            <Person className="h-10 w-6" />
                            <p className="font-mono text-[0.6rem] tracking-[-0.01em] text-muted uppercase">
                              {surface}
                            </p>
                          </div>
                          <Arrow className="h-4 w-6 shrink-0" />
                          <p className="text-sm">{product}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-center border-t border-line py-3">
                    <ArrowDown />
                  </div>
                </li>
                <li className="border-b border-line">
                  <div className="grid gap-4 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] lg:p-6">
                    <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                      02 Gateway
                    </p>
                    <div className="border border-line bg-surface px-4 py-4">
                      <p className="text-sm">One entry for every model call.</p>
                      <p className="mt-1 text-sm leading-snug text-faint">
                        The product arrives here. If the chosen model fails, the call
                        moves to the fallback.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center border-t border-line py-3">
                    <ArrowDown />
                  </div>
                </li>
                <li className="border-b border-line">
                  <div className="grid gap-4 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] lg:p-6">
                    <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                      03 Governance
                    </p>
                    <div>
                      <ol className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        {[
                          ["Risk", "What the use case is allowed to do."],
                          ["Budget", "How much the call may spend."],
                          ["Rules", "What must stay with a human."],
                        ].map(([name, body], index, list) => (
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
                      <p className="mt-3 text-sm leading-snug text-faint">
                        The policy sits on the use case. A new model inherits it.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center border-t border-line py-3">
                    <ArrowDown />
                  </div>
                </li>
                <li className="border-b border-line">
                  <div className="grid gap-4 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] lg:p-6">
                    <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                      04 Model
                    </p>
                    <ol className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      {[
                        ["Frontier APIs", "A new use case starts here."],
                        ["Open models", "Heavy steps, on the enterprise’s own machines."],
                        ["Shared model", "Used across fraud, cross-sell, and credit."],
                      ].map(([name, body], index, list) => (
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
                  <div className="flex justify-center border-t border-line py-3">
                    <ArrowDown />
                  </div>
                </li>
                <li>
                  <div className="grid gap-4 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] lg:p-6">
                    <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                      05 Record
                    </p>
                    <ol className="grid gap-2">
                      {[
                        "The input and the output are stored, so the decision can be replayed.",
                        "Judges score the live answer, including one judge for hallucination.",
                        "People sample the chats. Each model is watched on its own.",
                      ].map((item) => (
                        <li
                          key={item}
                          className="border border-line bg-surface px-3 py-2 text-sm leading-snug"
                        >
                          {item}
                        </li>
                      ))}
                      <li className="border border-line bg-surface px-3 py-2 text-sm leading-snug">
                        A decision that changes a customer’s position stays with a human.
                      </li>
                    </ol>
                  </div>
                </li>
              </ol>
          </figure>
        </section>
      </div>
      </div>
    </article>
  );
}
