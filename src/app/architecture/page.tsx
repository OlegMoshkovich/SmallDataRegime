import type { Metadata } from "next";
import { ArrowRight, Button } from "@/components/button";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "A bank employee chats with one orchestrator. It opens the right document, calls the right agent, and runs the model the privacy of the request allows.",
};

const sources = ["Box", "SharePoint", "Internal system", "Google Drive"];
const agents = [
  {
    name: "Compliance",
    body: "Answers against the policy and the file the orchestrator opened.",
  },
  {
    name: "Notes taker",
    body: "Drafts the meeting. A person approves before it is written into the record.",
  },
  {
    name: "Customer support",
    body: "Answers the client-facing question from those same documents.",
  },
];

function Person() {
  return (
    <svg viewBox="0 0 48 72" className="h-16 w-10 shrink-0" aria-hidden>
      <circle cx="24" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 70V42h28v28" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 32 16" className="h-4 w-8 shrink-0" aria-hidden>
      <path d="M0 8h26M20 2l8 6-8 6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function Lane({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid items-start gap-4 border border-line bg-surface p-4 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
      <div>
        <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
          {label}
        </p>
        <p className="mt-2 text-sm leading-snug text-faint">{note}</p>
      </div>
      <div>{children}</div>
    </section>
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
        className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start lg:gap-x-10"
        aria-label="A person chats with the orchestrator. It opens a document in the system that holds it, routes the request to an agent, and chooses an on-prem or frontier model."
      >
        <div className="flex items-center gap-4">
          <div className="grid justify-items-center gap-2">
            <Person />
            <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
              Chat
            </p>
          </div>
          <Arrow />
          <div className="border border-foreground bg-surface px-5 py-6">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              Orchestrator
            </p>
            <p className="mt-2 max-w-[12rem] text-sm leading-snug text-faint">
              Every request comes here, and only here.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <Lane label="Documents" note="The right file, in the system that holds it.">
            <ul className="grid gap-2 sm:grid-cols-2">
              {sources.map((item) => (
                <li key={item} className="border border-line px-3 py-2 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mt-2 grid grid-cols-3 gap-2">
              {["Doc", "Doc", "Doc"].map((doc, index) => (
                <li key={index} className="border border-line px-3 py-2 text-center text-sm">
                  {doc}
                </li>
              ))}
            </ul>
          </Lane>

          <Lane label="Agent" note="The one whose job the question is.">
            <ul className="grid gap-2">
              {agents.map((agent) => (
                <li key={agent.name} className="border border-line px-3 py-2">
                  <p className="text-sm">{agent.name}</p>
                  <p className="mt-1 text-sm leading-snug text-faint">{agent.body}</p>
                </li>
              ))}
            </ul>
          </Lane>

          <Lane label="Model" note="Chosen by whether the request may leave the bank.">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-line p-3">
                <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                  On-prem
                </p>
                <p className="mt-2 text-sm">Qwen 30B</p>
                <p className="mt-1 text-sm">DeepSeek</p>
                <p className="mt-2 text-sm leading-snug text-faint">
                  Hosted on the bank’s machines. The file stays there.
                </p>
              </div>
              <div className="border border-line p-3">
                <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                  Frontier
                </p>
                <p className="mt-2 text-sm">Claude</p>
                <p className="mt-2 text-sm leading-snug text-faint">
                  Called only when the request carries nothing that has to stay inside.
                </p>
              </div>
            </div>
          </Lane>
        </div>
      </figure>

      <div className="mt-20 grid gap-16">
        <section className="border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            Two systems in production
          </p>
          <h2 className="mt-3 max-w-3xl text-2xl tracking-[-0.04em]">
            Revolut holds the gateway. Block holds the agent.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-faint">
            Both companies put one door in front of their people. Revolut’s door is a
            governed gateway: every product calls a model through it. Block’s door is
            an agent on the desk: the person talks to Goose, and Goose calls a vetted
            system.
          </p>

          <div className="mt-10 grid gap-12">
            <figure className="grid gap-4" aria-label="Revolut’s control plane">
              <div className="border border-foreground bg-surface px-5 py-6">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                  Revolut
                </p>
                <p className="mt-2 text-lg tracking-[-0.03em]">Gateway</p>
                <p className="mt-2 max-w-xl text-sm leading-snug text-faint">
                  One entry for every model call. A product does not keep its own
                  library. If a model fails, traffic moves to the fallback.
                </p>
              </div>
              <Lane label="Products" note="Each use case plugs into the same gateway.">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {["Support chat", "Voice", "AIR, the in-app assistant", "FinCrime agents", "Cross-sell", "Credit"].map(
                    (item) => (
                      <li key={item} className="border border-line px-3 py-2 text-sm">
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </Lane>
              <Lane label="Governance" note="The rule belongs to the use case.">
                <p className="border border-line px-3 py-2 text-sm leading-snug">
                  Risk, budget, and rules sit on the use case. Swap the model and the
                  policy stays. A decision that changes a customer’s position stays
                  with a person.
                </p>
              </Lane>
              <Lane label="Models" note="Right-sized, then moved.">
                <ul className="grid gap-2 sm:grid-cols-3">
                  {[
                    ["Frontier APIs", "Where a use case starts."],
                    ["Open models", "Heavy steps, on Revolut’s own GPUs."],
                    ["PRAGMA", "Their transaction model, shared across fraud, cross-sell, and credit."],
                  ].map(([name, body]) => (
                    <li key={name} className="border border-line px-3 py-2">
                      <p className="text-sm">{name}</p>
                      <p className="mt-1 text-sm leading-snug text-faint">{body}</p>
                    </li>
                  ))}
                </ul>
              </Lane>
              <Lane label="Evaluation" note="The answer is kept.">
                <ol className="grid gap-2">
                  {[
                    "Every input and output is stored, so a decision can be replayed.",
                    "Judges score live traffic, including one judge for hallucination.",
                    "People sample the chats. Each model is watched on its own, not only the screen in front of it.",
                  ].map((item) => (
                    <li key={item} className="border border-line px-3 py-2 text-sm leading-snug">
                      {item}
                    </li>
                  ))}
                </ol>
              </Lane>
            </figure>

            <figure className="grid gap-4" aria-label="Block’s agent">
              <div className="border border-foreground bg-surface px-5 py-6">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                  Block
                </p>
                <p className="mt-2 text-lg tracking-[-0.03em]">Goose</p>
                <p className="mt-2 max-w-xl text-sm leading-snug text-faint">
                  One agent, on the desk, for every role. The model calls a tool.
                  Goose runs it and returns the result. It is installed for people,
                  not left for them to set up.
                </p>
              </div>
              <Lane label="Catalogue" note="One vetted connection per system.">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {["Slack", "Google Drive", "Calendar", "Snowflake", "Databricks", "Internal systems"].map(
                    (item) => (
                      <li key={item} className="border border-line px-3 py-2 text-sm">
                        {item}
                      </li>
                    ),
                  )}
                </ul>
                <p className="mt-2 text-sm leading-snug text-faint">
                  Internal connections are pre-approved. A third-party tool does not
                  join the catalogue on its own. Only the tools the request needs
                  switch on.
                </p>
              </Lane>
              <Lane label="Build" note="A sentence becomes a tool that keeps running.">
                <p className="border border-line px-3 py-2 text-sm leading-snug">
                  G2 turns a sentence into an app that runs on its own. A person
                  outside engineering can build the workflow. The same agent is what
                  they use to ask the warehouse a question in plain language.
                </p>
              </Lane>
              <Lane label="Customer" note="The internal stack becomes the product.">
                <ul className="grid gap-2 sm:grid-cols-2">
                  <li className="border border-line px-3 py-2">
                    <p className="text-sm">Moneybot</p>
                    <p className="mt-1 text-sm leading-snug text-faint">
                      The agent, facing a Cash App customer.
                    </p>
                  </li>
                  <li className="border border-line px-3 py-2">
                    <p className="text-sm">Managerbot</p>
                    <p className="mt-1 text-sm leading-snug text-faint">
                      Watches a Square seller’s inventory, staffing, and sales. A
                      write is shown first. The seller approves it.
                    </p>
                  </li>
                </ul>
              </Lane>
            </figure>
          </div>
        </section>

        <section className="max-w-3xl border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            The experience
          </p>
          <h2 className="mt-3 text-2xl tracking-[-0.04em]">One conversation.</h2>
          <p className="mt-4 text-base leading-relaxed text-faint">
            The person does not open Box, SharePoint, the internal system, or Google
            Drive. They do not pick Compliance, and they do not pick a model. They
            type into one chat. The orchestrator replies in that same chat, naming the
            document it opened and the agent that answered.
          </p>
        </section>

        <section className="border-t border-line pt-8">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
            An example
          </p>
          <h2 className="mt-3 text-2xl tracking-[-0.04em]">A question about a facility.</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-faint">
            A relationship manager asks, in the chat. This is the experience we
            envision, not a client of record.
          </p>
          <ol className="mt-8 grid max-w-3xl gap-4">
            <li className="border border-line bg-surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                The person
              </p>
              <p className="mt-2 text-base">Can we waive the covenant on this facility?</p>
            </li>
            <li className="border border-line bg-surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                The orchestrator
              </p>
              <p className="mt-2 text-base leading-relaxed text-faint">
                Opens the credit policy in SharePoint and the facility file in the
                internal system. The question names a client, so the file does not
                leave the bank. Hands the question to Compliance. Compliance answers
                on Qwen 30B, on the bank’s machines.
              </p>
            </li>
            <li className="border border-line bg-surface p-4">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                The same person, a different question
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
