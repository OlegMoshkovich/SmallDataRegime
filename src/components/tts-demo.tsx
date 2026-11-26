"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Piece = {
  id: string;
  label: string;
  note: string;
};

type Beat = {
  id: string;
  at: number;
  system: string;
  text: string;
};

type Setup = {
  overview: string;
  time: string;
  departments: string;
  handoff: string;
};

type Route = {
  access: Piece[];
  control: Piece[];
  compute: Piece[];
  storage: Piece[];
  story: Beat[];
  reply: string;
  setup?: Setup;
};

type Message = {
  id: number;
  role: "person" | "platform";
  text: string;
};

const samples: { label: string; query: string; route: Route }[] = [
  {
    label: "Fraud and AML",
    query: "Score this card payment and triage the alert.",
    route: {
      access: [
        {
          id: "chat",
          label: "Chat UI",
          note: "Fraud operations asks in the chat. The payment names a customer, so the person starts on the internal URL.",
        },
        {
          id: "apps",
          label: "Enterprise apps",
          note: "The payments app calls the API at the moment of the payment. The proxy sends that call to the gateway.",
        },
      ],
      control: [
        {
          id: "worker",
          label: "Agent worker",
          note: "The triage is a multi-step task. A worker takes it from the pg-boss queue.",
        },
        {
          id: "mcp",
          label: "MCP servers",
          note: "The worker reaches the sanctions list and the read-only database through MCP. The payment stays where it already lives.",
        },
      ],
      compute: [
        {
          id: "model",
          label: "Model proxy",
          note: "The model proxy is the only caller of the models. This request does not open the egress proxy.",
        },
        {
          id: "qwen",
          label: "Qwen",
          note: "Qwen on port 8001 scores the payment and routes the alert. Chat and routing are what this GPU is for.",
        },
      ],
      storage: [
        {
          id: "postgres",
          label: "Postgres 16",
          note: "The run, the log, and the drafted triage stay in Postgres.",
        },
        {
          id: "redis",
          label: "Redis 7",
          note: "Redis counts the token budget as the call spends it. The gateway is what talks to Redis.",
        },
      ],
      story: [
        {
          id: "chat",
          at: 1,
          system: "Chat UI",
          text: "The chat opens on ai.enterprise.internal. Fraud operations is signed in with corporate SSO.",
        },
        {
          id: "app",
          at: 1,
          system: "Payments app",
          text: "The app calls the API through the proxy. The proxy terminates TLS and sends the call to the gateway.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Gateway",
          text: "The gateway checks policy, rights, and budget. The payment names a customer, so the call stays on the enterprise's machines.",
        },
        {
          id: "worker",
          at: 2,
          system: "Agent worker",
          text: "A worker takes the triage from the queue and opens the sanctions list through MCP.",
        },
        {
          id: "proxy",
          at: 3,
          system: "Model proxy",
          text: "The model proxy opens port 8001. No other container calls the model.",
        },
        {
          id: "qwen",
          at: 3,
          system: "Qwen",
          text: "Qwen returns the score and a short route for the alert. The egress proxy is not used.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Postgres",
          text: "The run and the drafted triage are written to Postgres. The customer file is not copied out.",
        },
        {
          id: "otel",
          at: 4,
          system: "OTel",
          text: "OTel sends the trace to the monitoring the enterprise already runs. Redis records the tokens spent.",
        },
      ],
      reply:
        "Fraud and AML stays on the enterprise's machines. The chat and the payments app both arrive at the gateway. An agent worker reads the sanctions list through MCP. The model proxy calls Qwen. Postgres keeps the run. The egress proxy is not opened.",
      setup: {
        overview:
          "**Fraud operations** asks in the chat. The **payments app** calls the same gateway. The gateway keeps the call inside, because the payment names a customer.",
        time:
          "The score comes back in a few seconds. Qwen answers on GPU 0. The analyst reads the triage in the same chat, later the same day.",
        departments:
          "Fraud operations owns the question and the decision on the alert. Payments engineering owns the app that calls the API. Platform operations runs the gateway, the workers, and the model proxy.",
        handoff:
          "The handoff is the run in Postgres. The app calls the API. The gateway checks policy and the Redis budget, then the model proxy calls Qwen. The worker drafts the triage through MCP. OTel carries the trace. The answer returns in the chat.",
      },
    },
  },
  {
    label: "Credit risk",
    query: "Run the expected-loss stress test.",
    route: {
      access: [
        {
          id: "chat",
          label: "Chat UI",
          note: "Credit-risk reporting asks in the chat. They want the stress narrative. They do not train a new model.",
        },
      ],
      control: [
        {
          id: "worker",
          label: "Agent worker",
          note: "The stress test is a multi-step job. A worker runs it from the queue.",
        },
        {
          id: "mcp",
          label: "MCP servers",
          note: "The worker reads the exposure tables through the read-only database connector.",
        },
      ],
      compute: [
        {
          id: "model",
          label: "Model proxy",
          note: "The model proxy is the only path to DeepSeek. The call does not leave the building.",
        },
        {
          id: "deepseek",
          label: "DeepSeek",
          note: "DeepSeek on port 8002 does the step-by-step stress reasoning. That is the compliance GPU.",
        },
      ],
      storage: [
        {
          id: "postgres",
          label: "Postgres 16",
          note: "The draft and the run stay in Postgres. A human owns the filing.",
        },
        {
          id: "redis",
          label: "Redis 7",
          note: "Redis holds the budget for the longer reasoning call.",
        },
      ],
      story: [
        {
          id: "chat",
          at: 1,
          system: "Chat UI",
          text: "The chat opens. Credit-risk reporting asks for the expected-loss stress narrative.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Gateway",
          text: "The gateway checks policy, risk, rights, and the budget in Redis before a table is opened.",
        },
        {
          id: "worker",
          at: 2,
          system: "Agent worker",
          text: "A worker takes the job and opens the exposure tables through MCP. The tables stay in the internal system.",
        },
        {
          id: "proxy",
          at: 3,
          system: "Model proxy",
          text: "The model proxy opens port 8002. It is the only service allowed to call DeepSeek.",
        },
        {
          id: "deepseek",
          at: 3,
          system: "DeepSeek",
          text: "DeepSeek drafts the stress narrative. The egress proxy stays closed.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Postgres",
          text: "The draft and the run are stored in Postgres. Nothing is filed until a person accepts it.",
        },
      ],
      reply:
        "Credit risk stays inside the gateway. Reporting asks in the chat. An agent worker reads the exposures through MCP. The model proxy calls DeepSeek for the narrative. Postgres holds the draft. A human owns the numbers.",
      setup: {
        overview:
          "**Credit-risk reporting** asks for the stress narrative. **Credit-risk engineering** owns the exposure tables the worker is allowed to read. The model stays on GPU 1.",
        time:
          "The worker finishes in a few minutes. DeepSeek reasons on GPU 1. The draft is in the chat the same morning. A human still owns the numbers.",
        departments:
          "Credit-risk reporting asks and decides. Credit-risk engineering keeps the tables behind the read-only connector. Platform operations runs the gateway and the model proxy.",
        handoff:
          "The handoff is the draft in Postgres. The worker reads the exposures through MCP, the model proxy calls DeepSeek, and the chat shows the narrative. Nothing is filed until a person accepts it. The egress proxy stays closed.",
      },
    },
  },
  {
    label: "Customer 360",
    query: "Build a customer's profile and offer the next product.",
    route: {
      access: [
        {
          id: "chat",
          label: "Chat UI",
          note: "A person asks in the chat for the customer's next offer.",
        },
        {
          id: "apps",
          label: "Enterprise apps",
          note: "The offer screen calls the API for that one customer. The proxy sends the call to the gateway.",
        },
      ],
      control: [
        {
          id: "worker",
          label: "Agent worker",
          note: "The profile is assembled as a job, from the systems that already hold the customer.",
        },
        {
          id: "mcp",
          label: "MCP servers",
          note: "MCP opens those internal systems in place. The customer file is not copied out.",
        },
      ],
      compute: [
        {
          id: "model",
          label: "Model proxy",
          note: "The model proxy is the only path to Qwen.",
        },
        {
          id: "qwen",
          label: "Qwen",
          note: "Qwen drafts the offer from the rows the worker retrieved.",
        },
      ],
      storage: [
        {
          id: "postgres",
          label: "Postgres 16",
          note: "Postgres logs who opened the customer. The customer record stays in the internal system.",
        },
      ],
      story: [
        {
          id: "chat",
          at: 1,
          system: "Chat UI",
          text: "The chat opens on the internal URL. The person asks for the customer's next offer.",
        },
        {
          id: "app",
          at: 1,
          system: "Offer app",
          text: "The offer screen calls the API. The proxy passes the signed-in user to the gateway.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Gateway",
          text: "The gateway checks who may see this customer before any system is opened.",
        },
        {
          id: "mcp",
          at: 2,
          system: "MCP servers",
          text: "MCP reads the internal systems where the customer already lives. No copy is made.",
        },
        {
          id: "qwen",
          at: 3,
          system: "Qwen",
          text: "The model proxy calls Qwen on port 8001. Qwen drafts the offer from those rows.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Postgres",
          text: "Postgres records who opened the customer and what the chat returned. The source systems are unchanged.",
        },
      ],
      reply:
        "The customer stays in the systems that already hold the file. The chat and the offer app arrive at the gateway. MCP reads in place. The model proxy calls Qwen. Postgres logs the open. No second copy is written.",
      setup: {
        overview:
          "The **branch** asks in the chat. The **digital product team** shows the offer in the app. Both arrive at one gateway, and the customer file stays where it already lives.",
        time:
          "The offer comes back in a few seconds. Qwen answers on GPU 0. The screen reads that answer in the same session.",
        departments:
          "The branch asks. The digital product team owns the app. Platform operations runs the gateway. The customer file stays with the system that already holds it.",
        handoff:
          "The handoff is the answer in the chat and on the screen. MCP reads the internal systems in place. The model proxy calls Qwen. Postgres logs who opened the customer. No second copy is written.",
      },
    },
  },
  {
    label: "Regulatory reporting",
    query: "Produce this period's regulatory report.",
    route: {
      access: [
        {
          id: "chat",
          label: "Chat UI",
          note: "Regulatory reporting asks in the chat. The pack is a draft until a person files it.",
        },
      ],
      control: [
        {
          id: "worker",
          label: "Agent worker",
          note: "The period pack is a multi-step job. A failed step leaves the previous draft in place.",
        },
        {
          id: "mcp",
          label: "MCP servers",
          note: "The worker opens SharePoint and the read-only database. The sources stay where they are.",
        },
      ],
      compute: [
        {
          id: "model",
          label: "Model proxy",
          note: "The model proxy is the only path to DeepSeek. The report does not leave through the egress proxy.",
        },
        {
          id: "deepseek",
          label: "DeepSeek",
          note: "DeepSeek on port 8002 writes the period narrative. Compliance reasoning is what this GPU is for.",
        },
      ],
      storage: [
        {
          id: "postgres",
          label: "Postgres 16",
          note: "Ingestion has already stored the SharePoint vectors here. The draft and the log stay beside them.",
        },
        {
          id: "redis",
          label: "Redis 7",
          note: "Redis tracks the budget for the reasoning call.",
        },
      ],
      story: [
        {
          id: "chat",
          at: 1,
          system: "Chat UI",
          text: "The chat opens. Regulatory reporting asks for this period's pack.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Gateway",
          text: "The gateway checks policy, risk, rights, and budget before SharePoint or the database is opened.",
        },
        {
          id: "worker",
          at: 2,
          system: "Agent worker",
          text: "A worker opens SharePoint and the read-only database through MCP. A failed step leaves the previous draft.",
        },
        {
          id: "deepseek",
          at: 3,
          system: "DeepSeek",
          text: "The model proxy calls DeepSeek on port 8002. DeepSeek drafts the period narrative.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Postgres",
          text: "The draft is stored next to the vectors ingestion already wrote. The auditor can read this run.",
        },
        {
          id: "otel",
          at: 4,
          system: "OTel",
          text: "OTel exports the trace. The egress proxy is not opened.",
        },
      ],
      reply:
        "Regulatory reporting stays on the enterprise's machines. Reporting asks in the chat. An agent worker reads SharePoint and the database through MCP. The model proxy calls DeepSeek. Postgres keeps the draft and the log. A person files the pack.",
      setup: {
        overview:
          "**Regulatory reporting** asks for the period pack. **Finance engineering** owns the tables the worker may read. The draft stays on the enterprise's machines.",
        time:
          "The worker finishes in a few minutes. DeepSeek writes the narrative on GPU 1. The pack is in the chat the same morning. Filing waits for a person.",
        departments:
          "Regulatory reporting asks and files. Finance engineering keeps the source tables behind MCP. An auditor reads the run in Postgres. Platform operations runs the gateway.",
        handoff:
          "The handoff is the draft and the log. Ingestion has already synced SharePoint into Postgres. The worker reads the sources through MCP, the model proxy calls DeepSeek, and the chat returns the pack. OTel exports the trace. The egress proxy is not opened.",
      },
    },
  },
  {
    label: "Questions on data",
    query: "What is our NPS?",
    route: {
      access: [
        {
          id: "chat",
          label: "Chat UI",
          note: "Customer insight asks a question on a number that already exists. No job is queued.",
        },
      ],
      control: [
        {
          id: "mcp",
          label: "MCP servers",
          note: "The saved definition is read from the read-only database. The definition is not changed.",
        },
      ],
      compute: [
        {
          id: "model",
          label: "Model proxy",
          note: "One short call. The model proxy opens port 8001 and no other port.",
        },
        {
          id: "qwen",
          label: "Qwen",
          note: "Qwen answers from the definition. Routing and a short answer are what this GPU is for.",
        },
      ],
      storage: [
        {
          id: "postgres",
          label: "Postgres 16",
          note: "Postgres logs the person and the question. The definition stays as it was.",
        },
        {
          id: "redis",
          label: "Redis 7",
          note: "Redis counts the budget for one small call.",
        },
      ],
      story: [
        {
          id: "chat",
          at: 1,
          system: "Chat UI",
          text: "The chat opens. Customer insight asks for NPS. No file is copied.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Gateway",
          text: "The gateway checks the person and the use case before the definition is read.",
        },
        {
          id: "mcp",
          at: 2,
          system: "MCP servers",
          text: "MCP reads the saved definition from the read-only database.",
        },
        {
          id: "qwen",
          at: 3,
          system: "Qwen",
          text: "The model proxy calls Qwen. Qwen answers from that definition and stops.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Postgres",
          text: "The question and the person are logged. The definition is unchanged. No model leaves the building.",
        },
      ],
      reply:
        "The question stays on the chat path. The gateway checks the person. MCP reads the saved definition. The model proxy calls Qwen. Postgres logs the call. The definition is left as it was.",
      setup: {
        overview:
          "**Customer insight** asks in the chat. No other team is called. The gateway checks the person, then Qwen answers from the saved definition.",
        time:
          "The answer comes back in a few seconds. Qwen answers on GPU 0, and the call ends there.",
        departments:
          "Customer insight asks. Data engineering published the definition into the database the MCP connector can read. They are not in this call.",
        handoff:
          "The handoff already happened, when the definition was stored. MCP reads it. The model proxy calls Qwen. Postgres logs the person and the question. The definition stays as it was.",
      },
    },
  },
  {
    label: "Documents",
    query: "Which policy passages apply to this vendor?",
    route: {
      access: [
        {
          id: "chat",
          label: "Chat UI",
          note: "Vendor management asks in the chat. The answer has to cite the passages.",
        },
        {
          id: "ingestion",
          label: "Ingestion",
          note: "Ingestion already synced SharePoint into Postgres. This question does not sync the files again.",
        },
      ],
      control: [
        {
          id: "mcp",
          label: "MCP servers",
          note: "The SharePoint connector confirms the policy files still sit where they were embedded.",
        },
      ],
      compute: [
        {
          id: "model",
          label: "Model proxy",
          note: "The model proxy calls the embedding model, the reranker, and Qwen. It is the only caller of those ports.",
        },
        {
          id: "embed",
          label: "Embeddings",
          note: "BGE-M3 on port 8003 vectorizes the question. The reranker on port 8004 scores the passages.",
        },
      ],
      storage: [
        {
          id: "postgres",
          label: "Postgres 16",
          note: "The vectors live in Postgres. The call is logged. The vendor file is not filed as a new record.",
        },
      ],
      story: [
        {
          id: "chat",
          at: 1,
          system: "Chat UI",
          text: "The chat opens with the vendor question. The vendor file stays where it already lives.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Gateway",
          text: "The gateway checks the person, the use case, and the budget before the index is searched.",
        },
        {
          id: "mcp",
          at: 2,
          system: "MCP servers",
          text: "MCP opens SharePoint only to confirm the passages. The files are not copied into the chat.",
        },
        {
          id: "embed",
          at: 3,
          system: "Embeddings",
          text: "The model proxy calls port 8003 and port 8004. The reranker scores the passages already stored.",
        },
        {
          id: "qwen",
          at: 3,
          system: "Qwen",
          text: "Qwen answers from those passages on port 8001. The egress proxy is not used.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Postgres",
          text: "Postgres holds the vectors and the log of the call. No new record of the vendor is written.",
        },
      ],
      reply:
        "Documents stay on the retrieval path. Ingestion has already written the SharePoint vectors to Postgres. The gateway checks the caller. The model proxy calls the embedding model, the reranker, and Qwen. The answer cites passages. It does not write a system of record.",
      setup: {
        overview:
          "**Vendor management** asks which passages apply. **Platform operations** keeps the index, the models, and the gateway. They are not on this call.",
        time:
          "The answer comes back in a few seconds. The policies were embedded earlier, when ingestion synced SharePoint.",
        departments:
          "Vendor management, or compliance, asks in the chat. Platform operations owns ingestion, Postgres, and the model proxy. The person asking reads the answer in the chat.",
        handoff:
          "The handoff is the cited passages. Ingestion has already written the vectors to Postgres. MCP confirms the file still sits in SharePoint. The model proxy calls the embedding model, the reranker, and Qwen. The answer quotes the passages. The egress proxy stays closed.",
      },
    },
  },
  {
    label: "Payments data",
    query: "Show merchant risk, and share it with the partner.",
    route: {
      access: [
        {
          id: "chat",
          label: "Chat UI",
          note: "Payments analytics asks in the chat. The partner is not given a login.",
        },
        {
          id: "egress",
          label: "Egress",
          note: "A share with the partner would leave the building. The gateway does not allow that for this request.",
        },
      ],
      control: [
        {
          id: "mcp",
          label: "MCP servers",
          note: "The read-only database opens the merchant figures for the internal answer.",
        },
        {
          id: "otel",
          label: "OTel",
          note: "The refused share is part of the trace. OTel exports it to the monitoring already in place.",
        },
      ],
      compute: [
        {
          id: "model",
          label: "Model proxy",
          note: "The model proxy may leave only when the use case policy allows an external model. This request does not.",
        },
        {
          id: "qwen",
          label: "Qwen",
          note: "Qwen answers the internal question on port 8001. The egress proxy is not opened.",
        },
      ],
      storage: [
        {
          id: "postgres",
          label: "Postgres 16",
          note: "The run is logged, including the refusal. No copy is made for the partner.",
        },
      ],
      story: [
        {
          id: "chat",
          at: 1,
          system: "Chat UI",
          text: "The chat opens. Payments analytics asks for merchant risk and a share with the partner.",
        },
        {
          id: "gateway",
          at: 2,
          system: "Gateway",
          text: "The gateway allows the internal read and refuses the share. The figures stay on the enterprise's machines.",
        },
        {
          id: "mcp",
          at: 2,
          system: "MCP servers",
          text: "MCP reads the merchant figures from the read-only database. No file is prepared for the partner.",
        },
        {
          id: "qwen",
          at: 3,
          system: "Qwen",
          text: "The model proxy calls Qwen for the internal answer. It does not call the external API.",
        },
        {
          id: "egress",
          at: 3,
          system: "Egress proxy",
          text: "The egress proxy stays closed. Only the model proxy could use it, and this policy does not allow that.",
        },
        {
          id: "postgres",
          at: 4,
          system: "Postgres",
          text: "Postgres logs the answer and the refused share. The partner sees nothing.",
        },
      ],
      reply:
        "Payments data is answered inside the gateway. Analytics asks in the chat. MCP reads the figures. The model proxy calls Qwen and does not open the egress proxy. Postgres logs the refused share. The partner is not given a path out.",
      setup: {
        overview:
          "**Payments analytics** asks inside the bank. An **outside partner** is not given a path out. The gateway refuses the egress because the figures stay on the enterprise's machines.",
        time:
          "The internal answer comes back in a few seconds. The partner grant is not written. There is no copy to wait for.",
        departments:
          "Payments analytics asks and reads the answer in the chat. Platform operations owns the egress rule. The partner is a separate firm, and this call does not reach them.",
        handoff:
          "The handoff stops at the gateway. The model proxy may leave only when the use case policy allows an external model. This request does not. Qwen answers inside. Postgres logs the refusal of the share. The partner sees nothing.",
      },
    },
  },
];

