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
      "Stand the loop up on a shared cluster, a lab machine, or an air-gapped host.",
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
    lede: "Build the training loop: a reward model, a policy step under a budget, and an eval that can refuse the release.",
    about:
      "Members of technical staff here work on the post-training system itself. The scarce resource is a correct preference. Your job is the loop that turns a small, reviewed set into a policy, on whatever open base model the lab already trusts.",
    duties: [
      "Fit reward models on small preference sets and keep the budget explicit.",
      "Step a policy with a KL cap so it does not drift away from the base model.",
      "Build held-out evals that can block a release when the spec says they should.",
      "Keep the loop model agnostic across the checkpoints a lab is allowed to use.",
    ],
    qualifications: [
      "You have trained or post-trained a model, or built the system that did.",
      "You care more about lift per example than about the size of the corpus.",
      "You can explain a failed run to the person who wrote the reward.",
    ],
  },
  {
    slug: "software-engineer-data",
    tag: "Engineering",
    title: "Software Engineer, Data",
    type: "Full time",
    lede: "Build the store for preferences, traces, and reward specs, and show which examples actually move the policy.",
    about:
      "The data is small on purpose. It still has to be versioned, private, and tied to the run that used it. You make that set trustworthy enough that a lab will train on it.",
    duties: [
      "Version preference stores and reward specs with the run that consumed them.",
      "Take a trace from capture to a ranked pair to a gated release.",
      "Show which new pairs are worth labeling, by task and by labeler.",
      "Keep raw traces on the lab's machines unless that export is turned on.",
    ],
    qualifications: [
      "You have built data systems people trust with private records.",
      "You know the difference between an example that was stored and one that was useful.",
      "You can make a small set queryable, versioned, and auditable.",
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
      "Bring back what buyers actually ask, in their words, to the people building the loop.",
    ],
    qualifications: [
      "You have sold a technical product to engineers, or to the people who fund them.",
      "You can explain a preference budget, a held-out eval, and why the weights can stay in the lab.",
      "You would rather walk away from a bad fit than add a logo.",
    ],
  },
  {
    slug: "product-marketing",
    tag: "GTM",
    title: "Product Marketing",
    type: "Full time",
    lede: "Say what the product is, in the language of a lab that has little data and a task that still has to work.",
    about:
      "The product is a platform where a small set of preferences becomes a reasoning system. Model agnostic, with ownership and privacy. Your job is to make that sentence hold in public: the site, the page a buyer reads, and the story a deployed engineer can stand behind.",
    duties: [
      "Write the product in the words a lab uses for a reward, a budget, and a gate.",
      "Turn a finished run into a story that names the constraint.",
      "Keep the site and the sales conversation on the same claims.",
      "Say what we do not do, so a buyer is not sold a corpus we will never collect.",
    ],
    qualifications: [
      "You have written for a technical product people buy.",
      "You can tell a scarce-data story without inventing a number.",
      "You would rather cut a claim than add one the product cannot keep.",
    ],
  },
] as const;

export type Role = (typeof roles)[number];

export function roleBySlug(slug: string) {
  return roles.find((role) => role.slug === slug);
}
