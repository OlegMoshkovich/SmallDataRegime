"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

type Placement = "On-prem" | "Frontier" | "Held";

type Doc = {
  title: string;
  system: string;
  body: string;
};

const docs: Record<string, Doc> = {
  "metric-active": {
    title: "Active customer",
    system: "Semantic layer",
    body: "Certified metrics.\n\nActive customer: no certified definition.\nOwner: unassigned.\n\nA count is not allowed until this row is filled.",
  },
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
  "alert-record": {
    title: "Alert TM-1842",
    system: "Transaction monitoring",
    body: "Sample alert. Not a live case.\n\nScenario: velocity. Status: open.\nThe alert names a customer. The disposition is blank.",
  },
  "account-activity": {
    title: "Account activity",
    system: "Core enterprise",
    body: "Twelve months of activity, opened in place.\n\nThe file stays on the enterprise's machines. No copy is made.",
  },
  "case-narrative": {
    title: "Case narrative",
    system: "Case management",
    body: "Draft. Not filed.\n\nRecommended disposition: blank until an analyst decides.\nNo report is prepared.",
  },
  "operating-account": {
    title: "Operating account",
    system: "Core enterprise",
    body: "Balance read for the preview.\n\nThe file stays on the enterprise's machines. No transfer is created.",
  },
  "payroll-file": {
    title: "Payroll file",
    system: "Cash management",
    body: "Prepared from last month's file.\n\nStatus: preview. Two new rows are marked.\nNothing has been submitted.",
  },
};

type Gate = {
  label: string;
  text: string;
};

type Route = {
  documents: string[];
  access?: Record<string, string>;
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
      documents: ["metric-active", "crm-active", "web-active"],
      access: {
        "Semantic layer": "Read",
        "Internal system": "Read",
        Website: "Read",
      },
      agent: "Orchestrator",
      model: "Not called",
      placement: "Held",
      gate: {
        label: "Definition",
        text: "No certified definition. Nothing queried.",
      },
      reply:
        "Active is not a certified metric. The semantic layer has no owner and no definition. The CRM says a login in the last 30 days. The website says a funded account. Nothing is queried, I will not return a count, and the model stays held. The question is logged at the gateway.",
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
        text: "Unsupported items left blank. A human owns the case.",
      },
      reply:
        "Opened the checklist items SharePoint can identify, and the case file in the internal system. Three items have no usable metadata, so they are marked unsupported rather than filled in. A human owns the case. It stays on the enterprise's machines.",
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
        "Opened the wire record. It names a client, so it stays on the enterprise's machines. Customer support can say the wire is received and under review. This is read only. No message is sent.",
    },
  },
  {
    label: "AML alert",
    query: "Investigate this transaction monitoring alert.",
    route: {
      documents: ["alert-record", "account-activity", "case-narrative"],
      access: {
        "Transaction monitoring": "Read",
        "Core enterprise": "Read",
        "Case management": "Draft",
      },
      agent: "AML investigation",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Draft",
        text: "Narrative drafted. A human owns the disposition. Nothing filed.",
      },
      reply:
        "Opened the alert and the account activity. Both name a customer, so this stays on the enterprise's machines. A short pass scored the alert, then Qwen 30B drafted the narrative. A judge checked that the cited items exist. The disposition is blank. A human owns it. Nothing is filed. The call is stored at the gateway.",
    },
  },
  {
    label: "Payroll file",
    query: "Prepare this month's payroll from last month's file.",
    route: {
      documents: ["operating-account", "payroll-file"],
      access: {
        "Core enterprise": "Read",
        "Cash management": "Draft",
      },
      agent: "SME manager",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Preview",
        text: "File prepared. Waiting for the owner. Nothing submitted.",
      },
      reply:
        "Read the operating account and prepared the payroll file. The owner sees the preview, including the two new rows. Nothing is submitted until they approve. It stays on the enterprise's machines. The preview is stored at the gateway.",
    },
  },
];

function sampleRoute(label: string) {
  const sample = samples.find((item) => item.label === label);
  if (!sample) throw new Error(`Missing sample: ${label}`);
  return sample.route;
}

function agentNote(route: Route) {
  const does: Record<string, string> = {
    Orchestrator:
      "The human talks only to the orchestrator. It opens the document, picks the agent, and runs the model the request is allowed to use.",
    Compliance:
      "Answers a covenant question from the documents it was handed. It does not go looking for a file on its own. A human owns the case.",
    "Customer support":
      "Answers what the client can be told. This is read only. No message is sent.",
    "AML investigation":
      "Drafts what it found in the alert. A human owns the disposition. Nothing is filed.",
    "SME manager":
      "Prepares the file for the owner to preview, including the new rows. Nothing is submitted until they approve.",
  };
  const work = does[route.agent] ?? route.agent;
  const call =
    route.model === "Not called"
      ? "The model stays held."
      : `It calls ${route.model} on the enterprise's machines.`;
  return `${work} ${call}`;
}

