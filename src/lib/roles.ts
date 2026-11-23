export const roles = [
  {
    slug: "deployed-staff",
    tag: "Deployment",
    title: "Member of Deployed Staff",
    type: "Full time",
    lede: "Sit with a lab and turn a small set of their preferences into a reasoning system that stays on their machines.",
    about:
      "This is a hands-on role with a customer in the room. You take a task from the first conversation through a run they can repeat: the reward, the preference budget, the eval that can stop it, and the machine the weights are allowed to live on.",
    duties: [
      "Learn the task, who owns the judgment, and what a first run has to prove.",
      "Stand the system up on a shared cluster, a lab machine, or an air-gapped host.",
      "Write the reward with the people who will accept or reject the result.",
      "Leave them a spec, a budget, and a gate, not a one-off notebook.",
    ],
    qualifications: [
      "You have put a system into someone else's environment, not only a demo.",
      "You can read a codebase, a training run, and a failed eval and say which one is wrong.",
      "You would rather delete a bad preference than add a thousand more.",
    ],
  },
  {
    slug: "software-engineer-ai",
    tag: "Engineering",
    title: "Software Engineer, AI",
    type: "Full time",
    lede: "Build the training system: a reward model, a policy step under a budget, and an eval that can refuse the release.",
    about:
      "Members of technical staff here work on the post-training system itself. The scarce resource is a correct preference. Your job is the system that turns a small, reviewed set into a policy, on whatever open base model the lab already trusts.",
    duties: [
      "Fit reward models on small preference sets and keep the budget explicit.",
      "Step a policy with a KL cap so it does not drift away from the base model.",
      "Build held-out evals that can block a release when the spec says they should.",
      "Keep the system model agnostic across the checkpoints a lab is allowed to use.",
    ],
    qualifications: [
      "You have trained or post-trained a model, or built the system that did.",
      "You care more about lift per example than about the size of the corpus.",
      "You can explain a failed run to the person who wrote the reward.",
    ],
  },
  {
    slug: "account-executive",
    tag: "GTM",
    title: "Account Executive",
    type: "Full time",
    lede: "Find the lab whose task is stuck on a small set of preferences, and agree what a first run has to prove.",
    about:
      "This is a go-to-market role with a technical product. You talk to the people who own a workflow. A conversation ends when there is a scope: the task, the team, the preference budget, and whether the weights stay on their machines.",
    duties: [
      "Find teams whose judgment is scarce and whose base model is already chosen.",
      "Turn a first call into a scoped run: the workflow, who owns it, and what it has to prove.",
      "Stay through the handoff to deployed staff, and say when a deal is not a fit.",
      "Bring back what buyers actually ask, in their words, to the people building the system.",
    ],
    qualifications: [
      "You have sold a technical product to engineers, or to the people who fund them.",
      "You can explain a preference budget, a held-out eval, and why the weights can stay in the lab.",
      "You would rather walk away from a bad fit than add a logo.",
    ],
  },
] as const;

export type Role = (typeof roles)[number];

export function roleBySlug(slug: string) {
  return roles.find((role) => role.slug === slug);
}
