import type { Metadata } from "next";
import { CodingAgent } from "@/components/coding-agent";
import { ArrowRight } from "@/components/button";
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
          <CodingAgent
            enabled
            initialReady={openRouterReady()}
            headerLeft={
              <a
                href="https://github.com/anomalyco/opencode/tree/dev/specs/v2"
                className="group relative inline-flex h-[31px] items-center justify-center overflow-hidden border border-transparent bg-ink px-3.5 font-mono text-[0.8125rem] leading-none tracking-[-0.0175rem] capitalize text-paper [--stripe:rgba(255,255,255,0.18)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Specs <ArrowRight />
                </span>
                <span
                  aria-hidden
                  className="stripe-hover pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
                />
              </a>
            }
          />
        ) : (
          <p className="border border-line bg-surface p-4 text-sm">
            The agent is off. Set <span className="font-mono text-[0.8125rem]">OPENCODE_AGENT=1</span> to turn it on outside development.
          </p>
        )}
      </div>
    </article>
  );
}
