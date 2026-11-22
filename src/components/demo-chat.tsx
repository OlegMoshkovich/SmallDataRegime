"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Placement = "On-prem" | "Frontier" | "Held";

type Doc = {
  title: string;
  system: string;
  body: string;
};

const docs: Record<string, Doc> = {
  "crm-active": {
    title: "Active customer",
    system: "Internal system",
    body: "Definition used by the CRM.\n\nA customer with a logged-in session in the last 30 days.\n\nOwner: Retail analytics.\nLast edited: 3 March.",
  },
  "web-active": {
    title: "Active customer",
    system: "Website",
    body: "Definition on the public product pages.\n\nA customer who holds a funded account.\n\nNo owner. No review date. This is the page the business treats as the source of truth.",
  },
  checklist: {
    title: "Compliance checklist",
    system: "SharePoint",
    body: "KYC refresh — owner missing, evidence missing.\nSanctions screen — owner Compliance, evidence attached.\nSource of funds — owner missing, evidence missing.\n\nMetadata is filled on one item of three.",
  },
  "case-file": {
    title: "Case 1842",
    system: "Internal system",
    body: "Retail customer. Onboarded 2024.\n\nSanctions screen: clear, 12 March.\nSource of funds: not on file.\nKYC refresh: not started.",
  },
  "held-out": {
    title: "Held-out Q&A",
    system: "Internal system",
    body: "1. What is NPS among salary customers?\nExpected: ask which period.\nNew prompt: answered 42. Fail.\n\n2. Can a prompt change ship the same day?\nExpected: no, the set must pass.\nNew prompt: yes. Fail.",
  },
  "credit-policy": {
    title: "Credit policy",
    system: "SharePoint",
    body: "A covenant waiver needs the credit exception on the facility file.\n\nSection 4. The exception is recorded by credit, not by the relationship manager.",
  },
  "facility-file": {
    title: "Facility file",
    system: "Internal system",
    body: "Facility 220. Client named on the file.\n\nCredit exception: not on file.\nCovenant: in force.",
  },
  "meeting-notes": {
    title: "Credit meeting",
    system: "Google Drive",
    body: "This morning. Two client names in the notes.\n\nDecision: no waiver without the exception on file.\nFollow-up: credit to confirm by Friday.",
  },
  "wire-record": {
    title: "Wire record",
    system: "Internal system",
    body: "Client wire. Received yesterday. Status: held for the name check.\n\nWhat the client can be told: the wire is received and under review. No amount in this note.",
  },
  "client-file": {
    title: "Client file",
    system: "Internal system",
    body: "Retail client. The file stays in the internal system.\n\nOpened for this question only. Not copied out.",
  },
};

type Gate = {
  label: string;
  text: string;
};

type Route = {
  documents: string[];
  agent: string;
  model: string;
  placement: Placement;
  gate: Gate;
  reply: string;
};

type Message = {
  id: number;
  role: "person" | "orchestrator";
  text: string;
};

const samples: { label: string; query: string; route: Route }[] = [
  {
    label: "Active customers",
    query: "How many active customers do we have?",
    route: {
      documents: ["crm-active", "web-active"],
      agent: "Orchestrator",
      model: "Not called",
      placement: "Held",
      gate: {
        label: "Definition",
        text: "No agreed definition of active. Nothing queried.",
      },
      reply:
        "Active is not one definition. The CRM says a login in the last 30 days. The website says a funded account. Nothing is queried, I will not return a count, and the model stays held.",
    },
  },
  {
    label: "Compliance checklist",
    query: "Run the compliance checklist on this case.",
    route: {
      documents: ["checklist", "case-file"],
      agent: "Compliance",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Decision",
        text: "Unsupported items left blank. A person owns the case.",
      },
      reply:
        "Opened the checklist items SharePoint can identify, and the case file in the internal system. Three items have no usable metadata, so they are marked unsupported rather than filled in. A person owns the case. It stays on the bank's machines.",
    },
  },
  {
    label: "Nightly tests",
    query: "We changed the prompt on the NPS bot. Can we ship it?",
    route: {
      documents: ["held-out"],
      agent: "Orchestrator",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Evaluation",
        text: "Prompt and both failing answers stored. Judge marked them. Does not ship.",
      },
      reply:
        "The new prompt and both failing answers are stored. A judge marked the two cases that passed yesterday and now fail, so this does not ship. The nightly 500 still run. This set is the gate in front of them.",
    },
  },
  {
    label: "Covenant",
    query: "Can we waive the covenant on this facility?",
    route: {
      documents: ["credit-policy", "facility-file"],
      agent: "Compliance",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Decision",
        text: "No waiver recorded. A person owns the exception.",
      },
      reply:
        "Opened the credit policy and the facility file. The exception is not on file, so no waiver is recorded. The question names a client, so it stays on the bank's machines. A person owns the decision.",
    },
  },
  {
    label: "Meeting notes",
    query: "Write up the notes from this morning's credit meeting.",
    route: {
      documents: ["meeting-notes"],
      agent: "Notes taker",
      model: "DeepSeek",
      placement: "On-prem",
      gate: {
        label: "Write",
        text: "Ready to file. Waiting for a person.",
      },
      reply:
        "Opened the meeting notes in Google Drive. They name clients, so they stay on the bank's machines. DeepSeek drafted them. They are ready to file, and a person has to approve the write. Nothing has been written into the internal system.",
    },
  },
  {
    label: "A client's wire",
    query: "What can I tell the client about their wire?",
    route: {
      documents: ["wire-record"],
      agent: "Customer support",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Write",
        text: "Read only. No message sent.",
      },
      reply:
        "Opened the wire record. It names a client, so it stays on the bank's machines. Customer support can say the wire is received and under review. This is read only. No message is sent.",
    },
  },
  {
    label: "Public wording",
    query: "How should we describe this product on the public site?",
    route: {
      documents: [],
      agent: "Orchestrator",
      model: "Claude",
      placement: "Frontier",
      gate: {
        label: "Decision",
        text: "No client file. A frontier model is allowed.",
      },
      reply:
        "No client file is opened. Nothing in the question has to stay inside the bank, so a frontier model is allowed. The orchestrator asks Claude for the public wording.",
    },
  },
];

