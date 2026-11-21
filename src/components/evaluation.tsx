"use client";

import { useState } from "react";

const scoreBars = [
  { name: "ChatGPT", value: 92.43, color: "#3b6cff" },
  { name: "Claude", value: 93.8, color: "#7c5cff" },
  { name: "AIR", value: 97.9, color: "#ee6018" },
];

const costBars = [
  { name: "ChatGPT", value: 6.67, color: "#3b6cff" },
  { name: "Claude", value: 6.62, color: "#7c5cff" },
  { name: "AIR", value: 1.93, color: "#ee6018" },
];

const tasks = [
  "Payoff and release",
  "TSA deviation",
  "Environmental liability",
  "Board deck",
  "Indemnification comparison",
  "Disclosure schedules",
  "Stockholder summary",
  "Outside-counsel review",
  "Management rollover",
  "Pre-acquisition tax issues",
];

// Per-task score and cost read off the numbered scatter. These are chart
// readings, distinct from the published aggregate figures above.
const taskResults: Record<"air" | "codex" | "claude", { score: number; cost: number }>[] = [
  { air: { score: 97.5, cost: 1.21 }, codex: { score: 91.8, cost: 8.05 }, claude: { score: 96.6, cost: 6.77 } },
  { air: { score: 100, cost: 2.59 }, codex: { score: 89.0, cost: 4.76 }, claude: { score: 97.3, cost: 3.89 } },
  { air: { score: 99.7, cost: 1.23 }, codex: { score: 97.3, cost: 5.15 }, claude: { score: 98.7, cost: 3.69 } },
  { air: { score: 95.1, cost: 3.02 }, codex: { score: 79.7, cost: 9.49 }, claude: { score: 90.1, cost: 6.57 } },
  { air: { score: 99.8, cost: 1.64 }, codex: { score: 94.0, cost: 4.9 }, claude: { score: 98.6, cost: 3.12 } },
  { air: { score: 99.3, cost: 1.94 }, codex: { score: 100, cost: 8.01 }, claude: { score: 95.1, cost: 14.13 } },
  { air: { score: 97.2, cost: 0.83 }, codex: { score: 88.2, cost: 4.15 }, claude: { score: 87.5, cost: 2.67 } },
  { air: { score: 95.9, cost: 0.7 }, codex: { score: 92.2, cost: 3.04 }, claude: { score: 91.0, cost: 1.6 } },
  { air: { score: 97.3, cost: 1.84 }, codex: { score: 95.4, cost: 8.15 }, claude: { score: 88.3, cost: 10.54 } },
  { air: { score: 100, cost: 2.94 }, codex: { score: 100, cost: 9.83 }, claude: { score: 91.4, cost: 13.1 } },
];

const series = [
  { key: "air", name: "AIR Agent", color: "#ee6018", kind: "air" },
  { key: "codex", name: "Codex + GPT 6 Astra", color: "#3b6cff", kind: "codex" },
  { key: "claude", name: "Claude + Fable 5.1", color: "#7c5cff", kind: "claude" },
] as const;

const points = [
  { name: "AIR Agent", score: 97.9, cost: 1.93, kind: "air" },
  { name: "Codex + GPT 6 Astra", score: 92.43, cost: 6.67, kind: "codex" },
  { name: "Claude + Fable 5.1", score: 93.8, cost: 6.62, kind: "claude" },
  { name: "DeepSeek", score: 88.2, cost: 0.35, kind: "deepseek" },
] as const;

