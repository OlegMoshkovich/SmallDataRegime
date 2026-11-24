import type { Metadata } from "next";
import { Interior } from "@/components/interior";
import { features } from "@/lib/site";

export const metadata: Metadata = {
  title: "Product",
  description:
    "How SmallDataRegime turns a small preference set into a gated policy update.",
};

const places = [
  {
    title: "Shared cluster",
    body: "Start a run from the notebook or the CLI. Weights and traces stay in your cloud project, with the budget and the eval gate attached.",
  },
  {
    title: "Lab machine",
    body: "A dedicated machine keeps the policy, the reward model, and the preference store local. Sessions resume after the machine sleeps.",
  },
  {
    title: "Air-gapped host",
    body: "Bring the same system into a network that does not call out. Model routing falls back to the checkpoints you already approved.",
  },
];

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
    <Interior eyebrow="Product">
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
      <section id="platform" className="mt-16 scroll-mt-28">
        <div className="grid gap-6 lg:grid-cols-3">
          {places.map((place, index) => (
            <section key={place.title} className="border border-line bg-surface p-6">
              <p className="font-mono text-[0.75rem] text-muted uppercase">0{index + 1}</p>
              <h3 className="mt-3 text-xl tracking-[-0.03em]">{place.title}</h3>
              <p className="mt-3 text-sm leading-snug text-faint lg:text-base">{place.body}</p>
            </section>
          ))}
        </div>
      </section>
      <section id="security" className="mt-16 max-w-2xl scroll-mt-28">
        <h2 className="text-2xl tracking-[-0.04em]">Security</h2>
        <ul className="mt-4 text-base leading-7 text-foreground">
          <li>Preference stores and reward specs are versioned with the run that used them.</li>
          <li>A release can require a named reviewer in addition to the eval gate.</li>
          <li>Lab machines do not upload raw traces unless that export is turned on.</li>
          <li>Audit logs record who changed a spec, who accepted a pair, and which policy shipped.</li>
        </ul>
      </section>
    </Interior>
  );
}
