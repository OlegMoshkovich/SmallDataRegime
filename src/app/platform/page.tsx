import type { Metadata } from "next";
import { Interior } from "@/components/interior";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "Run SmallDataRegime.ai on a shared cluster, a lab machine, or an air-gapped host.",
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
    body: "Bring the same loop into a network that does not call out. Model routing falls back to the checkpoints you already approved.",
  },
];

export default function PlatformPage() {
  return (
    <Interior
      eyebrow="Platform"
      title="The same loop, wherever the weights are allowed to live."
      lede="Small-data post-training is often the work that cannot leave the building. SmallDataRegime.ai runs the collect, train, and gate steps without assuming a public API."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {places.map((place, index) => (
          <section key={place.title} className="border border-line bg-surface p-6">
            <p className="font-mono text-[0.75rem] text-muted uppercase">0{index + 1}</p>
            <h2 className="mt-3 text-xl tracking-[-0.03em]">{place.title}</h2>
            <p className="mt-3 text-sm leading-snug text-faint lg:text-base">{place.body}</p>
          </section>
        ))}
      </div>
      <section id="security" className="mt-16 max-w-2xl scroll-mt-28">
        <h2 className="text-2xl tracking-[-0.04em]">Security</h2>
        <ul className="mt-4 space-y-3 text-sm leading-snug text-faint lg:text-base">
          <li>Preference stores and reward specs are versioned with the run that used them.</li>
          <li>A release can require a named reviewer in addition to the eval gate.</li>
          <li>Lab machines do not upload raw traces unless that export is turned on.</li>
          <li>Audit logs record who changed a spec, who accepted a pair, and which policy shipped.</li>
        </ul>
      </section>
    </Interior>
  );
}
