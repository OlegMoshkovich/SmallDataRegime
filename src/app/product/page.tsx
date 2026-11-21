import type { Metadata } from "next";
import { Interior } from "@/components/interior";
import { features } from "@/lib/site";

export const metadata: Metadata = {
  title: "Product",
  description:
    "How SmallDataRegime.ai turns a small preference set into a gated policy update.",
};

const steps = [
  {
    title: "Write the reward",
    body: "A spec names the behavior you want, the traces that count, and the held-out evals that can block a release.",
  },
  {
    title: "Keep the set small",
    body: "Rank, correct, or demonstrate only where the base model is still wrong. Yield shows which new pairs are worth labeling.",
  },
  {
    title: "Train under a budget",
    body: "The run fits a reward model and steps the policy with an explicit preference budget and a KL cap.",
  },
  {
    title: "Gate the release",
    body: "Nothing ships because a loss went down. It ships because the evals in the spec passed and a reviewer accepted the diff.",
  },
];

export default function ProductPage() {
  return (
    <Interior
      eyebrow="Product"
      title="A loop built for scarce signal."
      lede="SmallDataRegime.ai is the post-training system for teams that cannot label a million examples, and should not have to. The unit of work is a small, reviewed set tied to a written reward."
    >
      <ol className="grid gap-6 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title} className="border border-line bg-surface p-6">
            <p className="font-mono text-[0.75rem] text-muted uppercase">0{index + 1}</p>
            <h2 className="mt-3 text-xl tracking-[-0.03em]">{step.title}</h2>
            <p className="mt-3 text-sm leading-snug text-faint lg:text-base">{step.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        {features.map((feature) => (
          <section key={feature.slug} id={feature.slug} className="scroll-mt-28">
            <h2 className="text-2xl tracking-[-0.04em]">{feature.title}</h2>
            <p className="mt-3 max-w-md text-sm leading-snug text-faint lg:text-base">
              {feature.body}
            </p>
          </section>
        ))}
      </div>
    </Interior>
  );
}
