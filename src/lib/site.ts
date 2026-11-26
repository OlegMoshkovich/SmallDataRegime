export const nav = [
  { href: "/research", label: "Research" },
  { href: "/architecture", label: "System" },
  { href: "/coder", label: "Coder" },
  { href: "/tts", label: "Text_to_SQL" },
] as const;

export const pillars = [
  {
    index: "01",
    kicker: "Signal",
    title: "Deliberately small, high-leverage data",
    body: "Choose the traces, rankings, and corrections that enter the system. The set stays small because each example has to earn its place.",
  },
  {
    index: "02",
    kicker: "Governance",
    title: "A reward spec with a release gate",
    body: "Every update is checked against held-out evals, a written reward, and a human review before it can leave the lab.",
  },
  {
    index: "03",
    kicker: "Value",
    title: "Lift per labeled example",
    body: "Tie win rate, sample use, and task quality to the cost of the next preference — not to the size of the corpus.",
  },
];

export const features = [
  {
    slug: "yield",
    title: "Yield",
    body: "See which preferences actually move the policy, by task, labeler, and team.",
  },
  {
    slug: "machines",
    title: "Lab machines",
    body: "Dedicated machines that keep weights, traces, and reward models on hardware you control.",
  },
  {
    slug: "readiness",
    title: "Readiness",
    body: "A score for whether a task can be post-trained from a small set, tracked as the spec changes.",
  },
  {
    slug: "control",
    title: "Run control",
    body: "Live view of active runs, worker progress, and the eval gate sitting in front of release.",
  },
] as const;

export const command = "smalldataregime train --budget 200 --reward prefs.jsonl";
