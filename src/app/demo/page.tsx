import type { Metadata } from "next";
import { DemoChat } from "@/components/demo-chat";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "A simulated chat with the orchestrator. Pick a question and watch which document, agent, and model it uses.",
};

export default function DemoPage() {
  return (
    <article className="bg-background lg:h-[calc(100dvh-72px)] lg:overflow-hidden">
      <div className="mx-auto flex max-w-[1440px] flex-col px-4 py-4 lg:h-full lg:px-9">
        <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div>
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
              Demo
            </p>
            <h1 className="mt-1 text-2xl tracking-[-0.04em]">Ask the orchestrator.</h1>
          </div>
          <p className="hidden font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase lg:block">
            How the system operates
          </p>
        </div>
        <DemoChat />
      </div>
    </article>
  );
}
