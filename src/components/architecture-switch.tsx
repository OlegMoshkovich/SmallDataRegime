"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/button";
import { AgentsPanel } from "@/components/agents-panel";
import { DemoChat } from "@/components/demo-chat";
import { GatewayDiagram } from "@/components/gateway-diagram";
import { ModelsPanel } from "@/components/models-panel";
import { PremisePanel } from "@/components/premise-panel";
import { SystemPath } from "@/components/system-path";

const views = [
  { id: "summary", label: "Summary" },
  { id: "gateway", label: "Gateway" },
  { id: "agents", label: "Agents" },
  { id: "models", label: "Models" },
  { id: "premise", label: "System" },
  { id: "trajectory", label: "Flow" },
  { id: "demo", label: "Demo" },
] as const;

type View = (typeof views)[number]["id"];

export function ArchitectureSwitch() {
  const [view, setView] = useState<View>("summary");

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setView("demo")}
          className="group relative inline-flex h-[31px] items-center justify-center overflow-hidden border border-transparent bg-ink px-3.5 font-mono text-[0.8125rem] leading-none tracking-[-0.0175rem] text-paper capitalize [--stripe:rgba(255,255,255,0.18)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Try the chat <ArrowRight />
          </span>
          <span
            aria-hidden
            className="stripe-hover pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
          />
        </button>
        <div className="ml-auto flex max-w-full flex-wrap border border-line" role="group" aria-label="View">
          {views.map((item, index) => {
            const selected = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setView(item.id)}
                className={`h-[31px] px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${
                  index > 0 ? "border-l border-line" : ""
                } ${selected ? "bg-foreground text-background" : "bg-surface text-muted"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      {view === "summary" ? (
        <div className="grid gap-16">
          <section className="max-w-3xl border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              The experience
            </p>
            <h2 className="mt-3 text-2xl tracking-[-0.04em]">One conversation.</h2>
            <p className="mt-4 text-base leading-relaxed text-faint">
              The person does not open a specific system. They do not pick the agent for a document
              to retrieve, and they do not pick a model. They type into one chat. The orchestrator
              replies in that same chat, naming the document it opened and the agent that answered.
            </p>
          </section>
          <section className="border-t border-line pt-8">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              Examples
            </p>
            <h2 className="mt-3 text-2xl tracking-[-0.04em]">A few questions, one chat.</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-faint">
              A person asks, in the chat. This is the experience we envision, not a client of
              record.
            </p>
            <ol className="mt-8 grid max-w-3xl gap-4">
              <li className="border border-line bg-surface p-4">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  A facility
                </p>
                <p className="mt-2 text-base">Can we waive the covenant on this facility?</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The orchestrator opens the credit policy and the facility file where they already
                  live. The question names a client, so the file does not leave the enterprise. It hands
                  the question to Compliance. Compliance answers on Qwen 30B, on the enterprise’s
                  machines.
                </p>
              </li>
              <li className="border border-line bg-surface p-4">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  A document
                </p>
                <p className="mt-2 text-base">Find the policy that covers this covenant.</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The orchestrator finds the document and opens it where it already lives. The
                  passage comes back in the chat. The person does not open the system, and the file
                  is not copied out.
                </p>
              </li>
              <li className="border border-line bg-surface p-4">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  A fraud alert
                </p>
                <p className="mt-2 text-base">What should we do with this fraud alert?</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The orchestrator opens the alert and the account activity, then hands the question
                  to the anti-fraud agent. The agent drafts what it found. A person decides. Nothing
                  is filed. The alert names a client, so the model stays on the enterprise’s machines.
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
                  No client file is opened. The orchestrator may send that request to Claude.
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
                  It finds the document the question actually needs, and it opens it where it
                  already lives. A policy in SharePoint stays in SharePoint. A facility file in the
                  internal system stays there. The person receives the answer, not a second copy of
                  the archive.
                </p>
              </li>
              <li>
                <p className="font-mono text-[0.75rem] text-accent uppercase">02 Agent</p>
                <p className="mt-2 text-base leading-relaxed text-faint">
                  Compliance answers a covenant question. The notes taker drafts a meeting and waits
                  for a person to file it. Customer support answers what a client would be told, and
                  does not send it. The orchestrator picks the agent. The agent does not go looking
                  for a document on its own.
                </p>
              </li>
              <li>
                <p className="font-mono text-[0.75rem] text-accent uppercase">03 Model</p>
                <p className="mt-2 text-base leading-relaxed text-faint">
                  The agent runs on the model the request is allowed to use. If a client, a
                  position, or a file that must stay inside is in the request, the model is one the
                  enterprise hosts: Qwen 30B or DeepSeek. If the request carries none of that, the
                  orchestrator may call a frontier model: Claude.
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
                  Stays on the enterprise’s machines
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  Client files, positions, credit memos, and anything else the enterprise is not free to
                  send out. The orchestrator opens them in place and the agent answers with an
                  on-prem model. Qwen 30B and DeepSeek are the models for this class.
                </p>
              </article>
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  May leave
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  A question that opens no such material: wording, a public product, a general
                  method. The orchestrator may call Claude. The frontier model never receives the
                  file the on-prem path was built to keep.
                </p>
              </article>
            </div>
          </section>
        </div>
      ) : null}
      {view === "gateway" ? <GatewayDiagram /> : null}
      {view === "trajectory" ? <SystemPath /> : null}
      {view === "agents" ? <AgentsPanel /> : null}
      {view === "premise" ? <PremisePanel /> : null}
      {view === "models" ? <ModelsPanel /> : null}
      {view === "demo" ? (
        <div className="flex flex-col lg:h-[calc(100dvh-72px)] lg:overflow-hidden">
          <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <div>
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                Demo
              </p>
              <h2 className="mt-1 text-2xl tracking-[-0.04em]">Ask the orchestrator.</h2>
            </div>
            <p className="hidden font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase lg:block">
              How the system operates
            </p>
          </div>
          <DemoChat embedded />
        </div>
      ) : null}
    </div>
  );
}