function Bars({
  title,
  rows,
  max,
  format,
}: {
  title: string;
  rows: { name: string; value: number; color: string }[];
  max: number;
  format: (value: number) => string;
}) {
  const ticks = [max, max / 2, 0];

  return (
    <div className="flex h-full min-h-80 flex-col bg-ink p-5 text-paper">
      <p className="text-lg tracking-[-0.03em]">{title}</p>
      <div className="mt-4 flex min-h-0 flex-1 gap-3 pt-6">
        <div className="relative w-8 shrink-0">
          {ticks.map((tick, index) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2 font-mono text-[0.65rem] text-white/45"
              style={{ top: `${(index / (ticks.length - 1)) * 100}%` }}
            >
              {format(tick)}
            </span>
          ))}
        </div>
        <div className="relative min-h-56 flex-1">
          {ticks.map((tick, index) => (
            <div
              key={tick}
              className="absolute inset-x-0 border-t border-dashed border-white/30"
              style={{ top: `${(index / (ticks.length - 1)) * 100}%` }}
            />
          ))}
          <div className="absolute inset-0 flex items-end justify-around gap-3 px-3">
            {rows.map((row) => (
              <div key={row.name} className="relative h-full w-full max-w-16">
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{ height: `${(row.value / max) * 100}%`, background: row.color }}
                >
                  <p className="absolute -top-5 right-0 left-0 text-center font-mono text-[0.7rem] whitespace-nowrap">
                    {format(row.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 pr-3 pl-11 text-center font-mono text-[0.65rem] tracking-[-0.02em] text-white/70 uppercase">
        {rows.map((row) => (
          <span key={row.name}>{row.name}</span>
        ))}
      </div>
    </div>
  );
}

function Mark({ kind, x, y }: { kind: (typeof points)[number]["kind"]; x: number; y: number }) {
  if (kind === "air") return <circle cx={x} cy={y} r="5" fill="#ee6018" />;
  if (kind === "deepseek") return <circle cx={x} cy={y} r="5" fill="#3d9a4a" />;
  if (kind === "codex") {
    return <path d={`M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y} Z`} fill="#3b6cff" />;
  }
  return <rect x={x - 5} y={y - 5} width="10" height="10" fill="#7c5cff" />;
}

export function Evaluation() {
  const [task, setTask] = useState<number | null>(null);
  const selected = task === null ? null : taskResults[task];

  return (
    <section id="evaluation" className="mx-auto w-full max-w-[1440px] px-4 py-16 lg:px-9 lg:py-24">
      <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        Sample evaluation results
      </p>
      <h2 className="mt-4 max-w-4xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
        Our systems created by our factory outperform today&apos;s leading AI models on expert reasoning tasks.
      </h2>
      <p className="mt-4 text-sm leading-snug lg:text-base">
        <span className="text-accent">Corporate M&amp;A Agent</span> against Claude and ChatGPT in
        the Harvey Labs Benchmark
      </p>

      <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.6fr)]">
        <Bars title="Performance score" rows={scoreBars} max={100} format={(value) => String(value)} />
        <Bars
          title="Cost, USD"
          rows={costBars}
          max={7}
          format={(value) =>
            value === 0 || value === 3.5 || value === 7 ? String(value) : `$${value.toFixed(2)}`
          }
        />

        <div className="flex h-full flex-col bg-ink p-5 text-paper">
          <p className="text-lg tracking-[-0.03em]">Agent cost vs performance by task</p>
          <div className="mt-4 grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_11rem]">
            <div
              className="flex h-full min-h-56 flex-col pt-6"
              role="img"
              aria-label="AIR Agent scores 97.9 percent at $1.93. Codex plus GPT 6 Astra scores 92.43 percent at $6.67. Claude plus Fable 5.1 scores 93.8 percent at $6.62. DeepSeek scores 88.2 percent at $0.35."
            >
              <div className="flex min-h-0 flex-1 gap-2">
                <div className="relative w-8 shrink-0">
                  {[100, 90, 80, 70, 60].map((tick) => (
                    <span
                      key={tick}
                      className="absolute right-0 -translate-y-1/2 font-mono text-[0.65rem] text-white/45"
                      style={{ top: `${((100 - tick) / 40) * 100}%` }}
                    >
                      {tick}%
                    </span>
                  ))}
                </div>
                <div className="relative min-h-0 flex-1">
                  {[100, 90, 80, 70, 60].map((tick) => (
                    <div
                      key={tick}
                      className="absolute inset-x-0 border-t border-dashed border-white/30"
                      style={{ top: `${((100 - tick) / 40) * 100}%` }}
                    />
                  ))}
                  {points.map((point) => (
                    <span
                      key={point.name}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${(point.cost / 14) * 100}%`,
                        top: `${((100 - point.score) / 40) * 100}%`,
                      }}
                    >
                      <svg viewBox="0 0 12 12" className="size-3 overflow-visible">
                        <Mark kind={point.kind} x={6} y={6} />
                      </svg>
                    </span>
                  ))}
                  {selected &&
                    series.map((item) => {
                      const reading = selected[item.key];
                      return (
                        <span
                          key={item.key}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${(Math.min(reading.cost, 14) / 14) * 100}%`,
                            top: `${((100 - reading.score) / 40) * 100}%`,
                          }}
                        >
                          <svg viewBox="0 0 12 12" className="size-4 overflow-visible">
                            <circle cx="6" cy="6" r="7.5" fill="none" stroke="#ffffff" strokeWidth="0.7" />
                            <Mark kind={item.kind} x={6} y={6} />
                          </svg>
                        </span>
                      );
                    })}
                </div>
              </div>
              <div className="relative mt-1 ml-10 h-4">
                {[0, 2, 4, 6, 8, 10, 12, 14].map((tick) => (
                  <span
                    key={tick}
                    className="absolute -translate-x-1/2 font-mono text-[0.65rem] text-white/45"
                    style={{ left: `${(tick / 14) * 100}%` }}
                  >
                    ${tick}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid h-full min-h-0 content-start items-start gap-x-6 gap-y-5 grid-cols-2 lg:flex lg:flex-col">
              <ul className="grid min-w-0 gap-3 text-xs">
                {points.map((point) => {
                  const reading =
                    selected && point.kind !== "deepseek" ? selected[point.kind] : point;
                  return (
                    <li key={point.name} className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5">
                      <span
                        className="mt-1 size-2.5"
                        style={{
                          background:
                            point.kind === "air"
                              ? "#ee6018"
                              : point.kind === "codex"
                                ? "#3b6cff"
                                : point.kind === "claude"
                                  ? "#7c5cff"
                                  : "#3d9a4a",
                        }}
                      />
                      <span>{point.name}</span>
                      <span />
                      <span className="font-mono text-[0.65rem] text-white/60">
                        {reading.score}% · ${reading.cost.toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="flex min-h-0 min-w-0 flex-col lg:flex-1">
                <p className="font-mono text-[0.65rem] tracking-[-0.02em] text-white/55 uppercase">
                  Task key
                </p>
                <ol className="mt-2 grid max-h-32 min-h-0 gap-1 overflow-y-auto pr-2 text-xs [scrollbar-color:rgba(255,255,255,0.35)_transparent] [scrollbar-width:thin] lg:max-h-none lg:flex-1">
                  {tasks.map((name, index) => (
                    <li key={name}>
                      <button
                        type="button"
                        aria-pressed={task === index}
                        onClick={() => setTask(task === index ? null : index)}
                        className={`w-full text-left ${task === index ? "text-white" : "text-white/80 hover:text-white"}`}
                      >
                        <span className={task === index ? "text-accent" : undefined}>{index + 1}</span> {name}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