function FlowDiagram({ route, step }: { route: Route | null; step: number }) {
  const waiting = (id: string): Piece => ({ id, label: "Waiting", note: "" });
  const layers: {
    id: string;
    title: string;
    accent?: boolean;
    items: Piece[];
  }[] = [
    {
      id: "access",
      title: "Access",
      items: route && step >= 1 ? route.access : [waiting("access")],
    },
    {
      id: "control",
      title: "Control",
      items: route && step >= 2 ? route.control : [waiting("control")],
    },
    {
      id: "compute",
      title: "Compute",
      accent: Boolean(route && step >= 3),
      items: route && step >= 3 ? route.compute : [waiting("compute")],
    },
    {
      id: "storage",
      title: "Storage",
      items: route && step >= 4 ? route.storage : [waiting("storage")],
    },
  ];

  return (
    <div className="px-4 py-6">
      <div className="mx-auto grid w-max min-w-full grid-cols-[1fr_auto_1fr]">
        <p className="flex items-center justify-end gap-1.5 self-center pr-3 font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap uppercase">
          <span className="size-1.5 bg-accent" />
          Gateway
        </p>
        <span className="size-10 justify-self-center self-center bg-foreground" />
        <p className="invisible pr-3 font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap uppercase" aria-hidden>
          Gateway
        </p>
        {layers.map((layer, index) => {
          return (
            <Fragment key={layer.id}>
              <p className="mt-6 pr-3 text-right font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap text-accent uppercase">
                {layer.title}
              </p>
              <div className="flex flex-col items-center">
                <span className="h-6 w-px shrink-0 bg-foreground" />
                <div
                  className={`grid w-72 shrink-0 gap-3 border bg-surface px-3 py-3 text-center ${
                    layer.accent ? "border-accent" : "border-foreground"
                  }`}
                >
                  {layer.items.map((item) => (
                    <div key={item.id}>
                      <p className={`font-mono text-[0.65rem] tracking-[-0.01em] uppercase ${item.note ? "" : "text-faint"}`}>
                        {item.label}
                      </p>
                      {item.note ? (
                        <p className="mt-1 text-left text-sm leading-relaxed text-faint">
                          <span className="mb-0.5 block font-mono text-[0.6rem] tracking-[-0.01em] text-accent uppercase">Why</span>
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
                {index < layers.length - 1 ? <span className="w-px flex-1 bg-foreground" /> : null}
              </div>
              <p className="invisible mt-6 pr-3 text-right font-mono text-[0.65rem] tracking-[-0.01em] whitespace-nowrap uppercase" aria-hidden>
                {layer.title}
              </p>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function emphasis(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") ? (
      <strong key={index} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

function Description({ route, step }: { route: Route | null; step: number }) {
  const beats = route?.story?.filter((beat) => beat.at <= step) ?? [];
  if (!route) {
    return (
      <p className="p-4 text-sm leading-relaxed text-faint">
        Choose a request. This side names each part of the architecture that opens, and what happens to it.
      </p>
    );
  }
  if (!route.setup && beats.length === 0) {
    return <p className="p-4 text-sm leading-relaxed text-faint">The systems are opening.</p>;
  }
  const setup = route.setup
    ? [
        ["Setup", route.setup.overview],
        ["Time", route.setup.time],
        ["Departments", route.setup.departments],
        ["Handoff", route.setup.handoff],
      ]
    : [];
  return (
    <div className="grid content-start gap-3 p-4">
      {setup.map(([label, text]) => (
        <article key={label} className="border border-line px-3 py-3">
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{label}</p>
          <p className="mt-2 text-sm leading-relaxed text-faint">
            {label === "Setup" ? emphasis(text) : text}
          </p>
        </article>
      ))}
      {beats.map((beat) => (
        <article key={beat.id} className="border border-line px-3 py-3">
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">
            {beat.system}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-faint">{beat.text}</p>
        </article>
      ))}
    </div>
  );
}

type OperateId = "diagram" | "description" | "map";

const setupColumns: {
  access: { id: string; label: string };
  control: { id: string; label: string; detail: string; more: string };
  compute: { id: string; label: string; detail: string; more: string } | null;
  storage: { id: string; label: string; detail: string; more: string } | null;
}[] = [
  {
    access: { id: "chat", label: "Chat UI" },
    control: { id: "proxy", label: "Proxy", detail: "TLS entry point", more: "One URL, corporate SSO" },
    compute: { id: "qwen", label: "Qwen", detail: "GPU 0 · port 8001", more: "Chat and routing" },
    storage: { id: "redis", label: "Redis 7", detail: "Budgets and cache", more: "The gateway is the caller" },
  },
  {
    access: { id: "apps", label: "Enterprise apps" },
    control: { id: "worker", label: "Agent worker", detail: "Job queue workers", more: "Runs multi-step tasks" },
    compute: { id: "deepseek", label: "DeepSeek", detail: "GPU 1 · port 8002", more: "Compliance reasoning" },
    storage: { id: "postgres", label: "Postgres 16", detail: "Vectors, jobs, logs", more: "pg-boss queue" },
  },
  {
    access: { id: "ingestion", label: "Ingestion" },
    control: { id: "mcp", label: "MCP servers", detail: "Tool connectors", more: "SharePoint, database, sanctions" },
    compute: { id: "embed", label: "Embeddings", detail: "BGE-M3 · port 8003", more: "Reranker on port 8004" },
    storage: null,
  },
  {
    access: { id: "egress", label: "Egress" },
    control: { id: "otel", label: "OTel", detail: "Telemetry export", more: "The monitoring already in place" },
    compute: { id: "model", label: "Model proxy", detail: "Sole path to models", more: "Only service with a route out" },
    storage: null,
  },
];

function pieceOn(route: Route | null, layer: "access" | "control" | "compute" | "storage", id: string) {
  return route?.[layer].find((item) => item.id === id) ?? null;
}

function SetupMap({
  route,
  step,
  expanded = false,
}: {
  route: Route | null;
  step: number;
  expanded?: boolean;
}) {
  function on(layer: "access" | "control" | "compute" | "storage", id: string) {
    if (!route) return false;
    const min = layer === "access" ? 1 : layer === "control" ? 2 : layer === "compute" ? 3 : 4;
    return step >= min && Boolean(pieceOn(route, layer, id));
  }

  const catalogOn = Boolean(route && step >= 1);

  function card(
    layer: "access" | "control" | "compute" | "storage",
    node: { id: string; label: string; detail?: string; more?: string },
  ) {
    const active = on(layer, node.id);
    const why = active ? pieceOn(route, layer, node.id)?.note : "";
    return (
      <div
        className={`border bg-surface text-center ${expanded ? "px-3 py-3" : "px-1 py-1.5"} ${
          active ? "border-foreground" : route ? "border-line opacity-35" : "border-line"
        }`}
      >
        <p className={`font-mono uppercase leading-tight ${expanded ? "text-[0.7rem]" : "text-[0.55rem]"}`}>
          {node.label}
        </p>
        {expanded && node.detail ? (
          <p className="mt-2 text-sm leading-snug text-faint">
            {node.detail}. {node.more}.
          </p>
        ) : null}
        {expanded && why ? <p className="mt-2 text-left text-sm leading-relaxed text-faint">{why}</p> : null}
      </div>
    );
  }

  const band = expanded ? "px-3 py-4" : "px-1.5 py-2";

  return (
    <div className="grid min-w-[36rem] gap-3">
      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Access</p>
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) => (
            <div key={column.access.id}>{card("access", column.access)}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Control</p>
          <p className={`mt-3 font-mono uppercase leading-tight ${catalogOn ? "text-accent" : "text-faint"} ${expanded ? "text-[0.7rem]" : "text-[0.55rem]"}`}>
            Gateway
          </p>
          {expanded ? <p className="mt-1 text-sm leading-snug text-faint">Policy and routing. Checks every request.</p> : null}
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) => (
            <div key={column.control.id + column.access.id}>{card("control", column.control)}</div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Compute</p>
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) =>
            column.compute ? (
              <div key={column.compute.id}>{card("compute", column.compute)}</div>
            ) : (
              <div key={column.access.id} />
            ),
          )}
        </div>
      </div>

      <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] border border-[#d6d3d2] bg-[#f4f3f2]">
        <div className="px-2 py-3">
          <p className="font-mono text-[0.6rem] tracking-[-0.01em] uppercase">Storage</p>
        </div>
        <div className={`grid grid-cols-4 ${expanded ? "gap-3" : "gap-1.5"} ${band}`}>
          {setupColumns.map((column) =>
            column.storage ? (
              <div key={column.storage.id}>{card("storage", column.storage)}</div>
            ) : (
              <div key={column.access.id} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function windowOrigin() {
  const width = Math.min(44 * 16, window.innerWidth - 32);
  return {
    x: Math.max(16, window.innerWidth - width - 12),
    y: 88,
  };
}

function MapView({
  route,
  step,
  onClose,
}: {
  route: Route | null;
  step: number;
  onClose: () => void;
}) {
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const [size, setSize] = useState({ width: 704, height: 560 });
  const [playStep, setPlayStep] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const resize = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const playTimers = useRef<number[]>([]);
  const close = useRef(onClose);
  close.current = onClose;
  const shown = playStep ?? step;

  function stopPlay() {
    playTimers.current.forEach((timer) => window.clearTimeout(timer));
    playTimers.current = [];
  }

  function schedule(from: number) {
    const marks = [1, 2, 3, 4].filter((mark) => mark > from);
    if (marks.length === 0) {
      setPlaying(false);
      return;
    }
    setPlaying(true);
    marks.forEach((mark, index) => {
      playTimers.current.push(
        window.setTimeout(() => {
          setPlayStep(mark);
          if (mark === 4) setPlaying(false);
        }, 1000 * (index + 1)),
      );
    });
  }

  function play() {
    if (!route) return;
    if (playing) {
      stopPlay();
      setPlaying(false);
      return;
    }
    stopPlay();
    const from = playStep === null || playStep >= 4 ? 0 : playStep;
    if (from === 0) setPlayStep(0);
    schedule(from);
  }

  useLayoutEffect(() => {
    const width = Math.min(44 * 16, window.innerWidth - 32);
    const height = Math.min(640, window.innerHeight - 112);
    setPos(windowOrigin());
    setSize({ width, height });
  }, []);

  useEffect(() => {
    stopPlay();
    setPlayStep(null);
    setPlaying(false);
  }, [route]);

  useEffect(() => stopPlay, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close.current();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { dx: event.clientX - pos.x, dy: event.clientY - pos.y };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const width = panel.current?.offsetWidth ?? 320;
    const nextX = event.clientX - drag.current.dx;
    const nextY = event.clientY - drag.current.dy;
    setPos({
      x: Math.min(window.innerWidth - 120, Math.max(16 - width + 120, nextX)),
      y: Math.min(window.innerHeight - 48, Math.max(0, nextY)),
    });
  }

  function onPointerUp() {
    drag.current = null;
  }

  function onResizeDown(event: React.PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resize.current = { x: event.clientX, y: event.clientY, w: size.width, h: size.height };
  }

  function onResizeMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!resize.current) return;
    const maxW = window.innerWidth - pos.x - 12;
    const maxH = window.innerHeight - pos.y - 12;
    setSize({
      width: Math.min(maxW, Math.max(420, resize.current.w + event.clientX - resize.current.x)),
      height: Math.min(maxH, Math.max(280, resize.current.h + event.clientY - resize.current.y)),
    });
  }

  function onResizeUp() {
    resize.current = null;
  }

  return createPortal(
            <div
                ref={panel}
                role="dialog"
                aria-modal="false"
                aria-label="Setup diagram for this workflow"
                className="fixed z-[40] flex flex-col border border-foreground bg-background shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
                style={{ left: pos.x, top: pos.y, width: size.width, height: size.height }}
              >
                <div
                  className="flex shrink-0 cursor-grab touch-none items-center justify-between gap-4 border-b border-line px-5 py-3 active:cursor-grabbing"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">This workflow on the setup</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={play}
                      disabled={!route}
                      className="h-[31px] cursor-pointer bg-foreground px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] text-background uppercase disabled:cursor-default disabled:opacity-40"
                    >
                      {playing ? "Pause" : "Play"}
                    </button>
                    <button
                      type="button"
                      onClick={() => close.current()}
                      className="h-[31px] cursor-pointer border border-line bg-background px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <div className="min-h-0 flex-1 overflow-auto p-4">
                  <SetupMap route={route} step={shown} expanded />
                </div>
                <div
                  aria-label="Resize diagram"
                  className="absolute right-0 bottom-0 z-10 h-5 w-5 cursor-nwse-resize"
                  onPointerDown={onResizeDown}
                  onPointerMove={onResizeMove}
                  onPointerUp={onResizeUp}
                >
                  <span className="absolute right-1 bottom-1 block h-2 w-2 border-r border-b border-foreground" />
                </div>
            </div>,
    document.body,
  );
}

function OperateToggle({
  value,
  onSelect,
}: {
  value: OperateId | null;
  onSelect: (id: OperateId) => void;
}) {
  return (
    <div className="inline-flex max-w-full shrink-0 flex-wrap border border-line" role="group" aria-label="How the request runs">
      {(
        [
          { id: "diagram", label: "Trajectory" },
          { id: "description", label: "Description" },
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

function DiagramTab({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={open}
      onClick={onClick}
      className={`h-[31px] shrink-0 border border-line px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase ${
        open ? "bg-foreground text-background" : "bg-surface text-muted"
      }`}
    >
      Diagram
    </button>
  );
}

export function TtsDemo({ label = "Use Cases" }: { label?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(0);
  const [choice, setChoice] = useState<OperateId | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const operateView = choice === "description" ? "description" : "diagram";
  const run = useRef(0);
  const timers = useRef<number[]>([]);
  const thread = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    html.style.scrollBehavior = previousBehavior;

    function fit() {
      const el = frame.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      el.style.minHeight = `${Math.max(0, Math.ceil(window.innerHeight - top - 24))}px`;
    }

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function choose(id: OperateId) {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    setChoice((current) => (desktop || current !== id ? id : null));
  }

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

  function ask(text: string, next: Route) {
    const trimmed = text.trim();
    if (!trimmed) return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    const id = ++run.current;
    setRoute(next);
    setStep(0);
    setPlay((current) => current + 1);
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "person", text: trimmed },
    ]);
    [1, 2, 3, 4].forEach((mark, index) => {
      const timer = window.setTimeout(() => {
        if (run.current !== id) return;
        setStep(mark);
        if (mark === 4) {
          setMessages((current) => [
            ...current,
            { id: nextId.current++, role: "platform", text: next.reply },
          ]);
        }
      }, 450 * (index + 1));
      timers.current.push(timer);
    });
  }

  return (
    <>
      <div className="grid min-w-0 items-end gap-4 *:min-w-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="flex min-w-0 items-end gap-3 lg:block">
          <div className="min-w-0">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
              {label}
            </p>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
            <OperateToggle value={choice === "map" ? null : choice} onSelect={choose} />
            <DiagramTab open={mapOpen} onClick={() => setMapOpen(true)} />
          </div>
        </div>
        <p className="hidden font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase lg:block">
          How the request runs
        </p>
      </div>
      <div ref={frame} className="relative mt-3 flex flex-col">
        <div className="pointer-events-none invisible hidden lg:block" aria-hidden>
          <div className="border border-line">
            <div className="flex items-center justify-between gap-3 border-b border-line p-3">
              <OperateToggle value="diagram" onSelect={() => {}} />
              <DiagramTab open={false} onClick={() => {}} />
            </div>
            <FlowDiagram route={null} step={0} />
          </div>
        </div>
        <div className="grid min-h-0 w-full flex-1 items-stretch gap-4 lg:absolute lg:inset-0 lg:h-full lg:grid-rows-1 lg:overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div className={`flex h-full min-h-0 flex-col overflow-hidden border border-line bg-surface ${choice !== null ? "max-lg:hidden" : ""}`}>
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
            <div ref={thread} className="grid h-0 min-h-0 flex-1 content-start gap-3 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-sm leading-relaxed text-faint">
                  Choose a request. The path shows who arrives, the gateway check, the model it calls, and where the run is stored.
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
                      {message.role === "person" ? "You" : "System"}
                    </span>
                    {message.text}
                  </p>
                ))
              )}
            </div>
          </div>

          <aside
            className={`flex h-full min-h-0 flex-col overflow-hidden border border-line bg-surface ${choice === null ? "hidden lg:flex" : ""}`}
            aria-live="polite"
          >
            <div className="hidden shrink-0 items-center justify-between gap-3 border-b border-line p-3 lg:flex">
              <OperateToggle value={operateView} onSelect={choose} />
              <DiagramTab open={mapOpen} onClick={() => setMapOpen(true)} />
            </div>
            <div className="h-0 min-h-0 min-w-0 max-w-full flex-1 overflow-auto overscroll-contain">
              <div className={operateView === "diagram" ? "" : "hidden"}>
                <FlowDiagram key={play} route={route} step={step} />
              </div>
              <div className={operateView === "description" ? "" : "hidden"}>
                <Description route={route} step={step} />
              </div>
            </div>
            {mapOpen ? <MapView route={route} step={step} onClose={() => setMapOpen(false)} /> : null}
          </aside>
        </div>
      </div>
    </>
  );
}
