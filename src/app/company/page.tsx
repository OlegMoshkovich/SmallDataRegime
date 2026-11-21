import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Company",
  description: "SmallDataRegime.ai builds the post-training system for small, governed data.",
};

export default function CompanyPage() {
  return (
    <Interior
      eyebrow="Company"
      title="Post-training for teams who are done collecting for its own sake."
      lede="SmallDataRegime.ai exists because the valuable update is usually the small one: a reward written carefully, a few hundred preferences that disagree with the base model, and an eval that can stop the run."
    >
      <div className="grid max-w-3xl gap-8 text-base leading-relaxed text-faint">
        <p>
          Most post-training stacks assume the scarce resource is compute. In the
          work we see, the scarce resource is a correct preference. A tired label
          on an easy example does not make a better policy. A precise correction
          on a failure does.
        </p>
        <p>
          We build the system around that constraint. Specs are first-class. Runs
          have budgets. Releases wait on evals. The hardware can sit in your lab.
        </p>
      </div>
      <section id="careers" className="mt-16 max-w-3xl scroll-mt-28 border-t border-line pt-8">
        <h2 className="text-2xl tracking-[-0.04em]">Careers</h2>
        <p className="mt-4 text-base leading-relaxed text-faint">
          We hire people who have shipped a reward model, a preference interface,
          or an eval harness, and who would rather delete a bad example than add
          a thousand more. Write through the contact page with a task you think
          is stuck in the small-data regime.
        </p>
      </section>
    </Interior>
  );
}
