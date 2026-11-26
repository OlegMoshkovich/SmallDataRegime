const machines = [
  {
    name: "ai-app VM",
    size: "16 vCPU, 64 GB RAM, 1 TB SSD; RHEL 9 or Ubuntu 24.04; Docker Compose v2",
    runs: "Proxy, UI, gateway ×2, agent worker ×2, ingestion, MCP servers, model proxy, Postgres, Redis, OTel",
  },
  {
    name: "ai-gpu host",
    size: "Existing GPU server, at least 2× 80 GB GPUs; 32 vCPU, 256 GB RAM, 2 TB NVMe",
    runs: "vLLM Qwen, vLLM DeepSeek, embeddings, reranker",
  },
];

const reach = [
  { title: "One URL", body: "ai.enterprise.internal on 443, internal CA certificate", accent: true },
  { title: "Paths", body: "UI at /, API at /api/v1", accent: false },
  { title: "Who", body: "Corporate network and VPN only", accent: false },
  { title: "GPU firewall", body: "Model ports open to ai-app only", accent: false },
];

const stack = [
  ["Language", "TypeScript 5, Node.js 22 LTS", "One language from API to agents"],
  ["HTTP", "Fastify", "Fast, schema-first"],
  ["Validation", "Zod; OpenAPI from it", "One schema for API, policy, output"],
  ["Agent tools", "MCP TypeScript SDK", "One standard for every connector"],
  ["Jobs", "pg-boss on Postgres", "Durable runs, no extra broker"],
  ["Data", "Postgres 16 + pgvector, Redis 7", "Logs, runs, vectors, text in one DB"],
  ["Model access", "A model proxy, already at the enterprise", "Adapters and keys stay put"],
  ["Serving", "vLLM; embedding server", "OpenAI-compatible, shared GPUs"],
  ["Telemetry", "OpenTelemetry", "Into existing monitoring"],
  ["Tests", "Vitest, Testcontainers, evals/", "Quality tested like code"],
  ["CI", "Enterprise CI; Trivy, cosign, SBOM", "Signed images, internal registry"],
] as const;

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
      <span className="size-1.5 bg-accent" aria-hidden />
      {children}
    </p>
  );
}

function HostCell({
  title,
  body,
  accent = false,
}: {
  title: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div className={`border px-3 py-3 ${accent ? "border-accent" : "border-line"}`}>
      <p className="font-mono text-[0.7rem] tracking-[-0.01em] uppercase">{title}</p>
      <p className="mt-1 text-sm leading-snug text-faint">{body}</p>
    </div>
  );
}

