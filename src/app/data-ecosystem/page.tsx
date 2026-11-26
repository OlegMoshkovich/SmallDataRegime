import { Suspense } from "react";
import type { Metadata } from "next";
import { TtsSwitch } from "@/components/tts-switch";

export const metadata: Metadata = {
  title: "Data",
  description:
    "Databricks platform overview, a map of database types, enterprise workloads, and legacy migration.",
};

export default function TtsPage() {
  return (
    <article className="min-h-[calc(100dvh-72px)] bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        <h1 className="mb-6 text-[2.125rem] leading-none tracking-[-0.045em] lg:text-[2.75rem]">Data</h1>
        <Suspense>
          <TtsSwitch />
        </Suspense>
      </div>
    </article>
  );
}
