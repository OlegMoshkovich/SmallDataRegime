import type { Metadata } from "next";
import { Button } from "@/components/button";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Lab, team, and sovereign plans for small-data RL post-training.",
};

const plans = [
  {
    name: "Lab",
    fit: "One researcher, one task",
    points: [
      "A single active reward spec",
      "Preference budgets up to a research set",
      "Shared cluster runs",
      "Held-out eval gate",
    ],
  },
  {
    name: "Team",
    fit: "A lab that labels together",
    points: [
      "Yield by labeler and task",
      "Pair review before training",
      "Several concurrent runs",
      "Spec wiki shared across the group",
    ],
  },
  {
    name: "Sovereign",
    fit: "Weights that cannot leave",
    points: [
      "Lab machines and air-gapped hosts",
      "Bring-your-own checkpoints",
      "Named release reviewers",
      "Audit export for every shipped policy",
    ],
  },
];

export default function PricingPage() {
  return (
    <Interior
      eyebrow="Pricing"
      title="Pay for the loop, not for a pile of tokens."
      lede="Plans follow where the run lives and how many people touch the preference set. Usage is the labeled examples and the eval compute, not a blank pretraining corpus."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <section key={plan.name} className="flex flex-col border border-line bg-surface p-6">
            <h2 className="text-2xl tracking-[-0.04em]">{plan.name}</h2>
            <p className="mt-2 text-sm text-muted">{plan.fit}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm leading-snug">
              {plan.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/contact">Talk to us</Button>
            </div>
          </section>
        ))}
      </div>
    </Interior>
  );
}
