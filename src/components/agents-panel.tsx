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
    <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        Agents
      </p>
      <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
        Each one is a versioned harness.
      </h2>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
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

        <div className="overflow-x-auto border-l-2 border-accent bg-[#f4f3f2] px-5 py-6 font-mono text-[0.8125rem] leading-[1.7]">
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
  );
}
