import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Research",
  description: "Notes on post-training when the labeled set is small on purpose.",
};

const notes = [
  {
    title: "The last mile is a small-data problem",
    body: "Base models already cover the broad distribution. What remains is a narrow behavior: a format, a tool policy, a citation habit, a safety boundary. Those behaviors move on dozens or hundreds of carefully chosen examples, and they stall when the next thousand look like the first.",
  },
  {
    title: "Yield, not volume",
    body: "A preference is useful when the policy’s held-out win rate moves after it is included. SmallDataRegime.ai ranks new pairs by that marginal lift so a labeler spends the next hour on the slice that is still wrong, not on another easy win.",
  },
  {
    title: "The spec is the governor",
    body: "A reward model will exploit whatever you fail to write down. The spec — desired behavior, negative examples, and the evals that can veto a release — is the object teams review. The weights are a consequence.",
  },
];

export default function ResearchPage() {
  return (
    <Interior
      eyebrow="Research"
      title="Notes from the small-data regime."
      lede="Post-training gets more sample-efficient when the target is narrow, the negatives are real, and a held-out eval can say no."
    >
      <div className="grid gap-10">
        {notes.map((note, index) => (
          <article key={note.title} className="max-w-3xl border-t border-line pt-8">
            <p className="font-mono text-[0.75rem] text-muted uppercase">0{index + 1}</p>
            <h2 className="mt-3 text-2xl tracking-[-0.04em]">{note.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-faint">{note.body}</p>
          </article>
        ))}
      </div>
    </Interior>
  );
}
