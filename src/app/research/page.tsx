import { Suspense } from "react";
import type { Metadata } from "next";
import { ResearchSwitch } from "@/components/research-switch";

export const metadata: Metadata = {
  title: "Research",
  description: "Notes on post-training when the labeled set is small on purpose.",
};

const scholar = (id: string) =>
  `https://scholar.google.com/citations?view_op=view_citation&hl=en&user=-D0EgMIAAAAJ&citation_for_view=-D0EgMIAAAAJ:${id}`;

const papers = [
  {
    label: "Small-data regime",
    intro:
      "Learning when each new example is expensive.",
    items: [
      {
        title: "Improved Algorithms for Linear Stochastic Bandits",
        meta: "Abbasi-Yadkori, Szepesvári, Pál · NeurIPS 2011 · 3,006 citations",
        note: "OFUL. A confidence set that widens while the pulls are few, so the regret stays honest on a small sample.",
        href: scholar("u-x6o8ySG0sC"),
      },
      {
        title:
          "Online Least Squares Estimation with Self-Normalized Processes: An Application to Bandit Problems",
        meta: "Abbasi-Yadkori, Pál, Szepesvári · 2011 · 106 citations",
        note: "The concentration result the OFUL confidence set is built on.",
        href: "https://arxiv.org/abs/1102.2670",
      },
      {
        title: "Regret Bounds for the Adaptive Control of Linear Quadratic Systems",
        meta: "Abbasi-Yadkori, Szepesvári · COLT 2011 · 571 citations",
        note: "Control learned from the trajectory itself, with a bound on how much interaction it takes.",
        href: scholar("qjMakFHDy7sC"),
      },
      {
        title: "Online Learning for Linearly Parametrized Control Problems",
        meta: "Abbasi-Yadkori · University of Alberta, 2012 · 151 citations",
        note: "The dissertation that collects the bandit and adaptive-control results.",
        href: scholar("u5HHmVD_FuO8C"),
      },
      {
        title:
          "Online-to-Confidence-Set Conversions and Application to Sparse Stochastic Bandits",
        meta: "Abbasi-Yadkori, Pál, Szepesvári · AISTATS 2012 · 234 citations",
        note: "When only a few features matter, the sample does not have to grow with the dimension.",
        href: scholar("9yKSN-GCB0IC"),
      },
      {
        title:
          "Prediction with Limited Advice and Multiarmed Bandits with Paid Observations",
        meta: "Seldin, Bartlett, Crammer, Abbasi-Yadkori · ICML 2014 · 102 citations",
        note: "Each new observation is paid for. The budget is the constraint.",
        href: scholar("roLk4NBRz8UC"),
      },
      {
        title: "Bayesian Optimal Control of Smoothly Parameterized Systems",
        meta: "Abbasi-Yadkori, Szepesvári · UAI 2015 · 94 citations",
        note: "Control when the system is known up to a few parameters and the data is the interaction.",
        href: scholar("8k81kl-MbHgC"),
      },
      {
        title: "Conservative Contextual Linear Bandits",
        meta: "Kazerouni, Ghavamzadeh, Abbasi-Yadkori, Van Roy · NeurIPS 2017 · 179 citations",
        note: "Explore inside a constraint, so the early sample cannot leave the safe set.",
        href: scholar("YOwf2qJgpHMC"),
      },
      {
        title: "POLITEX: Regret Bounds for Policy Iteration Using Expert Prediction",
        meta: "Abbasi-Yadkori, Bartlett, Bhatia, Lazic, Szepesvári, Weisz · ICML 2019 · 212 citations",
        note: "Policy iteration with a regret bound, so the number of updates is part of the result.",
        href: scholar("TQgYirikUcIC"),
      },
      {
        title: "Model-Free Linear Quadratic Control via Reduction to Expert Prediction",
        meta: "Abbasi-Yadkori, Lazic, Szepesvári · AISTATS 2019 · 150 citations",
        note: "Linear-quadratic control without a fitted model, reduced to prediction under a finite interaction budget.",
        href: scholar("9ZlFYXVOiuMC"),
      },
      {
        title: "Bootstrapping Upper Confidence Bound",
        meta: "Hao, Abbasi-Yadkori, Wen, Cheng · NeurIPS 2019 · 98 citations",
        note: "A confidence bound that does not need a large set to estimate the noise.",
        href: scholar("R3hNpaxXUhUC"),
      },
      {
        title: "Sample Efficient Graph-Based Optimization with Noisy Observations",
        meta: "Nguyen, Shameli, Abbasi-Yadkori, Rao, Kveton · AISTATS 2019",
        note: "Optimize over a graph when every noisy query costs something.",
        href: "https://scholar.google.com/scholar?q=Sample+efficient+graph-based+optimization+with+noisy+observations",
      },
      {
        title: "Model Selection in Contextual Stochastic Bandit Problems",
        meta: "Pacchiano, Phan, Abbasi-Yadkori, et al. · NeurIPS 2020 · 146 citations",
        note: "Choose the model class while the contextual sample is still small.",
        href: scholar("TFP_iSt0sucC"),
      },
      {
        title:
          "On Query-Efficient Planning in MDPs under Linear Realizability of the Optimal State-Value Function",
        meta: "Weisz, Amortila, Janzer, Abbasi-Yadkori, Jiang, Szepesvári · COLT 2021",
        note: "Planning when each query to the model is scarce.",
        href: "https://scholar.google.com/scholar?q=On+query-efficient+planning+in+MDPs+under+linear+realizability",
      },
      {
        title:
          "Non-Stationary Bandits and Meta-Learning with a Small Set of Optimal Arms",
        meta: "Azizi, Duong, Abbasi-Yadkori, György, Vernade, et al. · 2022",
        note: "Meta-learning when only a small set of arms is ever the right one.",
        href: "https://arxiv.org/abs/2202.13001",
      },
    ],
  },
  {
    label: "Hierarchical reasoning",
    intro:
      "Recurrent models trained without a large corpus.",
    items: [
      {
        title: "Hierarchical Reasoning Model",
        meta: "Wang, Li, Sun, Chen, Liu, Wu, Lu, Song, Abbasi-Yadkori · 2025",
        note: "A 27M-parameter model with a slow planning module and a fast execution module. Trained on about 1,000 examples, with no pretraining and no chain-of-thought labels.",
        href: "https://arxiv.org/abs/2506.21734",
      },
      {
        title: "HRM-Text: Efficient Pretraining Beyond Scaling",
        meta: "Wang, Liu, Wang, Zhou, Sun, Wu, Zhen, Scimeca, Abbasi-Yadkori · 2026",
        note: "The same hierarchical recurrence trained as a language model, on far fewer tokens than a standard pretrain.",
        href: "https://arxiv.org/abs/2605.20613",
      },
    ],
  },
];

export default function ResearchPage() {
  return (
    <article className="bg-background">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-4 lg:px-9">
        <Suspense>
          <ResearchSwitch papers={papers} />
        </Suspense>
      </div>
    </article>
  );
}
