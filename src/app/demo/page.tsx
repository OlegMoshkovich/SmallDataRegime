import type { Metadata } from "next";
import { DemoChat } from "@/components/demo-chat";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "A simulated chat with the orchestrator. Pick a question and watch which document, agent, and model it uses.",
};

export default function DemoPage() {
  return (
    <article className="fixed inset-x-0 top-[72px] bottom-0 z-10 overflow-hidden bg-background">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col px-4 py-4 lg:px-9">
        <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
          Demo
        </p>
        <h1 className="mt-1 text-2xl tracking-[-0.04em]">Ask the orchestrator.</h1>
        <DemoChat />
      </div>
    </article>
  );
}
