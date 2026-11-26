"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "@/components/button";

const views = [
  { id: "summary", label: "Summary" },
  { id: "models", label: "Models" },
  { id: "platform", label: "Platform" },
  { id: "request", label: "Request" },
  { id: "serving", label: "Serving" },
  { id: "demo", label: "Use Cases" },
  { id: "setup", label: "Architecture" },
] as const;

type View = (typeof views)[number]["id"];

function isView(value: string | null): value is View {
  return views.some((item) => item.id === value);
}

function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        {eyebrow}
      </p>
      {children}
    </section>
  );
}

function CardGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="border border-line bg-surface px-4 py-4">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
            {item.title}
          </p>
          <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

const modelFamilies: {
  title: string;
  stores: string;
  query: string;
  use: string;
}[] = [
  {
    title: "Chat",
    stores: "A dense or mixture-of-experts language model",
    query: "Chat completions, streamed tokens",
    use: "Answers, routing, and tool calls",
  },
  {
    title: "Reasoning",
    stores: "A model that spends tokens on a draft",
    query: "A longer generation, then the answer",
    use: "Compliance, credit, and anything a person will file",
  },
  {
    title: "Embeddings",
    stores: "A pooling model, not a generator",
    query: "One vector per passage",
    use: "Retrieval over the documents the company already keeps",
  },
  {
    title: "Rerankers",
    stores: "A cross-encoder over query and passage",
    query: "A score for each candidate",
    use: "The short list after search, before the model reads",
  },
  {
    title: "Speech",
    stores: "An automatic speech recognition model",
    query: "Transcription or translation",
    use: "A call or a recording turned into text",
  },
  {
    title: "Multimodal",
    stores: "A model that reads text and an image",
    query: "Chat with an image part",
    use: "A scanned page, a chart, a photo of a form",
  },
  {
    title: "Draft",
    stores: "A small model or an EAGLE head",
    query: "Speculative tokens the target then checks",
    use: "Lower latency when the GPUs are not full",
  },
  {
    title: "Adapters",
    stores: "A LoRA on a shared base model",
    query: "The same engine, a different adapter per request",
    use: "One GPU, several team-specific behaviors",
  },
];

