const operations = [
  {
    title: "Deploy",
    body: "CI builds, scans, signs; docker compose pull and up by digest; replicas restart one at a time.",
  },
  {
    title: "Policy change",
    body: "Merge to policies/, call /admin/policy/reload. No restart.",
  },
  {
    title: "Model upgrade",
    body: "New model on a spare port, release gate, shadow mode, then switch in LiteLLM.",
  },
  {
    title: "Backups",
    body: "Nightly pg_dump plus WAL archiving; restores tested monthly.",
  },
  {
    title: "Production",
    body: "Same images via Helm on the enterprise’s Kubernetes; NVIDIA GPU Operator.",
  },
];

const machines = [
  {
    name: "ai-app VM",
    size: "16 vCPU, 64 GB RAM, 1 TB SSD; RHEL 9 or Ubuntu 24.04; Docker Compose v2",
    runs: "Proxy, UI, gateway ×2, agent worker ×2, ingestion, MCP servers, LiteLLM, Postgres, Redis, OTel",
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

const apps = [
  ["gateway/", "9-stage pipeline, API"],
  ["agent-worker/", "pg-boss agent jobs"],
  ["ingestion/", "sync, extract, embed"],
  ["chat-ui/", "internal chat UI"],
  ["mcp-sharepoint/", "Graph, on behalf of"],
  ["mcp-coredb/", "read-only views"],
  ["mcp-sanctions/", "screening service"],
] as const;

const roots = [
  ["policies/", "YAML rules"],
  ["evals/", "sets, rubrics, judges"],
  ["deploy/", "compose, litellm, helm"],
  ["docs/", "spec, runbooks"],
] as const;

const stack = [
  ["Language", "TypeScript 5, Node.js 22 LTS", "One language from API to agents"],
  ["HTTP", "Fastify", "Fast, schema-first"],
  ["Validation", "Zod; OpenAPI from it", "One schema for API, policy, output"],
  ["Agent tools", "MCP TypeScript SDK", "One standard for every connector"],
  ["Jobs", "pg-boss on Postgres", "Durable runs, no extra broker"],
  ["Data", "Postgres 16 + pgvector, Redis 7", "Logs, runs, vectors, text in one DB"],
  ["Model access", "LiteLLM, already at the enterprise", "Adapters and keys stay put"],
  ["Serving", "vLLM; embedding server", "OpenAI-compatible, shared GPUs"],
  ["Telemetry", "OpenTelemetry", "Into existing monitoring"],
  ["Tests", "Vitest, Testcontainers, evals/", "Quality tested like code"],
  ["CI", "Enterprise CI; Trivy, cosign, SBOM", "Signed images, internal registry"],
] as const;

const packages = [
  ["core/", "shared types, errors"],
  ["policy/", "loader, schemas, reload"],
  ["router/", "match, classify, locality"],
  ["sensitivity/", "TCKN, IBAN, card, names"],
  ["budgets/", "reserve and settle"],
  ["audit/", "logs, encryption"],
  ["retrieval/", "hybrid, ACL, rerank"],
  ["agent-sdk/", "definition, replay"],
] as const;

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
      <span className="size-1.5 bg-accent" aria-hidden />
      {children}
    </p>
  );
}

function TreeRow({ path, note, depth = 0 }: { path: string; note?: string; depth?: number }) {
  return (
    <div className="grid grid-cols-[10.5rem_minmax(0,1fr)] gap-3" style={{ paddingLeft: depth * 16 }}>
      <span>{path}</span>
      {note ? <span className="text-faint">{note}</span> : null}
    </div>
  );
}

export function PremisePanel() {
  return (
    <div className="grid gap-6">
      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>On premise hosting</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
          Compose files and operations
        </h2>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <pre className="overflow-x-auto border-l-2 border-accent bg-[#f4f3f2] px-5 py-6 font-mono text-[0.8125rem] leading-[1.7] whitespace-pre">{`gateway:
  image: registry.enterprise.internal/ai/
    gateway:1.0.0@sha256:...
  deploy: { replicas: 2 }
  environment:
    POLICY_DIR: /policies
    LITELLM_URL: http://litellm:4000
    REDIS_URL: redis://redis:6379
  volumes: ["./policies:/policies:ro"]
  secrets: [db_url]
  networks: [app, data]

networks:
  app:    { internal: true }
  data:   { internal: true }
  egress: {}  # LiteLLM only`}</pre>
          <div className="grid gap-6">
            {operations.map((item) => (
              <div key={item.title}>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">{item.title}</p>
                <p className="mt-2 text-base leading-relaxed text-faint">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>On premise hosting</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
          Machines and how they are reached
        </h2>
        <div className="mt-10 overflow-x-auto border border-line">
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
        <Eyebrow>Repository</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
          One TypeScript monorepo
        </h2>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="border-l-2 border-accent bg-[#f4f3f2] px-5 py-6 font-mono text-[0.8125rem] leading-[1.7]">
            <p>apps/</p>
            {apps.map(([path, note]) => (
              <TreeRow key={path} path={path} note={note} depth={1} />
            ))}
            <div className="h-4" />
            {roots.map(([path, note]) => (
              <TreeRow key={path} path={path} note={note} />
            ))}
          </div>
          <div className="border-l-2 border-accent bg-[#f4f3f2] px-5 py-6 font-mono text-[0.8125rem] leading-[1.7]">
            <p>packages/</p>
            {packages.map(([path, note]) => (
              <TreeRow key={path} path={path} note={note} depth={1} />
            ))}
            <p className="mt-4 pl-4">agents/</p>
            <TreeRow path="compliance/" note="the compliance agent" depth={2} />
            <TreeRow path="sdk/" note="client for enterprise apps" />
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-faint">
          pnpm workspaces and Turborepo build every image. One commit records which code ran under
          which rules.
        </p>
      </section>

      <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <Eyebrow>Tech stack</Eyebrow>
        <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
          What it is built with
        </h2>
        <div className="mt-10 overflow-x-auto border border-line">
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
