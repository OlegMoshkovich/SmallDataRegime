import { Suspense } from "react";
import type { Metadata } from "next";
import { DocumentsSwitch } from "@/components/documents-switch";

export const metadata: Metadata = {
  title: "Documents",
  description:
    "A document platform over the files the company already keeps: connectors, a permission-aware index, and answers that cite the source.",
};

export default function DocumentsPage() {
  return (
    <article className="min-h-[calc(100dvh-72px)] bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        <h1 className="mb-6 text-[2.125rem] leading-none tracking-[-0.045em] lg:text-[2.75rem]">Documents</h1>
        <Suspense>
          <DocumentsSwitch />
        </Suspense>
      </div>
    </article>
  );
}