const hoverInfo: Record<string, string> = {
  Server:
    "vLLM's HTTP server speaks the OpenAI chat, completions, and embeddings APIs. An application that already calls those routes can point at the engine. The enterprise gateway still stands in front.",
  Scheduler:
    "Requests do not wait for a batch to fill. The scheduler adds a new request to the running batch and removes one when it finishes. Prefill of a long prompt is cut into chunks so decode of other requests keeps moving.",
  Attention:
    "PagedAttention stores the key and value cache in fixed-size pages, the way an operating system stores memory. A sequence only holds the pages it has used. Two requests that share a prefix can share those pages.",
  Execution:
    "The forward pass is captured in a CUDA or HIP graph so the GPU is not retold the same launch every token. Kernels for attention and the mixture-of-experts layers are chosen for the hardware.",
  Weights:
    "The model files live on the enterprise's machines. Quantization (FP8, INT8, INT4, GPTQ, AWQ, GGUF) is a smaller copy of those weights, loaded onto the GPU. The engine does not train them.",
  Cluster:
    "The production stack puts a router in front of several engines. It sends a request to the replica that already holds the matching prefix, and Prometheus plus KEDA add replicas when requests are waiting.",
  "vLLM":
    "The open-source inference engine, Apache-2.0. It began at UC Berkeley's Sky Computing Lab and is maintained in the open. It serves the model. It does not own the conversation or the file.",
  "OpenAI-compatible server":
    "POST /v1/chat/completions, /v1/completions, and /v1/embeddings, plus the Responses API and speech routes. The body is the industry shape. The process answering it is vLLM on the local GPU.",
  PagedAttention:
    "KV cache is split into blocks. Logical tokens map to physical blocks through a block table. Waste is the last partial block of a sequence, not a reserved maximum length that was never used.",
  "Production stack":
    "A reference deployment: serving engines, a request router, and Prometheus with Grafana. Helm installs it. Applications keep calling the same API when a second replica appears.",
  Router:
    "Picks an engine for the request. A session or a shared prefix stays on the replica that already cached it, so the next turn does not recompute the prompt.",
  "Prefix cache":
    "The KV pages for a repeated prompt, a system message, or a long document that many questions share. A later request reuses those pages instead of prefill from token zero.",
  "Continuous batching":
    "The batch changes every step. A finished request leaves. A waiting request joins. The GPU does not sit idle until a fixed group of users all arrives.",
  "Chunked prefill":
    "A long prompt is processed in pieces and interleaved with decode of requests already running. One large document does not stall every other token on the GPU.",
  "KV cache":
    "The keys and values already computed for the tokens so far. Decode reads this cache instead of rereading the whole prompt. It is the memory that limits how many requests fit.",
  "Tensor parallel":
    "The model is split across GPUs in one machine. Each GPU holds a slice of each layer. Use it when one GPU cannot hold the weights.",
  "Pipeline parallel":
    "Layers are split across GPUs or nodes, each stage holding a range of layers. Used when the model does not fit on one machine, or when the GPUs are not linked by a fast interconnect.",
  Quantization:
    "Weights stored in fewer bits. FP8, INT8, INT4, GPTQ, AWQ, and GGUF are formats vLLM can load. The same architecture, less GPU memory, a measured change in quality.",
  "Speculative decoding":
    "A draft method proposes several tokens. The target model checks them in one pass and keeps the prefix it agrees with. EAGLE, multi-token prediction, a draft model, n-gram, and suffix matching are the methods.",
  LoRA:
    "A small set of extra weights on a frozen base model. Several adapters can sit on one engine. A request names the adapter. The base weights stay shared.",
  "Disaggregated prefill":
    "Prefill and decode run on different engines. The KV cache is transferred from the prefill worker to the decode worker. Long prompts and token generation no longer compete for the same GPU.",
  Replica:
    "One running copy of an engine and its weights. The router spreads requests across replicas. KEDA adds a replica when too many requests are waiting, and removes one when the queue drains.",
  "Model proxy":
    "The only path from the enterprise to the engines. It checks policy, identity, and budget, then forwards an OpenAI-shaped request. A client does not open a port on the GPU machine.",
  Token:
    "The unit the model reads and writes. A prompt is a sequence of tokens. Each decode step appends one accepted token, or several when speculation is verified.",
  Streaming:
    "Tokens are sent as they are accepted, over the HTTP response. The caller does not wait for the last token before showing the first.",
};

