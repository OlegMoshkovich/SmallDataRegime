import type { Metadata } from "next";
import { CodingAgent } from "@/components/coding-agent";
import { agentEnabled } from "@/lib/coding-agent-config";
import { openRouterReady } from "@/lib/coding-agent";

export const metadata: Metadata = {
  title: "Coding agent",
  description: "A coding agent hosted in the app with OpenCode. It edits a workspace beside the site.",
};

export default function AgentPage() {
  const enabled = agentEnabled();

  return (
    <article className="bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        {enabled ? (
          <CodingAgent enabled initialReady={openRouterReady()} />
        ) : (
          <p className="border border-line bg-surface p-4 text-sm">
            The agent is off. Set <span className="font-mono text-[0.8125rem]">OPENCODE_AGENT=1</span> to turn it on outside development.
          </p>
        )}
      </div>
    </article>
  );
}
