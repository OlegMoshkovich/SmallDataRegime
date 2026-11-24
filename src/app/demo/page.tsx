import type { Metadata } from "next";
import { DemoChat } from "@/components/demo-chat";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "A simulated chat with the orchestrator. Pick a question and watch which document, agent, and model it uses.",
};

export default function DemoPage() {
  return (
    <article className="bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col px-4 py-4 lg:px-9">
        <DemoChat titleLevel="h1" />
      </div>
    </article>
  );
}