export function PremisePanel() {
  return (
    <div className="grid min-w-0 gap-6 *:min-w-0">
      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>Machines</Eyebrow>
        <div className="mt-8 grid max-w-4xl gap-5 text-base leading-relaxed text-faint">
          <p>
            The system runs on the enterprise’s machines. A reverse proxy on TLS 443 serves one
            URL, ai.enterprise.internal, with the enterprise’s own certificate. The chat is at /,
            and the API is at /api/v1. Only the corporate network and the VPN can reach it.
          </p>
          <p>
            Two machines. The application machine is a 16 vCPU, 64 GB VM with 1 TB of SSD, on RHEL
            9 or Ubuntu 24.04, running Docker Compose. It holds the reverse proxy, the chat UI with
            single sign-on, two copies of the gateway on Fastify at port 8080, two agent workers
            running pg-boss jobs, ingestion of the SharePoint delta, three MCP connectors, the
            model proxy, Postgres 16 with pgvector for logs and runs, Redis 7 for budgets and
            cache, and OpenTelemetry for traces. The GPU host is an existing server with at least
            two 80 GB GPUs, 32 vCPU, 256 GB of RAM, and 2 TB of NVMe. Its firewall accepts model
            traffic only from the application machine. vLLM serves Qwen on port 8001, GPU 0, and
            DeepSeek on port 8002, GPU 1. Embeddings, BGE-M3, listen on port 8003. The reranker
            listens on port 8004.
          </p>
          <p>
            The model proxy is the only path to those models, and the only service with a route
            out. That route leaves through the enterprise’s egress proxy, and only for a use case
            whose policy allows an external frontier API. Compose keeps application traffic and
            data traffic on internal networks. The egress network is reserved for the model proxy.
          </p>
          <p>
            A deploy builds, scans, and signs the images, then pulls them by digest and restarts
            replicas one at a time. The gateway runs as two replicas, reads policy from a read-only
            volume, and talks to the model proxy and Redis. A policy change is a merge into
            policies/ and a reload, with no restart. A model upgrade lands on a spare port, passes
            a release gate and a shadow run, then switches in through the model proxy. Postgres is
            dumped nightly, with WAL archiving, and restores are tested monthly. The same images
            move to production with Helm on the enterprise’s Kubernetes and the NVIDIA GPU
            Operator.
          </p>
          <p>
            The code is one TypeScript monorepo. pnpm workspaces and Turborepo build every image,
            so one commit records which code ran under which rules. The apps are the gateway and
            its nine-stage API, the agent worker, ingestion, the chat UI, and three connectors:
            SharePoint on behalf of the human, a read-only database, and sanctions screening.
            Beside them sit the policy files, the evals, the Compose and Helm deploy files, and the
            docs. The packages cover shared types, policy load and reload, routing and locality,
            sensitivity, budgets, audit logs, retrieval, and the agent SDK. The compliance agent
            and a client SDK for enterprise applications live with them.
          </p>
          <p>
            It is TypeScript 5 on Node.js 22. Fastify serves HTTP. Zod is the one schema for the
            API, the policy, and the output, and OpenAPI is generated from it. Agents call tools
            through the MCP TypeScript SDK. Jobs are pg-boss on Postgres, so a run is durable
            without a second broker. Postgres 16 with pgvector and Redis 7 hold logs, runs,
            vectors, and cache. The model proxy is one the enterprise already runs, so adapters
            and keys stay put. vLLM and an embedding server share the GPUs and speak an
            OpenAI-compatible API. OpenTelemetry sends traces into the monitoring the enterprise
            already has. Vitest, Testcontainers, and the evals directory test quality the way code
            is tested. The enterprise’s CI scans with Trivy, signs with cosign, and publishes an
            SBOM to the internal registry.
          </p>
        </div>
      </section>

      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>On premise hosting</Eyebrow>
        <div className="mt-10 grid items-start gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(14rem,0.7fr)]">
          <div className="border border-line p-4">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              AI-app VM · Docker Compose
            </p>
            <p className="mt-4 border border-line px-3 py-3 text-center font-mono text-[0.7rem] tracking-[-0.01em] uppercase">
              Reverse proxy · TLS 443 · ai.enterprise.internal
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <HostCell title="Chat UI" body="SSO sign-in" />
              <HostCell title="Gateway ×2" body="Fastify, port 8080" accent />
              <HostCell title="Agent worker ×2" body="pg-boss jobs" />
              <HostCell title="Ingestion" body="SharePoint delta" />
              <HostCell title="MCP servers" body="3 connectors" />
              <HostCell title="Model proxy" body="Only path to models" />
              <HostCell title="Postgres 16" body="pgvector; logs, runs" />
              <HostCell title="Redis 7" body="Budgets, cache" />
              <HostCell title="OTel" body="Traces out" />
            </div>
          </div>
          <div className="border border-line p-4">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">AI-GPU host</p>
            <div className="mt-4 grid gap-3">
              <HostCell title="vLLM Qwen" body="Port 8001 · GPU 0" />
              <HostCell title="vLLM DeepSeek" body="Port 8002 · GPU 1" />
              <HostCell title="Embeddings" body="Port 8003 · BGE-M3" />
              <HostCell title="Reranker" body="Port 8004" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Model proxy</span>
          <span aria-hidden className="text-faint">
            →
          </span>
          <span className="border border-line px-3 py-2 font-mono text-[0.7rem] tracking-[-0.01em] uppercase">
            Enterprise egress proxy
          </span>
          <span aria-hidden className="text-faint">
            →
          </span>
          <span className="border border-dashed border-line px-3 py-2 font-mono text-[0.7rem] tracking-[-0.01em] uppercase">
            External frontier API
          </span>
          <span className="text-sm text-faint">only for use cases whose policy allows it</span>
        </div>
      </section>

      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>Specs</Eyebrow>
        <div className="mt-10 max-w-full min-w-0 overflow-x-auto border border-line">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal">Machine</th>
                <th className="px-4 py-3 font-normal">Size for the pilot</th>
                <th className="px-4 py-3 font-normal">Runs</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((row) => (
                <tr key={row.name} className="border-t border-line align-top">
                  <th className="px-4 py-3 text-left font-normal">{row.name}</th>
                  <td className="px-4 py-3 text-faint">{row.size}</td>
                  <td className="px-4 py-3 text-faint">{row.runs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {reach.map((item) => (
            <div
              key={item.title}
              className={`border px-4 py-3 ${item.accent ? "border-accent" : "border-line"}`}
            >
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">{item.title}</p>
              <p className="mt-2 text-sm leading-snug">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>Tech stack</Eyebrow>
        <div className="mt-10 max-w-full min-w-0 overflow-x-auto border border-line">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal">Concern</th>
                <th className="px-4 py-3 font-normal">Choice</th>
                <th className="px-4 py-3 font-normal">Why</th>
              </tr>
            </thead>
            <tbody>
              {stack.map(([concern, choice, why]) => (
                <tr key={concern} className="border-t border-line align-top">
                  <th className="px-4 py-3 text-left font-normal">{concern}</th>
                  <td className="px-4 py-3">{choice}</td>
                  <td className="px-4 py-3 text-faint">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
