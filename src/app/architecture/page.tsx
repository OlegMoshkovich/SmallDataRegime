import type { Metadata } from "next";
import { ArrowRight, Button } from "@/components/button";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "A bank employee chats with one orchestrator. It opens the right document, calls the right agent, and runs the model the privacy of the request allows.",
};

const governance = [
  {
    name: "Privacy",
    body: "Whether this request may leave the bank.",
  },
  {
    name: "Access",
    body: "Read, a draft, or a preview before a write.",
  },
  {
    name: "Budget",
    body: "A token cap on the use case.",
  },
];
const models = ["DeepSeek", "Qwen", "OpenAI"];

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

export default function ArchitecturePage() {
  return (
    <Interior
      eyebrow="For a bank"
      title="Chat with the orchestrator."
      lede="The orchestrator is the agent that holds the door. The person talks only to it. It opens the right document, calls the right agent, and runs the model the privacy of the request allows."
    >
      <div className="mb-10">
        <Button href="/demo">
          Try the chat <ArrowRight />
        </Button>
      </div>
      <figure
        className="border border-line bg-surface"
        aria-label="The orchestrator routes a fraud question to the anti-fraud agent, which opens KYC and AML, or sends a general question straight to a model. It also holds privacy, access, and budget."
      >
        <div className="grid gap-6 border-b border-line p-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:p-6">
          <div className="flex items-center gap-4">
            <div className="grid justify-items-center gap-2">
              <Person />
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                Question
              </p>
            </div>
            <Arrow />
            <div className="border border-foreground px-5 py-6">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                Orchestrator
              </p>
              <p className="mt-2 max-w-[14rem] text-sm leading-snug text-faint">
                Chooses an agent, or calls a model itself.
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
            <div className="border border-foreground px-4 py-4">
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
                Privacy, access, and budget still apply to the call.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-line p-4 lg:p-6">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            Model
          </p>
          <p className="mt-2 text-sm leading-snug text-faint">
            Both paths end here. The orchestrator picks the one the request is allowed to use.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {models.map((model) => (
              <li key={model} className="border border-line px-3 py-3 text-sm">
                {model}
              </li>
            ))}
          </ul>
        </div>
      </figure>

      <div className="mt-20 grid gap-16">
        <section className="border-t border-line pt-8">
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
            aria-label="A product calls one gateway. The use case keeps its risk, budget, and rules. The gateway picks a model and can fall back. The call is stored, judged, and sampled. A person owns a decision that changes a customer."
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
                        ["Voice", "Phone"],
                        ["App", "Assistant"],
                        ["Case", "Fraud"],
                        ["Offer", "Cross-sell"],
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
                    <div className="border border-foreground bg-surface px-4 py-4">
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
                          ["Rules", "What must stay with a person."],
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
                        ["Open models", "Heavy steps, on the bank’s own machines."],
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
                      <li className="border border-foreground bg-surface px-3 py-2 text-sm leading-snug">
                        A decision that changes a customer’s position stays with a person.
                      </li>
                    </ol>
                  </div>
                </li>
              </ol>
          </figure>
        </section>

        <section className="max-w-3xl border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            The experience
          </p>
          <h2 className="mt-3 text-2xl tracking-[-0.04em]">One conversation.</h2>
          <p className="mt-4 text-base leading-relaxed text-faint">
            The person does not open a specific system. They do not pick the agent
            for a document to retrieve, and they do not pick a model. They type into
            one chat. The orchestrator
            replies in that same chat, naming the document it opened and the agent
            that answered.
          </p>
        </section>

        <section className="border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            Examples
          </p>
          <h2 className="mt-3 text-2xl tracking-[-0.04em]">A few questions, one chat.</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-faint">
            A person asks, in the chat. This is the experience we envision, not a
            client of record.
          </p>
          <ol className="mt-8 grid max-w-3xl gap-4">
            <li className="border border-line bg-surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                A facility
              </p>
              <p className="mt-2 text-base">Can we waive the covenant on this facility?</p>
              <p className="mt-3 text-base leading-relaxed text-faint">
                The orchestrator opens the credit policy and the facility file where
                they already live. The question names a client, so the file does not
                leave the bank. It hands the question to Compliance. Compliance
                answers on Qwen 30B, on the bank’s machines.
              </p>
            </li>
            <li className="border border-line bg-surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                A document
              </p>
              <p className="mt-2 text-base">Find the policy that covers this covenant.</p>
              <p className="mt-3 text-base leading-relaxed text-faint">
                The orchestrator finds the document and opens it where it already
                lives. The passage comes back in the chat. The person does not open
                the system, and the file is not copied out.
              </p>
            </li>
            <li className="border border-line bg-surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                A fraud alert
              </p>
              <p className="mt-2 text-base">What should we do with this fraud alert?</p>
              <p className="mt-3 text-base leading-relaxed text-faint">
                The orchestrator opens the alert and the account activity, then hands
                the question to the anti-fraud agent. The agent drafts what it found.
                A person decides. Nothing is filed. The alert names a client, so the
                model stays on the bank’s machines.
              </p>
            </li>
            <li className="border border-line bg-surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                A public question
              </p>
              <p className="mt-2 text-base">
                How should we describe this product on the public site?
              </p>
              <p className="mt-3 text-base leading-relaxed text-faint">
                No client file is opened. The orchestrator may send that request to
                Claude.
              </p>
            </li>
          </ol>
        </section>

        <section className="max-w-3xl border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            What the orchestrator decides
          </p>
          <h2 className="mt-3 text-2xl tracking-[-0.04em]">Three choices, one door.</h2>
          <ol className="mt-8 grid gap-8">
            <li>
              <p className="font-mono text-[0.75rem] text-accent uppercase">01 Documents</p>
              <p className="mt-2 text-base leading-relaxed text-faint">
                It finds the document the question actually needs, and it opens it
                where it already lives. A policy in SharePoint stays in SharePoint. A
                facility file in the internal system stays there. The person receives
                the answer, not a second copy of the archive.
              </p>
            </li>
            <li>
              <p className="font-mono text-[0.75rem] text-accent uppercase">02 Agent</p>
              <p className="mt-2 text-base leading-relaxed text-faint">
                Compliance answers a covenant question. The notes taker drafts a
                meeting and waits for a person to file it. Customer support answers
                what a client would be told, and does not send it.
                The orchestrator picks the agent. The agent does not go looking for a
                document on its own.
              </p>
            </li>
            <li>
              <p className="font-mono text-[0.75rem] text-accent uppercase">03 Model</p>
              <p className="mt-2 text-base leading-relaxed text-faint">
                The agent runs on the model the request is allowed to use. If a
                client, a position, or a file that must stay inside is in the
                request, the model is one the bank hosts: Qwen 30B or DeepSeek. If
                the request carries none of that, the orchestrator may call a frontier
                model: Claude.
              </p>
            </li>
          </ol>
        </section>

        <section className="border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            The privacy rule
          </p>
          <h2 className="mt-3 max-w-3xl text-2xl tracking-[-0.04em]">
            The file decides the model. The person does not.
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="border border-line bg-surface p-5">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                Stays on the bank’s machines
              </p>
              <p className="mt-3 text-base leading-relaxed text-faint">
                Client files, positions, credit memos, and anything else the bank is
                not free to send out. The orchestrator opens them in place and the agent
                answers with an on-prem model. Qwen 30B and DeepSeek are the models
                for this class.
              </p>
            </article>
            <article className="border border-line bg-surface p-5">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                May leave
              </p>
              <p className="mt-3 text-base leading-relaxed text-faint">
                A question that opens no such material: wording, a public product, a
                general method. The orchestrator may call Claude. The frontier model
                never receives the file the on-prem path was built to keep.
              </p>
            </article>
          </div>
        </section>
      </div>
    </Interior>
  );
}
