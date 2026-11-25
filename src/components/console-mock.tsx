"use client";

import { useState } from "react";

const models = [
  {
    id: "qwen-32b",
    win: "71.4%",
    delta: "+9.2",
    kl: "0.04",
    curve:
      "M8 158 C 70 156, 90 140, 130 118 S 210 70, 280 58 S 400 42, 500 40 S 600 38, 632 36",
    mark: { x: 280, y: 58 },
    caption: "Climbs through the first two hundred preferences, then flattens",
  },
  {
    id: "llama-70b",
    win: "68.0%",
    delta: "+4.1",
    kl: "0.03",
    curve: "M8 112 C 80 108, 150 96, 220 88 S 360 76, 470 72 S 560 70, 632 68",
    mark: { x: 250, y: 84 },
    caption: "Starts higher and gains less from the same preference budget",
  },
  {
    id: "mistral-small",
    win: "73.1%",
    delta: "+11.4",
    kl: "0.06",
    curve: "M8 164 C 40 150, 70 96, 120 64 S 190 46, 280 44 S 460 42, 632 40",
    mark: { x: 190, y: 46 },
    caption: "Rises steeply, then levels off before the budget is spent",
  },
  {
    id: "gemma-27b",
    win: "69.4%",
    delta: "+8.1",
    kl: "0.05",
    curve: "M8 156 C 110 150, 190 128, 270 104 S 420 72, 520 58 S 590 50, 632 44",
    mark: { x: 360, y: 86 },
    caption: "Keeps climbing past two hundred preferences",
  },
  {
    id: "deepseek-v3",
    win: "75.8%",
    delta: "+12.6",
    kl: "0.05",
    curve: "M8 152 C 28 138, 55 78, 110 50 S 190 36, 320 34 S 500 32, 632 30",
    mark: { x: 160, y: 40 },
    caption: "Jumps early, then stays flat",
  },
  {
    id: "phi-4",
    win: "62.8%",
    delta: "+7.4",
    kl: "0.07",
    curve: "M8 162 C 90 158, 170 142, 250 122 S 380 102, 480 94 S 570 88, 632 84",
    mark: { x: 310, y: 112 },
    caption: "A slower climb with a lower ceiling",
  },
] as const;

const runs = [
  { id: "r-1842", status: "Live", note: "Training now", live: true },
  { id: "r-1801", status: "Gated", note: "Waiting on the evals", live: false },
  { id: "r-1777", status: "Shipped", note: "Released", live: false },
] as const;

export function ConsoleMock() {
  const [modelId, setModelId] = useState<(typeof models)[number]["id"]>("qwen-32b");
  const model = models.find((item) => item.id === modelId) ?? models[0];
  const labelOnLeft = model.mark.x > 500;

  return (
    <div className="flex w-full text-paper">
      <aside className="hidden w-[15.5rem] shrink-0 flex-col justify-between border-r border-white/10 p-5 md:flex">
        <div>
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
            Runs
          </p>
          <ul className="mt-4 space-y-4">
            {runs.map((run) => (
              <li key={run.id}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className={run.live ? "" : "text-[#a49d9a]"}>{run.id}</span>
                  <span
                    className={`font-mono text-[0.65rem] uppercase ${run.live ? "text-accent" : "text-[#a49d9a]"}`}
                  >
                    {run.status}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-snug text-[#a49d9a]">{run.note}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
            Preference budget
          </p>
          <p className="mt-2 text-sm">186 of 200 labels used</p>
          <div className="mt-2 h-1 bg-white/10" role="presentation">
            <div className="h-full w-[93%] bg-paper" />
          </div>
          <p className="mt-2 text-xs leading-snug text-[#a49d9a]">
            The run may use 200 preferences. Fourteen remain.
          </p>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
              Held-out win rate
            </p>
            <p className="mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">{model.win}</p>
            <p className="mt-2 max-w-md text-sm leading-snug text-[#ccc9c7]">
              Share of held-out pairs the trained policy wins against the base model.
              {model.delta} points above the base. KL {model.kl} keeps it close to that base.
              Checked against reward spec v3.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 border border-white/15 px-2 py-1 font-mono text-[0.7rem] text-[#a49d9a] uppercase">
            <span>Base</span>
            <select
              aria-label="Base model"
              value={model.id}
              onChange={(event) =>
                setModelId(event.target.value as (typeof models)[number]["id"])
              }
              className="appearance-none bg-transparent text-paper uppercase outline-none"
            >
              {models.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id}
                </option>
              ))}
            </select>
            <span aria-hidden="true">▾</span>
            <span className="text-paper">→ trained sdr-07</span>
          </label>
        </div>
        <svg
          viewBox="0 0 640 180"
          className="mt-4 h-40 w-full sm:h-52"
          role="img"
          aria-label={`${model.caption}. The dot marks 200 preferences.`}
        >
          <path d="M0 150 H640" stroke="rgba(255,255,255,0.08)" />
          <path d="M0 100 H640" stroke="rgba(255,255,255,0.08)" />
          <path d="M0 50 H640" stroke="rgba(255,255,255,0.08)" />
          <path d={model.curve} fill="none" stroke="#fafafa" strokeWidth="2" />
          <path d={`${model.curve} V 170 H 8 Z`} fill="rgba(222,92,54,0.28)" />
          <circle cx={model.mark.x} cy={model.mark.y} r="3.5" fill="#FF5C00" />
          <text
            x={labelOnLeft ? model.mark.x - 12 : model.mark.x + 12}
            y={model.mark.y - 8}
            fill="#ccc9c7"
            fontSize="12"
            fontFamily="ui-monospace, monospace"
            textAnchor={labelOnLeft ? "end" : "start"}
          >
            200 preferences
          </text>
        </svg>
        <p className="mt-2 text-sm leading-snug text-[#ccc9c7]">
          Win rate as preferences are added. {model.caption}. The dot marks where most of the
          gain has already arrived.
        </p>
        <div className="mt-3">
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
            Release checks
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Reward spec passed", "Style eval passed", "Safety eval waiting"].map((gate) => (
              <span
                key={gate}
                className="border border-white/15 px-2 py-1 font-mono text-[0.65rem] tracking-[-0.01em] text-[#ccc9c7] uppercase"
              >
                {gate}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
