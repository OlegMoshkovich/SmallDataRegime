import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How SmallDataRegime.ai treats traces, preferences, and reward specs.",
};

export default function PrivacyPage() {
  return (
    <Interior
      eyebrow="Privacy"
      title="Traces stay with the run that used them."
      lede="This marketing site does not store the contact or sign-in forms. In the product, preferences, specs, and eval logs are scoped to the lab that created them."
    >
      <div className="max-w-2xl space-y-4 text-base leading-relaxed text-faint">
        <p>
          Lab machines keep weights and raw traces on hardware you operate. A
          shared-cluster run stores them in the project you connect. Air-gapped
          hosts do not call out.
        </p>
        <p>
          Reviewers see the pair, the trace, and the spec version. They do not
          receive a copy of unrelated runs. Exports are explicit.
        </p>
      </div>
    </Interior>
  );
}
