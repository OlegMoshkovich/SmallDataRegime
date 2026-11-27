import { Suspense } from "react";
import type { Metadata } from "next";
import { MarketSwitch } from "@/components/market-switch";

export const metadata: Metadata = {
  title: "Market case",
  description:
    "The market reference for each module: Databricks for data, Glean for documents, Baseten for inference, and Cognition for coding.",
};

export default function MarketCasePage() {
  return (
    <article className="min-h-[calc(100dvh-72px)] bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        <Suspense>
          <MarketSwitch />
        </Suspense>
      </div>
    </article>
  );
}
