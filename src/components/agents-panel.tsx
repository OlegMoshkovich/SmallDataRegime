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

      <div className="mt-8 grid min-w-0 items-start gap-10 *:min-w-0 lg:grid-cols-2 lg:gap-16">
        <div className="grid gap-8">
          <div>
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">The agent</p>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-faint">
              An agent is a named, versioned procedure. It takes a typed input, walks a fixed list of steps, calls a model through the gateway, and uses tools as the person who started it. The result is a typed output a human can approve, edit, or reject.
            </p>
          </div>
          <div className="border border-line-strong px-4 py-4">
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

        <div className="max-w-full min-w-0 overflow-x-auto bg-[#f4f3f2] px-5 py-6 font-mono text-[0.8125rem] leading-[1.7]">
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
    </div>
  );
}
