import { Suspense } from "react";
import type { Metadata } from "next";
import { InferenceSwitch } from "@/components/inference-switch";

export const metadata: Metadata = {
  title: "Inference",
  description:
    "vLLM on the enterprise's GPUs: one OpenAI-compatible server, paged KV cache, and a model proxy as the only path in.",
};

export default function InferencePage() {
  return (
    <article className="min-h-[calc(100dvh-72px)] bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        <h1 className="mb-6 text-[2.125rem] leading-none tracking-[-0.045em] lg:text-[2.75rem]">Inference</h1>
        <Suspense>
          <InferenceSwitch />
        </Suspense>
      </div>
    </article>
  );
}
