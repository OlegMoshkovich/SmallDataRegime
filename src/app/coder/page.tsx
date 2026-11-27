import { Suspense } from "react";
import type { Metadata } from "next";
import { CodingSwitch } from "@/components/coding-switch";
import { agentEnabled } from "@/lib/coding-agent-config";
import { openRouterReady } from "@/lib/coding-agent";

export const metadata: Metadata = {
  title: "Coding",
  description:
    "A coding agent that takes a task, works in a repository, and returns a change a person reviews.",
};

export default function AgentPage() {
  const enabled = agentEnabled();

  return (
    <article className="min-h-[calc(100dvh-72px)] bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        <Suspense>
          <CodingSwitch enabled={enabled} initialReady={openRouterReady()} />
        </Suspense>
      </div>
    </article>
  );
}
