import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Button } from "@/components/button";
import { Interior } from "@/components/interior";
import { roles } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Company",
  description: "SmallDataRegime.ai builds the post-training system for small, governed data.",
};

export default function CompanyPage() {
  return (
    <Interior
      eyebrow="Company"
      title="Post-training for teams who are done collecting for its own sake."
      lede="Small Data Regime by MIResearchLab exists because the valuable update is usually the small one: a reward written carefully, a few hundred preferences that disagree with the base model, and an eval that can stop the run."
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
      <section id="careers" className="mt-16 scroll-mt-28 border-t border-line pt-8">
        <h2 className="text-2xl tracking-[-0.04em]">Careers</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-faint">
          Technical staff and go-to-market. We hire people who would rather delete a
          bad example than add a thousand more.
        </p>
        <ul className="mt-8 border-b border-line">
          {roles.map((role) => (
            <li
              key={role.slug}
              className="grid items-center gap-4 border-t border-line py-5 sm:grid-cols-[8rem_minmax(0,1fr)_auto]"
            >
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                {role.tag}
              </p>
              <div>
                <Link href={`/company/careers/${role.slug}`} className="hover:underline">
                  {role.title}
                </Link>
                <p className="mt-1 text-sm text-faint">{role.type}</p>
              </div>
              <Button href={`/company/careers/${role.slug}`} variant="ghost">
                Apply <ArrowRight />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </Interior>
  );
}
