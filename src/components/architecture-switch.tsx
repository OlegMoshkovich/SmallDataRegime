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
          <section className="w-full border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              The experience
            </p>
            <h2 className="mt-3 max-w-4xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
              One gateway, on the enterprise’s machines.
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-faint">
              Staff type into one chat. Applications call one API. Both reach the same gateway.
              The person does not open a system, pick an agent, or pick a model. The orchestrator
              replies in that same chat, naming the document it opened and the agent that answered.
              Behind the chat, the gateway decides every request.
            </p>
            <p className="mt-3 max-w-4xl text-base leading-relaxed text-faint">
              We write it in TypeScript and ship it as containers. Agent harnesses, document
              retrieval, and the local models run beside the gateway, next to the GPUs. Who may see
              what, which model serves each use case, the budgets, and the logging are
              configuration, reviewed like code.
            </p>

            <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {[
                [
                  "One door",
                  "Every model call, agent run, and document lookup goes through the gateway. Applications call the gateway. The gateway calls the model.",
                ],
                [
                  "Data stays home",
                  "A request leaves the enterprise only when policy allows it and the sensitivity check passes. Customer files stay on the enterprise’s machines.",
                ],
                [
                  "Governance is configuration",
                  "Teams, model groups, use cases, budgets, and logging live in versioned files. A file that fails validation is rejected, and the last good policy stays active.",
                ],
                [
                  "Everything is replayable",
                  "Each request and each agent step is logged with its inputs, model, tools, and output. A run can be replayed against a new model or prompt and compared with the original.",
                ],
                [
                  "Modules work alone",
                  "The gateway, the compliance agent, document search, and text-to-SQL can each be piloted on their own.",
                ],
                [
                  "Build on what exists",
                  "We keep the enterprise’s single sign-on, document permissions, and Kubernetes.",
                ],
              ].map(([title, body]) => (
                <article key={title} className="bg-surface p-5">
                  <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">{title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-faint">{body}</p>
                </article>
              ))}
            </div>

            <div className="mt-12">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                Scope
              </p>
              <h3 className="mt-3 text-2xl tracking-[-0.04em]">The first pilot, then what follows.</h3>
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-faint">
                The first two weeks start once the enterprise has the machines, a sign-in
                application, and read access to one document site and one database. At the end of
                that pilot there is one URL, one API, two working products, a log of every request,
                and a baseline score for each model.
              </p>
              <div className="mt-6 overflow-x-auto border border-line">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                    <tr>
                      <th className="px-4 py-3 font-normal">Area</th>
                      <th className="px-4 py-3 font-normal">In the first two weeks</th>
                      <th className="px-4 py-3 font-normal">Later</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Access", "Chat at one internal URL, and an API existing tools already speak", "A chat tool and an IDE plugin"],
                      ["Gateway", "Sign-in, policy, a router, budgets, and logging", "More than one copy on Kubernetes, and a recovery path"],
                      ["Products", "A compliance agent and document search", "Text-to-SQL on a semantic layer, and a coding assistant"],
                      ["Connectors", "One document store, and one read-only database", "More document stores, chat, and core enterprise events"],
                      ["Models", "Two local models, and one external frontier model behind a flag", "Fine-tuned models, and more GPU pools"],
                    ].map(([area, now, later]) => (
                      <tr key={area} className="border-t border-line align-top">
                        <th className="px-4 py-3 text-left font-normal">{area}</th>
                        <td className="px-4 py-3 text-faint">{now}</td>
                        <td className="px-4 py-3 text-faint">{later}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                A request
              </p>
              <h3 className="mt-3 text-2xl tracking-[-0.04em]">Nine stages, in this order.</h3>
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-faint">
                The gateway is a stateless service. Policy, logs, and runs live in Postgres. Caches
                and budget counters live in Redis. Chat answers stream back. The output check reads
                the answer as it arrives, then the full text before the last event. Logging happens
                last, so a failed or blocked request is logged too.
              </p>
              <ol className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["01 Authenticate", "The person’s sign-in token, or the application’s credentials."],
                  ["02 Identity", "The person, their team, their groups, and the use case."],
                  ["03 Policy", "The compiled rules for that team and use case."],
                  ["04 Sensitivity", "Identifiers, account numbers, card numbers, names, and document labels set how sensitive the request is."],
                  ["05 Route", "A model group, an agent, or a search. The match cannot override where the data is allowed to run."],
                  ["06 Budget", "The estimated tokens are reserved against the team and the use case. At the limit, the request waits until the reset."],
                  ["07 Execute", "Call the model, start an agent, or search. If a model fails, the next in the chain answers. A local route stays local."],
                  ["08 Guard", "Leaked identifiers and claims the policy does not allow are blocked. Structured output is checked against its schema."],
                  ["09 Record", "Request, route, model, tokens, cost, latency, policy version, and a content hash. The budget is settled."],
                ].map(([title, body]) => (
                  <li key={title} className="bg-surface p-5">
                    <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                      {title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-faint">{body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Where it runs
                </p>
                <h3 className="mt-3 text-2xl tracking-[-0.04em]">The file sets the locality.</h3>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The router picks what serves the request, then applies a hard rule for where it
                  may run. A use case can only tighten that rule. Customer data stays local. A
                  confidential draft stays local unless that use case names an external model.
                  Internal questions try local first. A public question may use a local or an
                  external model. Financial-crime use cases stay local at every level.
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  A named use case goes straight to its agent. Otherwise the request is compared
                  with examples for each route, then a small local model chooses, and a general
                  local chat route catches what is still unsure. Each model group has an ordered
                  fallback. An external model may fall back to a local one. A failed model is
                  skipped for a short time, and each model is watched on its own.
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Products
                </p>
                <h3 className="mt-3 text-2xl tracking-[-0.04em]">Search, then a compliance agent.</h3>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  Document search has two paths. Live search asks the document store with the person’s
                  own token, so a file they cannot open never reaches the model. An index keeps changed
                  files, splits them, and stores who may read each piece. At question time the
                  gateway filters by the person’s groups, ranks the pieces, and sends a short set
                  to a local model, each with its file link.
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The compliance agent is a versioned harness. It reads the checklist, screens
                  names against the sanctions list without a model, pulls recent transactions from
                  a read-only view, searches case notes, and reasons on a local model. The output
                  is an evidence pack: findings, citations, a recommended action, and open
                  questions. A person approves, edits, or rejects. Escalation, filing, and
                  contacting a customer wait for that person.
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  An agent calls models only through the gateway, and its tools act with the
                  original person’s permissions. A run is a durable job. It survives a restart,
                  can wait for a person, and can be replayed step by step. Text-to-SQL comes after
                  the pilot and writes against named definitions, so the same question returns the
                  same number.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Models
                </p>
                <h3 className="mt-3 text-2xl tracking-[-0.04em]">Shared GPUs, one pool.</h3>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  Qwen serves chat, retrieval answers, and the router. DeepSeek serves the
                  compliance agent’s reasoning. A small embedding model and a reranker share a GPU
                  or run on CPU. Each model is its own container on the GPU machine, and only the
                  gateway calls those containers. Weights are mirrored into the enterprise’s
                  artifact store and mounted read-only, so nothing downloads at runtime.
                  Interactive requests go first. Batch work, nightly evaluations, and re-indexing
                  wait for off-hours.
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Machines
                </p>
                <h3 className="mt-3 text-2xl tracking-[-0.04em]">Two machines, one URL.</h3>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The application machine holds the chat, the gateway, the workers, the connectors,
                  Postgres, and Redis. The GPU machine serves the models, and its firewall accepts
                  traffic only from the application machine. The only route out of the enterprise
                  leaves from the gateway, through the enterprise’s egress proxy, and only for a
                  use case whose policy allows an external model. Staff reach one internal
                  URL. The API sits on the same URL. People sign in with the enterprise’s single
                  sign-on. Applications use client credentials. The same signed images move to the
                  enterprise’s Kubernetes later, with no code change.
                </p>
              </div>
            </div>
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
          <section className="border-t border-line pt-8">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              The privacy rule
            </p>
            <h2 className="mt-3 max-w-3xl text-2xl tracking-[-0.04em]">
              Data stays home.
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
