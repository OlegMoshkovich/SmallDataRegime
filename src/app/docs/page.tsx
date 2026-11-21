import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Docs",
  description: "Start a small-data post-training run with SmallDataRegime.ai.",
};

const docs = [
  {
    title: "Install",
    code: "npm install -g smalldataregime",
    body: "The CLI talks to a cluster, a lab machine, or a local checkpoint directory.",
  },
  {
    title: "Point at a spec",
    code: "smalldataregime spec check reward.md",
    body: "A spec needs a desired behavior, at least one negative, and a held-out eval command.",
  },
  {
    title: "Train inside a budget",
    code: "smalldataregime train --budget 200 --reward prefs.jsonl",
    body: "The run stops at the preference budget or when the KL cap trips, then waits on the eval gate.",
  },
];

export default function DocsPage() {
  return (
    <Interior
      eyebrow="Docs"
      title="From a reward spec to a gated update."
      lede="Three commands cover the first run. Everything after that is review, yield, and whether the policy is allowed to leave the lab."
    >
      <ol className="grid gap-6">
        {docs.map((doc, index) => (
          <li key={doc.title} className="border border-line bg-surface p-6">
            <p className="font-mono text-[0.75rem] text-muted uppercase">0{index + 1}</p>
            <h2 className="mt-3 text-xl tracking-[-0.03em]">{doc.title}</h2>
            <pre className="mt-4 overflow-x-auto bg-ink px-4 py-3 font-mono text-sm text-paper">
              <span className="text-accent">{"> "}</span>
              {doc.code}
            </pre>
            <p className="mt-4 text-sm leading-snug text-faint lg:text-base">{doc.body}</p>
          </li>
        ))}
      </ol>
    </Interior>
  );
}
