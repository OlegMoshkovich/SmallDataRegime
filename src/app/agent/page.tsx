import type { Metadata } from "next";
import { CodingAgent } from "@/components/coding-agent";
import { Interior } from "@/components/interior";
import { agentEnabled } from "@/lib/coding-agent-config";
import { openRouterReady } from "@/lib/coding-agent";

export const metadata: Metadata = {
  title: "Coding agent",
  description: "A coding agent hosted in the app with OpenCode. It edits a workspace beside the site.",
};

export default function AgentPage() {
  const enabled = agentEnabled();

  return (
    <Interior>
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
        <span className="mr-2 inline-block size-1.5 bg-accent align-middle" />
        Coding agent
      </p>
      <div className="mt-3 grid items-start gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
        {enabled ? (
          <CodingAgent enabled initialReady={openRouterReady()} />
        ) : (
          <p className="border border-line bg-surface p-4 text-sm lg:col-span-2">
            The agent is off. Set <span className="font-mono text-[0.8125rem]">OPENCODE_AGENT=1</span> to turn it on outside development.
          </p>
        )}
      </div>
    </Interior>
  );
}
