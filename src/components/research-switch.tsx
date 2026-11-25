"use client";

import { useState } from "react";

type Paper = {
  title: string;
  meta: string;
  note: string;
  href: string;
};

type Group = {
  label: string;
  intro: string;
  items: readonly Paper[];
};

const filters = [
  { id: "sdr", label: "SDR", group: "Small-data regime" },
  { id: "hrm", label: "HRM", group: "Hierarchical reasoning" },
] as const;

export function ResearchSwitch({ papers }: { papers: readonly Group[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("sdr");
  const selected = filters.find((item) => item.id === filter) ?? filters[0];
  const group = papers.find((item) => item.label === selected.group);

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div
          className="ml-auto flex w-fit max-w-full flex-wrap justify-end gap-2 lg:gap-0 lg:border lg:border-line"
          role="group"
          aria-label="Filter"
        >
          {filters.map((item, index) => {
            const pressed = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(item.id)}
                className={`h-[31px] px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase max-lg:border max-lg:border-line ${
                  index > 0 ? "lg:border-l lg:border-line" : ""
                } ${pressed ? "bg-foreground text-background" : "bg-surface text-muted"}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      <section className="w-full border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
          <span className="size-1.5 bg-accent" aria-hidden />
          Research
        </p>
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          From{" "}
          <a
            href="https://scholar.google.com/citations?user=-D0EgMIAAAAJ&hl=en"
            className="underline"
          >
            our chief scientist’s record
          </a>
          . The bandit and control results where the sample is the constraint, and the
          hierarchical reasoning models trained on about a thousand examples.
        </p>
        {group ? (
          <div className="mt-12">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              {group.label}
            </p>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-faint">{group.intro}</p>
            <ul className="mt-6 border-b border-line">
              {group.items.map((paper) => (
                <li key={paper.title} className="border-t border-line py-5">
                  <a href={paper.href} className="text-base tracking-[-0.02em] hover:underline">
                    {paper.title}
                  </a>
                  <p className="mt-2 font-mono text-[0.75rem] text-muted">
                    {paper.meta.split(" · ").find((s) => s.includes("citations")) ?? ""}
                  </p>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-faint">{paper.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}