function OperateDiagram({ route, step }: { route: Route | null; step: number }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const systems = route ? [...new Set(route.documents.map((id) => docs[id].system))] : [];
  const waiting = (id: string): { id: string; label: string; note: string } => ({
    id,
    label: "Waiting",
    note: "",
  });
  const nodes: {
    id: string;
    title: string;
    accent?: boolean;
    items: { id: string; label: string; note: string }[];
  }[] = [
    {
      id: "systems",
      title: "Systems",
      items:
        route && step >= 1
          ? systems.length > 0
            ? systems.map((system) => ({
                id: `system:${system}`,
                label: system,
                note: [
                  route.access?.[system],
                  ...route.documents
                    .filter((id) => docs[id].system === system)
                    .map((id) => docs[id].title),
                ]
                  .filter(Boolean)
                  .join("\n"),
              }))
            : [{ id: "system:none", label: "None", note: "Nothing opened." }]
          : [waiting("systems")],
    },
    {
      id: "documents",
      title: "Documents",
      items:
        route && step >= 2
          ? route.documents.length > 0
            ? route.documents.map((id) => ({
                id: `doc:${id}`,
                label: docs[id].title,
                note: docs[id].body,
              }))
            : [{ id: "doc:none", label: "None", note: "No client file opened." }]
          : [waiting("documents")],
    },
    {
      id: "agent",
      title: "Agent",
      items:
        route && step >= 3
          ? [{ id: "agent", label: route.agent, note: agentNote(route) }]
          : [waiting("agent")],
    },
    {
      id: "model",
      title: "Model",
      accent: Boolean(route && step >= 4),
      items:
        route && step >= 4
          ? [
              {
                id: "model",
                label: route.model,
                note:
                  route.placement === "On-prem"
                    ? "Frontier not allowed. Stays on the enterprise's machines."
                    : route.placement === "Held"
                      ? "The model stays held."
                      : `${route.model} · ${route.placement}.`,
              },
            ]
          : [waiting("model")],
    },
    {
      id: "gate",
      title: "Decision",
      items:
        route && step >= 5
          ? [{ id: "gate", label: route.gate.label, note: route.gate.text }]
          : [waiting("gate")],
    },
  ];

  return (
    <div className="px-4 py-6">
      <div className="mx-auto grid w-max grid-cols-[auto_auto_auto] justify-center lg:w-full lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <p className="flex items-center justify-end gap-1.5 self-center pr-3 font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap uppercase">
          <span className="size-1.5 bg-accent" />
          Gateway
        </p>
        <span className="size-10 justify-self-center self-center bg-foreground" />
        <div />
        {nodes.map((node, index) => {
          const note = node.items.find((item) => item.id === openId);
          return (
            <Fragment key={node.id}>
              <p className="mt-6 pr-3 text-right font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap text-accent uppercase">
                {node.title}
              </p>
              <div className="flex flex-col items-center">
                <span className="h-6 w-px shrink-0 bg-foreground" />
                <div
                  className={`grid w-48 shrink-0 gap-1 border bg-surface px-3 py-2 text-center lg:w-auto lg:max-w-56 ${
                    node.accent ? "border-accent" : "border-foreground"
                  }`}
                >
                  {node.items.map((item) =>
                    item.note ? (
                      <button
                        key={item.id}
                        type="button"
                        aria-expanded={openId === item.id}
                        onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        className={`font-mono text-[0.65rem] tracking-[-0.01em] uppercase ${
                          openId === item.id ? "text-accent" : ""
                        }`}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <p
                        key={item.id}
                        className="font-mono text-[0.65rem] tracking-[-0.01em] text-faint uppercase"
                      >
                        {item.label}
                      </p>
                    ),
                  )}
                </div>
                {index < nodes.length - 1 ? <span className="w-px flex-1 bg-foreground" /> : null}
              </div>
              <div className={note ? "mt-6 w-56 pl-4 lg:w-auto" : ""}>
                {note ? (
                  <p className="w-full border border-line px-3 py-2 text-left text-sm leading-relaxed whitespace-pre-line text-faint lg:max-w-56">
                    {note.note}
                  </p>
                ) : null}
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function routeQuery(text: string): Route {
  const query = text.toLowerCase();
  if (/checklist/.test(query)) return sampleRoute("Compliance checklist");
  if (/active customer|how many active|\bnps\b/.test(query)) return sampleRoute("Active customers");
  if (/aml|transaction monitoring|\balert\b/.test(query)) return sampleRoute("AML alert");
  if (/payroll/.test(query)) return sampleRoute("Payroll file");
  if (/wire/.test(query)) return sampleRoute("A client's wire");
  if (/client|customer|account|position|loan|confidential/.test(query)) {
    return {
      documents: ["client-file"],
      agent: "Compliance",
      model: "Qwen 30B",
      placement: "On-prem",
      gate: {
        label: "Decision",
        text: "Read only. A human owns the next step.",
      },
      reply:
        "Opened the client file. It stays on the enterprise's machines. This is read only. A human owns the next step.",
    };
  }
  return {
    documents: [],
    agent: "Orchestrator",
    model: "Not called",
    placement: "Held",
    gate: {
      label: "Decision",
      text: "No matching case. Nothing opened.",
    },
    reply:
      "This question does not match a case the orchestrator can open. Nothing is queried, and the model stays held.",
  };
}

function OperateToggle({
  value,
  onSelect,
}: {
  value: "diagram" | null;
  onSelect: (id: "diagram") => void;
}) {
  return (
    <div className="inline-flex shrink-0 border border-line" role="group" aria-label="How the system operates">
      {(
        [
          { id: "diagram", label: "Trajectory" },
        ] as const
      ).map((item, index) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(item.id)}
            className={`h-[31px] shrink-0 whitespace-nowrap px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${
              index > 0 ? "border-l border-line" : ""
            } ${selected ? "bg-foreground text-background" : "bg-surface text-muted"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function DemoChat({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [step, setStep] = useState(0);
  const [openDoc, setOpenDoc] = useState<string | null>(null);
  const [choice, setChoice] = useState<"diagram" | null>(null);
  const operateView = choice ?? "diagram";

  function choose(id: "diagram") {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    setChoice((current) => (desktop || current !== id ? id : null));
  }
  const run = useRef(0);
  const timers = useRef<number[]>([]);
  const thread = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useLayoutEffect(() => {
    if (embedded) return;
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previousBehavior;
  }, [embedded]);

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const el = thread.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
  }, [messages, step]);

  function ask(text: string, preset?: Route) {
    const trimmed = text.trim();
    if (!trimmed) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    const id = ++run.current;
    const next = preset ?? routeQuery(trimmed);
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
    <>
    <div className="grid min-w-0 items-end gap-4 *:min-w-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className="flex min-w-0 items-end gap-3 lg:block">
        <div className="min-w-0">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
            Demo
          </p>
        </div>
        <div className="ml-auto shrink-0 lg:hidden">
          <OperateToggle value={choice} onSelect={choose} />
        </div>
      </div>
      <p className="hidden font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase lg:block">
        How the system operates
      </p>
    </div>
    <div className="relative mt-3">
      <div className="pointer-events-none invisible hidden lg:block" aria-hidden>
        <div className="border border-line">
          <div className="border-b border-line p-3">
            <OperateToggle value="diagram" onSelect={() => {}} />
          </div>
          <OperateDiagram route={null} step={0} />
        </div>
      </div>
      <div className="grid items-stretch gap-4 lg:absolute lg:inset-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <div className={`flex min-h-0 flex-col overflow-hidden border border-line bg-surface lg:h-full ${choice !== null ? "max-lg:hidden" : ""}`}>
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
        <div ref={thread} className="grid content-start gap-3 p-4 lg:h-0 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm leading-relaxed text-faint">
              Choose a question. The orchestrator will show the systems, the
              document, the agent, the model, and the decision.
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
      </div>

      <aside
        className={`flex min-h-0 flex-col overflow-hidden border border-line bg-surface lg:h-full ${choice === null ? "hidden lg:flex" : ""}`}
        aria-live="polite"
      >
          <div className="hidden shrink-0 border-b border-line p-3 lg:block">
            <OperateToggle value={operateView} onSelect={choose} />
          </div>
          <div className="min-w-0 max-w-full max-lg:overflow-x-auto lg:h-0 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {operateView === "diagram" ? (
          <OperateDiagram route={route} step={step} />
        ) : opened ? (
          <article className="m-4 border border-line bg-surface">
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
            <div className="px-4 py-4">
              <h2 className="text-lg tracking-[-0.03em]">{opened.title}</h2>
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-line">{opened.body}</p>
            </div>
          </article>
        ) : (
          <div className="grid content-start gap-3 p-4">
            <article
              className="border border-line bg-surface p-4"
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
                      {route?.access?.[system] ? (
                        <span className="mt-1 block text-faint">{route.access[system]}</span>
                      ) : null}
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
              className="border border-line bg-surface p-4"
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
              className="border border-line bg-surface p-4"
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
              className="border border-line bg-surface p-4"
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
                  Frontier not allowed. Stays on the enterprise's machines.
                </p>
              ) : null}
            </article>
            <article
              className="border border-line bg-surface p-4"
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
          </div>
        )}
          </div>
      </aside>
      </div>
    </div>
    </>
  );
}