export function InferenceSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("view");
  const view: View = isView(requested) ? requested : "summary";
  const [hoverTip, setHoverTip] = useState<{ title: string; body: string; x: number; y: number } | null>(null);

  function select(next: View) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "summary") params.delete("view");
    else params.set("view", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function showHover(event: ReactMouseEvent<HTMLElement>, title: string) {
    const body = hoverInfo[title];
    if (!body) return;
    const width = 320;
    const height = 240;
    let x = event.clientX + 14;
    let y = event.clientY + 16;
    if (x + width > window.innerWidth - 8) x = event.clientX - width - 12;
    if (y + height > window.innerHeight - 8) y = event.clientY - height - 12;
    setHoverTip({ title, body, x: Math.max(8, x), y: Math.max(8, y) });
  }

  function Term({ title, label }: { title: string; label?: string }) {
    return (
      <span
        className="cursor-help underline decoration-dotted decoration-line underline-offset-[3px]"
        onMouseEnter={(event) => showHover(event, title)}
        onMouseMove={(event) => showHover(event, title)}
        onMouseLeave={() => setHoverTip(null)}
      >
        {label ?? title}
      </span>
    );
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex w-full max-w-full flex-wrap items-center gap-2 lg:contents">
          <button
            type="button"
            aria-pressed={view === "demo"}
            onClick={() => select("demo")}
            className={`group relative order-last inline-flex h-[31px] items-center justify-center overflow-hidden border px-3.5 font-mono text-[0.8125rem] leading-none tracking-[-0.0175rem] capitalize lg:order-none ${
              view === "demo"
                ? "border-transparent bg-ink text-paper [--stripe:rgba(255,255,255,0.18)]"
                : "border-line-strong bg-background text-foreground [--stripe:rgba(0,0,0,0.14)]"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Use Cases <ArrowRight />
            </span>
            <span
              aria-hidden
              className="stripe-hover pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
            />
          </button>
          <div
            className="contents lg:ml-auto lg:flex lg:w-fit lg:max-w-full lg:flex-wrap lg:justify-end lg:gap-0 lg:border lg:border-line"
            role="group"
            aria-label="View"
          >
            {views
              .filter((item) => item.id !== "demo")
              .map((item, index) => {
                const selected = view === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(item.id)}
                    className={`h-[31px] px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase max-lg:border max-lg:border-line ${
                      index > 0 ? "lg:border-l lg:border-line" : ""
                    } ${selected ? "bg-foreground text-background" : "bg-surface text-muted"}`}
                  >
                    {item.label}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {view === "summary" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Inference">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              vLLM is the open-source engine that runs a model on the enterprise's GPUs. It began at UC Berkeley's Sky Computing Lab, it is Apache-2.0, and it serves tokens. The weights stay on the machines. A model proxy is the only path in.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Layer</th>
                    <th className="px-4 py-3 font-normal text-muted">What runs</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Server", "OpenAI-compatible HTTP, chat, completions, embeddings, speech"],
                      ["Scheduler", "Continuous batching, chunked prefill, queue of waiting requests"],
                      ["Attention", "PagedAttention, prefix cache, shared KV pages"],
                      ["Execution", "CUDA and HIP graphs, attention and MoE kernels, quantization"],
                      ["Weights", "Model files on the machine, plus LoRA adapters on a shared base"],
                      ["Cluster", "Router, replicas, Prometheus, Grafana, KEDA"],
                    ] as const
                  ).map(([layer, products]) => (
                    <tr key={layer} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <Term title={layer} />
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{products}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-10 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
              Concepts
            </p>
            <p className="mt-3 max-w-2xl text-base leading-snug text-faint">
              The words the rest of this page uses. Hover a name to see an example.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Concept</th>
                    <th className="px-4 py-3 font-normal text-muted">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["vLLM", "The engine that loads a model and generates tokens. It does not store the business record and it does not train the weights."],
                    ["OpenAI-compatible server", "The HTTP shape applications already speak. Chat, completions, embeddings, responses, and speech. The process behind the route is local."],
                    ["Model proxy", "The enterprise door. Policy, identity, and budget are checked here. The GPU port is not open to the caller."],
                    ["PagedAttention", "KV cache in fixed pages, mapped by a block table. A sequence allocates pages as tokens arrive, and can share a prefix with another sequence."],
                    ["KV cache", "Keys and values for tokens already seen. Decode reads the cache. GPU memory for this cache is what caps concurrency."],
                    ["Continuous batching", "The running batch gains and loses requests at every step. A finished chat leaves. A waiting one joins."],
                    ["Chunked prefill", "A long prompt is split so it does not monopolize the GPU. Decode of other requests continues between chunks."],
                    ["Prefix cache", "Reuse of KV pages for a system prompt, a document, or a session. The router prefers the replica that already holds those pages."],
                    ["Tensor parallel", "One layer split across the GPUs in a machine, when the weights do not fit on one device."],
                    ["Pipeline parallel", "A range of layers on each GPU or node. The way a model crosses machines, or crosses GPUs that are not tightly linked."],
                    ["Quantization", "Fewer bits per weight: FP8, INT8, INT4, GPTQ, AWQ, GGUF. Loaded by the same engine, using less memory."],
                    ["Speculative decoding", "A draft proposes tokens. The target model verifies them and keeps the prefix it accepts. Useful when latency matters more than a full GPU."],
                    ["LoRA", "Extra weights for one behavior, on a frozen base. Several adapters, one set of base weights, the request names which adapter."],
                    ["Disaggregated prefill", "Prompt processing and token generation on separate engines, with the KV cache moved from one to the other."],
                    ["Replica", "One engine process and the weights it loaded. Scale is more replicas, not a larger prompt."],
                    ["Streaming", "Tokens leave as they are accepted. The caller renders the answer while decode continues."],
                    ["Token", "The piece of text the model actually reads. Limits, cache size, and cost are counted in tokens, not in characters."],
                  ].map(([concept, meaning]) => (
                    <tr key={concept} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <Term title={concept} />
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Products">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The pieces of an inference platform built on vLLM, and why an enterprise cares.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Product</th>
                    <th className="px-4 py-3 font-normal text-muted">What it does</th>
                    <th className="px-4 py-3 font-normal text-muted">Why an enterprise cares</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["vLLM", "Loads weights and runs prefill and decode", "The model runs on hardware the company controls"],
                      ["OpenAI-compatible server", "Chat, completions, embeddings, speech", "Applications keep their client and change the base URL"],
                      ["PagedAttention", "Pages the KV cache and shares prefixes", "More concurrent requests in the same GPU memory"],
                      ["Production stack", "Engines, router, and dashboards", "A second replica does not change the application"],
                      ["Router", "Sends a request to the engine with the cache", "A follow-up question stays cheap"],
                      ["Prefix cache", "Keeps KV pages for repeated prompts", "The system prompt is not prefilled on every call"],
                      ["LoRA", "Serves adapters on one base model", "A team-specific behavior without a second full copy"],
                      ["Model proxy", "The only door to the engines", "Policy and budget sit outside the GPU process"],
                    ] as const
                  ).map(([product, what, why]) => (
                    <tr key={product} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <Term title={product} />
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{what}</td>
                      <td className="px-4 py-3 text-sm text-faint">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Seven workflows">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Common inference work, and the part of the engine that carries it.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Use case</th>
                    <th className="px-4 py-3 font-normal text-muted">What gets built</th>
                    <th className="px-4 py-3 font-normal text-muted">Engine pieces</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Employee chat", "A streamed answer from a general model", "One engine, prefix cache for the system prompt"],
                    ["Compliance draft", "A longer generation a person will review", "A separate reasoning model, its own GPU"],
                    ["Embeddings", "A vector for each passage", "An embedding model, the embeddings route"],
                    ["Rerank", "An ordered short list before the answer", "A reranker, called before chat"],
                    ["Tool call", "A structured call the agent then runs", "Chat completions, the tool schema in the request"],
                    ["Overnight batch", "Many prompts, no person waiting", "Continuous batching, a batch route"],
                    ["Team adapter", "One base model, a behavior per team", "Multi-LoRA on a shared engine"],
                  ].map(([useCase, what, pieces]) => (
                    <tr key={useCase} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {useCase}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{what}</td>
                      <td className="px-4 py-3 text-sm text-faint">{pieces}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          {hoverTip ? (
            <div
              className="pointer-events-none fixed z-50 w-80 border border-line bg-surface px-4 py-3 shadow-sm"
              style={{ left: hoverTip.x, top: hoverTip.y }}
            >
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{hoverTip.title}</p>
              <p className="mt-1 text-sm leading-snug text-faint">{hoverTip.body}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {view === "models" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Models">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The families below are the models an enterprise actually serves. The query column is the API shape. The weights stay on the GPU that loaded them.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Family</th>
                    <th className="px-4 py-3 font-normal text-muted">What it stores</th>
                    <th className="px-4 py-3 font-normal text-muted">How you call it</th>
                    <th className="px-4 py-3 font-normal text-muted">Enterprise use</th>
                  </tr>
                </thead>
                <tbody>
                  {modelFamilies.map((family) => (
                    <tr key={family.title} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {family.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{family.stores}</td>
                      <td className="px-4 py-3 text-sm text-faint">{family.query}</td>
                      <td className="px-4 py-3 text-sm text-faint">{family.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="The call picks the engine">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              One engine process loads one primary model. A chat model and an embedding model are different processes, often on different GPUs. The proxy chooses the process. The caller does not.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Chat engine",
                  body: "A general model for short answers, routing, and tool calls. The system prompt is cached. Tokens stream back.",
                },
                {
                  label: "Reasoning engine",
                  body: "A separate model for work a person will sign. It spends more tokens. It does not share a queue with interactive chat.",
                },
                {
                  label: "Embedding engine",
                  body: "Pooling, not generation. A passage goes in and a vector comes out. The document index calls this. Chat does not.",
                },
                {
                  label: "Adapter on the base",
                  body: "When the behavior is small, a LoRA rides on the chat model. A new full model is reserved for a different task, not a different tone.",
                },
              ].map((item) => (
                <div key={item.label} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">{item.label}</p>
                  <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section eyebrow="From weights to a token">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The model file is loaded once. After that, a request is tokens in and tokens out. Nothing in this path updates the weights.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["01", "Place", "Weights sit on the machine, in a format the engine can load, including a quantized copy when memory is tight."],
                ["02", "Load", "The engine maps the weights onto one GPU, or across GPUs with tensor or pipeline parallel."],
                ["03", "Admit", "The scheduler takes a waiting request into the running batch. A long prompt is chunked."],
                ["04", "Prefill", "The prompt is read. KV pages are allocated. A repeated prefix reuses pages already in cache."],
                ["05", "Decode", "Each step appends a token. Speculative decoding may propose several, and the target keeps the ones it accepts."],
                ["06", "Return", "Tokens stream to the proxy. The engine keeps no business record of the answer."],
              ].map(([n, label, body]) => (
                <div key={n} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {n} {label}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{body}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      ) : null}

      {view === "platform" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Clients">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Four callers, one proxy, and an engine that only sees the request the proxy forwarded.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["01", "Chat", "An employee question. The proxy picks the chat engine. Tokens stream into the thread."],
                ["02", "Agents", "A worker sends a tool-calling request. The engine returns the call. The worker, not the engine, runs the tool."],
                ["03", "Retrieval", "The document path asks for embeddings, then a rerank, then a short chat over the passages."],
                ["04", "Batch jobs", "A pipeline sends many prompts when nobody is waiting. The same API, a different time of day."],
              ].map(([n, title, body]) => (
                <div key={n} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {n} {title}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{body}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section eyebrow="Five kinds of control">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The engine generates. The controls around it decide who may call, which model runs, and when a replica is added.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Control</th>
                    <th className="px-4 py-3 font-normal text-muted">Used for</th>
                    <th className="px-4 py-3 font-normal text-muted">How it runs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Model proxy", "The only entrance", "Checks identity, policy, and budget, then forwards"],
                    ["Router", "Which replica answers", "Prefers the engine that already holds the prefix"],
                    ["Scheduler", "Who is on the GPU this step", "Continuous batching and chunked prefill"],
                    ["Quantization and parallel", "Whether the model fits", "Fewer bits, or a split across GPUs, chosen at load"],
                    ["KEDA", "How many replicas", "Watches waiting requests and adds or removes engines"],
                  ].map(([control, use, how]) => (
                    <tr key={control} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {control}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{use}</td>
                      <td className="px-4 py-3 text-sm text-faint">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Three kinds of GPU work">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Prefill reads the prompt. Decode writes the next token. A third path moves the cache when those two jobs sit on different machines.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Work</th>
                    <th className="px-4 py-3 font-normal text-muted">Used for</th>
                    <th className="px-4 py-3 font-normal text-muted">How it runs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Prefill", "The prompt, the document, the system message", "Reads tokens and fills KV pages. Chunked so it can yield."],
                    ["Decode", "The next token", "One step per token, or several when speculation is verified."],
                    ["KV transfer", "Disaggregated prefill", "The prefill worker ships the cache to the decode worker."],
                  ].map(([kind, use, how]) => (
                    <tr key={kind} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {kind}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{use}</td>
                      <td className="px-4 py-3 text-sm text-faint">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="What is stored">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Weights are files on the machine. The KV cache is GPU memory for the requests in flight. The prompt is not a new record.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Store</th>
                    <th className="px-4 py-3 font-normal text-muted">Used for</th>
                    <th className="px-4 py-3 font-normal text-muted">How it is kept</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Weights", "The model itself", "Files on the machine, loaded into GPU memory at start"],
                    ["KV cache", "Tokens already read", "Pages in GPU memory, shared when prefixes match, dropped when the request ends"],
                    ["Adapters", "A small behavior change", "LoRA weights beside the base, selected per request"],
                    ["Metrics", "Queue depth, latency, cache use", "Prometheus, read by Grafana and by KEDA"],
                  ].map(([storage, use, how]) => (
                    <tr key={storage} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {storage}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{use}</td>
                      <td className="px-4 py-3 text-sm text-faint">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="What you already run">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The engines stay on the enterprise's GPUs. The proxy is the new door. Applications change a base URL, not a vendor.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Already running</th>
                    <th className="px-4 py-3 font-normal text-muted">What you do</th>
                    <th className="px-4 py-3 font-normal text-muted">What stays</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["GPU machines", "Install the engine and load the model that fits", "The hardware, and the rule that weights do not leave"],
                    ["Chat applications", "Point them at the proxy's OpenAI-compatible route", "The application code that renders tokens"],
                    ["A hosted API", "Move the call behind the proxy once the local model is good enough", "The contract of the request body"],
                    ["Document retrieval", "Call the embedding engine, then the chat engine", "The files, which stay in their source"],
                    ["Overnight jobs", "Send the batch when the interactive queue is quiet", "The pipeline that owns the business table"],
                  ].map(([system, action, stays]) => (
                    <tr key={system} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {system}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{action}</td>
                      <td className="px-4 py-3 text-sm text-faint">{stays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="One deployment">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              One cluster for the company. Engines for each model. A router and a proxy in front.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Engines", "One process per model, or per replica of that model. Tensor parallel when the weights need several GPUs."],
                ["Router", "From the production stack. It keeps a session on the replica whose prefix cache will hit."],
                ["Proxy", "Identity, policy, and the choice of model. The GPU process is not on the enterprise network by itself."],
              ].map(([label, body]) => (
                <div key={label} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">{label}</p>
                  <p className="mt-2 text-sm leading-snug text-faint">{body}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      ) : null}

      {view === "request" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Request representation">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              A question is one request. The messages, the token ids, the KV pages, and the streamed tokens each have a home. The engine keeps them for the life of the call. It does not file them.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Part</th>
                    <th className="px-4 py-3 font-normal text-muted">The fact</th>
                    <th className="px-4 py-3 font-normal text-muted">Product</th>
                    <th className="px-4 py-3 font-normal text-muted">Where it lives</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Messages", "System, user, and tool turns", "OpenAI-compatible server", "The JSON body, until the call ends"],
                    ["Tokens", "The ids the model reads", "vLLM", "Produced by the tokenizer on the engine"],
                    ["Prefix", "The repeated system or document tokens", "Prefix cache", "KV pages kept for the next request that shares them"],
                    ["KV pages", "Keys and values so far", "PagedAttention", "GPU memory, allocated a block at a time"],
                    ["Adapter", "Which LoRA, if any", "LoRA", "Named on the request, weights already loaded"],
                    ["Sample", "Temperature, stop, max tokens", "Scheduler", "Applied at decode, not stored as a policy"],
                    ["Stream", "Tokens as they are accepted", "Server", "The HTTP response back through the proxy"],
                    ["Tool call", "A name and arguments", "Chat completions", "Returned to the agent. The engine does not run the tool."],
                  ].map(([part, fact, product, where]) => (
                    <tr key={part} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {part}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{fact}</td>
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                        {product}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          {(
            [
              {
                eyebrow: "A chat turn",
                intro: "One employee question. The system prompt is already cached. Only the new sentence is prefilled.",
                rows: [["Turn", "The new user message on top of the cached system prompt", "Prefix cache, chat engine", "Tokens stream back. The thread is stored by the application, not by the engine."]],
              },
              {
                eyebrow: "A passage",
                intro: "One chunk from a document, embedded for search. No decode loop.",
                rows: [["Passage", "The text of one chunk", "Embedding engine", "A vector returns. The passage itself stays in the document source."]],
              },
              {
                eyebrow: "A compliance draft",
                intro: "One longer generation on the reasoning model. A person files the result. The engine does not.",
                rows: [["Draft", "The prompt plus the retrieved passages", "Reasoning engine", "The tokens are the draft. Postgres, or the case tool, is where the draft is kept."]],
              },
            ] as const
          ).map((table) => (
            <Section key={table.eyebrow} eyebrow={table.eyebrow}>
              <p className="mt-5 max-w-xl text-base leading-snug text-faint">{table.intro}</p>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[48rem] text-left text-sm">
                  <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                    <tr>
                      <th className="px-4 py-3 font-normal text-muted">Part</th>
                      <th className="px-4 py-3 font-normal text-muted">The fact</th>
                      <th className="px-4 py-3 font-normal text-muted">Product</th>
                      <th className="px-4 py-3 font-normal text-muted">Where it lives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map(([part, fact, product, where]) => (
                      <tr key={part} className="border-t border-line">
                        <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                          {part}
                        </td>
                        <td className="px-4 py-3 text-sm text-faint">{fact}</td>
                        <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                          {product}
                        </td>
                        <td className="px-4 py-3 text-sm text-faint">{where}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          ))}
        </div>
      ) : null}

      {view === "serving" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Serving">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              Serving is the path from an OpenAI-shaped request to tokens. vLLM does not hold a connection to the business systems. The model proxy forwards the request. The engine runs it. The application decides what to keep.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
              A person can ask a short question, or an agent can send the same route with tools. The second call in a thread should hit the prefix cache. A different model, such as embeddings or a reasoning model, is a different engine. The proxy chooses. The request body does not name a GPU.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
              The weights were loaded at start. A request does not change them. Quantization, tensor parallel, and LoRA were chosen then. Speculation, if it is on, only changes how many tokens are proposed before the target model agrees.
            </p>
          </Section>
          <Section eyebrow="How a request runs">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              The GPU sees a batch. The caller sees a stream. The scheduler is what joins those two.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Step</th>
                    <th className="px-4 py-3 font-normal text-muted">What the platform does</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1. Enter", "The model proxy checks the caller and the budget, then forwards an OpenAI-shaped body. The engine port is not the caller's address."],
                    ["2. Route", "The router picks a replica. A session, or a long shared prefix, stays on the engine that already cached it."],
                    ["3. Tokenize", "The engine turns messages into token ids, including the tool schema when the request has one."],
                    ["4. Admit", "The scheduler places the request in the running batch. If the prompt is long, prefill is chunked so other requests keep decoding."],
                    ["5. Prefill", "New tokens fill KV pages. A hit in the prefix cache skips that work. Pages are shared, and a write copies a page instead of corrupting the shared one."],
                    ["6. Decode", "Each step appends a token. With speculative decoding, a draft proposes several and the target keeps the prefix it accepts."],
                    ["7. Stream", "Accepted tokens go back through the proxy as they are produced. A tool call is returned as structure. The engine does not execute it."],
                    ["8. Release", "When the request finishes or is cancelled, its private KV pages are freed. Shared prefix pages stay while something still references them."],
                  ].map(([step, body]) => (
                    <tr key={step} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {step}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="One request, end to end">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              An employee asks a follow-up in chat. The proxy allows the call and sends it to the chat engine. The router finds the replica that served the previous turn, so the system prompt and the earlier messages are prefix hits. Only the new sentence is prefilled.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
              Decode streams tokens into the thread. A second request, an embedding of a policy passage, never enters this batch. It goes to the embedding engine. The chat model is not asked to invent a vector, and the embedding model is not asked to write a sentence.
            </p>
          </Section>
          <Section eyebrow="What the engine refuses">
            <CardGrid
              items={[
                {
                  title: "No training",
                  body: "A request does not update weights. Fine-tuning and adapters are loaded as files. They are not a side effect of chat.",
                },
                {
                  title: "No open GPU port",
                  body: "Callers reach the proxy. The engine's own key, where it is set, is not a substitute for enterprise policy.",
                },
                {
                  title: "No second record",
                  body: "The engine does not write the answer into a case, a table, or a file. The application does that, after a person or a policy agrees.",
                },
                {
                  title: "No unbounded context",
                  body: "KV memory is finite. A prompt past the configured limit is rejected. The scheduler does not silently drop other users to make room.",
                },
                {
                  title: "No unverified draft",
                  body: "Speculative tokens are proposals. Only the prefix the target model accepts is returned.",
                },
                {
                  title: "No tool execution",
                  body: "A tool call is text in the response. The worker that holds the credentials runs the tool, then sends the result back as the next request.",
                },
              ]}
            />
          </Section>
        </div>
      ) : null}

      {view === "demo" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Use cases">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Each case is a call to a model that is already loaded. The weights stay on the GPU. The business record, if there is one, is written somewhere else.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Use case</th>
                    <th className="px-4 py-3 font-normal text-muted">Who calls</th>
                    <th className="px-4 py-3 font-normal text-muted">What stays off the engine</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Employee chat", "The chat application", "The thread, stored by the application"],
                    ["Compliance draft", "A reviewer, through the agent", "The filed memo, stored by the case system"],
                    ["Embeddings", "The document index", "The passage, which stays in the source file"],
                    ["Rerank", "Retrieval, before the answer", "The decision of which passage is cited"],
                    ["Tool call", "An agent worker", "The tool, and the credentials to run it"],
                    ["Overnight batch", "A pipeline", "The table the scores are written into"],
                    ["Team adapter", "A team application", "The base weights, shared, not copied per team"],
                  ].map(([useCase, who, stays]) => (
                    <tr key={useCase} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {useCase}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{who}</td>
                      <td className="px-4 py-3 text-sm text-faint">{stays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Employee chat">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              The proxy sends the turn to the chat engine. The system prompt hits the prefix cache. Tokens stream. The application appends them to the thread. The engine drops the request's private cache when the turn ends.
            </p>
          </Section>
          <Section eyebrow="Compliance draft">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              The agent sends passages and the question to the reasoning engine, on its own GPU, so a long draft does not delay chat. A person reads the tokens and files them. The engine never opens the case system.
            </p>
          </Section>
          <Section eyebrow="Embeddings and rerank">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              A new document is split into passages. The embedding engine returns a vector per passage. At question time, candidates are reranked, then the chat engine sees only the short list. Three calls, three shapes, one proxy.
            </p>
          </Section>
          <Section eyebrow="Team adapter">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              Two teams share a base model. Each request names a LoRA. The base weights stay one copy in GPU memory. A third team that needs a different model gets an engine, not another adapter.
            </p>
          </Section>
        </div>
      ) : null}

      {view === "setup" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Architecture">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The model proxy is the only path in. Behind it, a router chooses an engine. The engine is vLLM, with the weights on the enterprise's GPUs. Prefill and decode can share a process, or sit apart and pass the KV cache.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Caller", "Chat, an agent, retrieval, or a batch job. They speak the OpenAI shape."],
                ["02", "Proxy", "Identity, policy, and budget. Picks chat, reasoning, embeddings, or rerank."],
                ["03", "Router", "Chooses the replica. Prefers a prefix-cache hit."],
                ["04", "Scheduler", "Continuous batching. Chunked prefill. A queue of who is waiting."],
                ["05", "Prefill", "Tokens become KV pages. Shared prefixes are reused."],
                ["06", "Decode", "The next token, verified if a draft proposed it."],
                ["07", "GPU", "Weights and the KV cache. Tensor parallel when one device is not enough."],
                ["08", "Stream", "Tokens return through the proxy. The engine writes nothing else."],
              ].map(([n, label, body]) => (
                <div key={n} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {n} {label}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{body}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section eyebrow="What moves, and what stays">
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Piece</th>
                    <th className="px-4 py-3 font-normal text-muted">Moves during a call</th>
                    <th className="px-4 py-3 font-normal text-muted">Stays on the machine</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Weights", "Nothing. They were loaded at start", "The model files and the GPU copy"],
                    ["Prompt", "Token ids into the engine", "The source document, if the prompt quoted one"],
                    ["KV cache", "Pages from prefill to decode, if those are split", "GPU memory, freed when the request ends"],
                    ["Tokens", "The stream back to the caller", "No transcript inside the engine"],
                    ["Tools", "A tool-call object in the response", "The credentials and the side effect, which the worker owns"],
                  ].map(([piece, moves, stays]) => (
                    <tr key={piece} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {piece}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{moves}</td>
                      <td className="px-4 py-3 text-sm text-faint">{stays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Scale">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              One GPU is enough when the model fits and the queue is short. Tensor parallel splits a model that does not fit. Replicas, added by KEDA when requests wait, split a queue that is too deep. Pipeline parallel and disaggregated prefill split the work across machines. None of these copy the weights off the estate.
            </p>
          </Section>
        </div>
      ) : null}
    </div>
  );
}