function sampleRoute(label: string) {
  const sample = samples.find((item) => item.label === label);
  if (!sample) throw new Error(`Missing sample: ${label}`);
  return sample.route;
}

function routeQuery(text: string): Route {
  const query = text.toLowerCase();
  if (/checklist/.test(query)) return sampleRoute("Compliance checklist");
  if (/nightly|held-out|guardrail|can we ship|prompt/.test(query)) return sampleRoute("Nightly tests");
  if (/active customer|how many active|\bnps\b/.test(query)) return sampleRoute("Active customers");
  if (/public|wording|website|\bsite\b|describe/.test(query)) return sampleRoute("Public wording");
  if (/note|meeting|minutes/.test(query)) return sampleRoute("Meeting notes");
  if (/wire/.test(query)) return sampleRoute("A client's wire");
  if (/covenant|waive|facility|compliance|policy|credit/.test(query)) return sampleRoute("Covenant");
  if (/client|customer|account|position|loan|confidential/.test(query)) {
    return {
      documents: ["client-file"],
      agent: "Compliance",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Decision",
        text: "Read only. A person owns the next step.",
      },
      reply:
        "Opened the client file. It stays on the bank's machines. This is read only. A person owns the next step.",
    };
  }
  return sampleRoute("Public wording");
}

export function DemoChat() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [step, setStep] = useState(0);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const run = useRef(0);
  const timers = useRef<number[]>([]);
  const thread = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousBehavior = html.style.scrollBehavior;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.scrollBehavior = previousBehavior;
    };
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight });
  }, [messages, step]);

  function ask(text: string, preset?: Route) {
    const trimmed = text.trim();
    if (!trimmed) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    const id = ++run.current;
    const next = preset ?? routeQuery(trimmed);
    setDraft("");
    setRoute(next);
    setStep(0);
    setOpenDoc(null);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "person", text: trimmed },
    ]);
    [1, 2, 3, 4, 5].forEach((mark, index) => {
      const timer = window.setTimeout(() => {
        if (run.current !== id) return;
        setStep(mark);
        if (mark === 5) {
          setMessages((current) => [
            ...current,
            { id: nextId.current++, role: "orchestrator", text: next.reply },
          ]);
        }
      }, 450 * (index + 1));
      timers.current.push(timer);
    });
  }

  const systems = route
    ? [...new Set(route.documents.map((id) => docs[id].system))]
    : [];
  const systemsLive = step >= 1;
  const documentsLive = step >= 2;
  const opened = openDoc ? docs[openDoc] : null;

  return (
    <div className="mt-3 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-4 overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:grid-rows-1">
      <div className="flex min-h-0 flex-col border border-line bg-surface">
        <div className="flex shrink-0 flex-wrap gap-2 border-b border-line p-3">
          {samples.map((sample) => (
            <button
              key={sample.label}
              type="button"
              onClick={() => ask(sample.query, sample.route)}
              className="border border-line px-3 py-2 text-left text-sm hover:border-foreground"
            >
              {sample.label}
            </button>
          ))}
        </div>
        <div ref={thread} className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-sm leading-relaxed text-faint">
              Choose a sample, or type a question. The orchestrator will show the
              systems, the document, the agent, the model, and the decision.
            </p>
          ) : (
            messages.map((message) => (
              <p
                key={message.id}
                className={`max-w-[36rem] border px-3 py-2 text-sm leading-relaxed ${
                  message.role === "person"
                    ? "justify-self-end border-foreground"
                    : "border-line text-faint"
                }`}
              >
                <span className="mb-1 block font-mono text-[0.65rem] tracking-[-0.01em] uppercase">
                  {message.role === "person" ? "You" : "Orchestrator"}
                </span>
                {message.text}
              </p>
            ))
          )}
        </div>
        <form
          className="flex shrink-0 gap-2 border-t border-line p-3"
          onSubmit={(event) => {
            event.preventDefault();
            ask(draft);
          }}
        >
          <label className="sr-only" htmlFor="demo-question">
            Question
          </label>
          <input
            id="demo-question"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask the orchestrator"
            className="min-w-0 flex-1 border border-line bg-background px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-ink px-3.5 font-mono text-[0.8125rem] tracking-[-0.0175rem] text-paper capitalize"
          >
            Send
          </button>
        </form>
      </div>

      <aside className="grid min-h-0 content-start gap-3 overflow-y-auto" aria-live="polite">
        <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
          How the system operates
        </p>
        {opened ? (
          <article className="flex min-h-0 flex-col border border-foreground bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                {opened.system}
              </p>
              <button
                type="button"
                onClick={() => setOpenDoc(null)}
                className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase"
              >
                Back
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <h2 className="text-lg tracking-[-0.03em]">{opened.title}</h2>
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-line">{opened.body}</p>
            </div>
          </article>
        ) : (
          <>
            <article
              className={`border bg-surface p-4 ${systemsLive ? "border-foreground" : "border-line"}`}
            >
              <p
                className={`font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${systemsLive ? "text-accent" : "text-muted"}`}
              >
                Systems
              </p>
              {systemsLive && systems.length > 0 ? (
                <ul className="mt-2 grid gap-2">
                  {systems.map((system) => (
                    <li key={system} className="border border-line px-3 py-2 text-sm">
                      {system}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`mt-2 text-sm leading-snug ${systemsLive ? "" : "text-faint"}`}>
                  {systemsLive ? "None" : "Waiting"}
                </p>
              )}
            </article>
            <article
              className={`border bg-surface p-4 ${documentsLive ? "border-foreground" : "border-line"}`}
            >
              <p
                className={`font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${documentsLive ? "text-accent" : "text-muted"}`}
              >
                Documents
              </p>
              {documentsLive && route && route.documents.length > 0 ? (
                <ul className="mt-2 grid gap-2">
                  {route.documents.map((id) => {
                    const doc = docs[id];
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => setOpenDoc(id)}
                          className="w-full border border-line px-3 py-2 text-left text-sm hover:border-foreground"
                        >
                          {doc.title}
                          <span className="mt-1 block text-faint">{doc.system}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className={`mt-2 text-sm leading-snug ${documentsLive ? "" : "text-faint"}`}>
                  {documentsLive ? "No client file opened" : "Waiting"}
                </p>
              )}
            </article>
            <article
              className={`border bg-surface p-4 ${step >= 3 ? "border-foreground" : "border-line"}`}
            >
              <p
                className={`font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${step >= 3 ? "text-accent" : "text-muted"}`}
              >
                Agent
              </p>
              <p className={`mt-2 text-sm leading-snug ${step >= 3 ? "" : "text-faint"}`}>
                {step >= 3 && route ? route.agent : "Waiting"}
              </p>
            </article>
            <article
              className={`border bg-surface p-4 ${step >= 4 ? "border-foreground" : "border-line"}`}
            >
              <p
                className={`font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${step >= 4 ? "text-accent" : "text-muted"}`}
              >
                Model
              </p>
              <p className={`mt-2 text-sm leading-snug ${step >= 4 ? "" : "text-faint"}`}>
                {step >= 4 && route ? `${route.model}  ·  ${route.placement}` : "Waiting"}
              </p>
              {step >= 4 && route?.placement === "On-prem" ? (
                <p className="mt-2 text-sm leading-snug text-faint">
                  Frontier not allowed. Stays on the bank's machines.
                </p>
              ) : null}
            </article>
            <article
              className={`border bg-surface p-4 ${step >= 5 ? "border-foreground" : "border-line"}`}
            >
              <p
                className={`font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${step >= 5 ? "text-accent" : "text-muted"}`}
              >
                {step >= 5 && route ? route.gate.label : "Decision"}
              </p>
              <p className={`mt-2 text-sm leading-snug ${step >= 5 ? "" : "text-faint"}`}>
                {step >= 5 && route ? route.gate.text : "Waiting"}
              </p>
            </article>
          </>
        )}
      </aside>
    </div>
  );
}
