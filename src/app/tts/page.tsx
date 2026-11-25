import type { Metadata } from "next";
import { TtsSwitch } from "@/components/tts-switch";

export const metadata: Metadata = {
  title: "TTS",
  description:
    "Databricks platform overview, a map of database types, enterprise workloads, legacy migration, and implementation roadmap.",
};

export default function TtsPage() {
  return (
    <article className="bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        <TtsSwitch />
      </div>
    </article>
  );
}
