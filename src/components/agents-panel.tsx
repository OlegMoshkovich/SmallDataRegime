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
  ["deploy/", "compose, model proxy, helm"],
  ["docs/", "spec, runbooks"],
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

function TreeRow({ path, note, depth = 0 }: { path: string; note?: string; depth?: number }) {
  return (
    <div className="grid grid-cols-[10.5rem_minmax(0,1fr)] gap-3" style={{ paddingLeft: depth * 16 }}>
      <span>{path}</span>
      {note ? <span className="text-faint">{note}</span> : null}
    </div>
  );
}

function CodeLine({ code, note }: { code: string; note?: string }) {
  return (
    <div className="whitespace-pre">
      {code}
      {note ? <span className="text-muted"> {note}</span> : null}
    </div>
  );
}

export function AgentsPanel() {
  return (
    <div className="grid min-w-0 gap-6 *:min-w-0">
    <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        Agents
      </p>
      <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
        Each one is a versioned harness.
      </h2>

      <div className="mt-10 grid min-w-0 items-start gap-10 *:min-w-0 lg:grid-cols-2 lg:gap-16">
        <div className="grid gap-8">
          <div>
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">What an agent is</p>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-faint">
              A harness put together in the small-data regime, with explicit management of state,
              uncertainty, goal, and policy. It is a TypeScript package declaring its steps, tools,
              allowed models and output schema. An agent-worker container runs it.
            </p>
          </div>
          <div>
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Durable runs</p>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-faint">
              Jobs in Postgres (pg-boss): a run survives a restart, can wait days for a human, and
              replays step by step.
            </p>
          </div>
          <div className="border border-accent px-4 py-4">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Two rules</p>
            <p className="mt-3 text-base leading-relaxed">
              Agents call models through the gateway, so routing, budgets and logs apply to every
              step.
            </p>
            <p className="mt-3 text-base leading-relaxed">
              Tools run as the original user, so an agent never sees a document its user cannot.
            </p>
          </div>
        </div>

        <div className="max-w-full min-w-0 overflow-x-auto border-l-2 border-accent bg-[#f4f3f2] px-5 py-6 font-mono text-[0.8125rem] leading-[1.7]">
          <CodeLine code="interface AgentDefinition<In, Out> {" />
          <CodeLine code="  id: string;" note='// "compliance"' />
          <CodeLine code="  version: string;" note="// semver" />
          <CodeLine code="  inputSchema: ZodType<In>;" />
          <CodeLine code="  outputSchema: ZodType<Out>;" />
          <CodeLine code="  tools: ToolRef[];" note="// MCP tools" />
          <CodeLine code="  modelGroups: string[];" />
          <CodeLine code="  steps: Step[];" />
          <CodeLine code="}" />
          <div className="h-6" />
          <CodeLine code="interface StepContext {" />
          <CodeLine code="  caller: Caller;" note="// original user" />
          <CodeLine code="  callTool(ref, args);" />
          <CodeLine code="  callModel(group, req);" note="// via gateway" />
          <CodeLine code="  waitForHuman(task);" />
          <CodeLine code="  emit(event);" note="// stored, streamed" />
          <CodeLine code="}" />
        </div>
      </div>
    </section>

    <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        Repository
      </p>
      <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
        One TypeScript monorepo
      </h2>
      <div className="mt-10 grid min-w-0 gap-4 *:min-w-0 lg:grid-cols-2">
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
    </div>
  );
}
