"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const W = 1100;
const H = 920;
const LINK_MS = 600;
const HOLD_MS = 2000;

type Beat = { index: number; phase: "link" | "node" };

type Side = "left" | "right" | "above" | "below";
type Tone = "ink" | "accent" | "hollow";

type Step = {
  n: string;
  name: string;
  note: string;
  description: string;
  x: number;
  y: number;
  side: Side;
  tone: Tone;
  list?: string[];
  shift?: { x: number; y: number; align: "left" | "right" | "center" };
};

const steps: Step[] = [
  {
    n: "01",
    name: "Request",
    note: "The question comes in.",
    description:
      "The human types into one chat. They do not pick a system, an agent, or a model.",
    x: 230,
    y: 52,
    side: "left",
    tone: "ink",
  },
  {
    n: "02",
    name: "Gateway",
    note: "One entry for the call.",
    description:
      "One entry for every model call. If the chosen model fails, the call moves to the fallback.",
    x: 620,
    y: 124,
    side: "right",
    tone: "ink",
  },
  {
    n: "03",
    name: "Policy",
    note: "Checked against governance.",
    description: "The call is checked against governance before a system is opened.",
    x: 390,
    y: 206,
    side: "left",
    tone: "ink",
    shift: { x: -176, y: -96, align: "right" },
  },
  {
    n: "04",
    name: "Risk",
    note: "What the use case may do.",
    description: "What the use case is allowed to do.",
    x: 160,
    y: 300,
    side: "left",
    tone: "ink",
  },
  {
    n: "05",
    name: "Rights",
    note: "Who may see what is opened.",
    description: "Who may see what is opened.",
    x: 430,
    y: 372,
    side: "below",
    tone: "ink",
  },
  {
    n: "06",
    name: "Budget",
    note: "How much the call may spend.",
    description: "How much the call may spend.",
    x: 730,
    y: 300,
    side: "right",
    tone: "ink",
  },
  {
    n: "07",
    name: "Systems",
    note: "The call chooses what to open.",
    description:
      "The call chooses what to open, and opens it where it already lives. A policy in SharePoint stays in SharePoint.",
    x: 470,
    y: 490,
    side: "right",
    tone: "ink",
    list: ["SharePoint", "Internal system", "Case file", "Facility file"],
    shift: { x: 22, y: 18, align: "left" },
  },
  {
    n: "08",
    name: "RAG",
    note: "The passage is retrieved.",
    description:
      "The passage is retrieved from the document. The human receives the answer, not a second copy.",
    x: 190,
    y: 582,
    side: "left",
    tone: "ink",
  },
  {
    n: "09",
    name: "Agent",
    note: "Handed the request. It keeps its own systems.",
    description:
      "The orchestrator hands the request to the agent. The agent keeps its own systems and opens them through MCP.",
    x: 500,
    y: 668,
    side: "above",
    tone: "ink",
    shift: { x: -176, y: 18, align: "right" },
  },
  {
    n: "10",
    name: "Model",
    note: "As many calls as it needs.",
    description:
      "The agent calls the model as many times as it needs. A client file stays on the enterprise’s machines.",
    x: 760,
    y: 748,
    side: "right",
    tone: "accent",
  },
  {
    n: "11",
    name: "Orchestrator",
    note: "Serves the answer back.",
    description: "The completed request comes back. The orchestrator serves the answer in the same chat.",
    x: 170,
    y: 880,
    side: "left",
    tone: "hollow",
  },
];

function squareClass(tone: Tone) {
  if (tone === "accent") return "bg-accent";
  if (tone === "hollow") return "border border-foreground bg-white";
  return "bg-foreground";
}

function Label({ step }: { step: Step }) {
  const align =
    step.shift?.align ?? (step.side === "left" ? "right" : step.side === "right" ? "left" : "center");
  const place = step.shift
    ? `w-40 ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}`
    : step.side === "above"
      ? "bottom-5 left-1/2 w-40 -translate-x-1/2 text-center"
      : step.side === "below"
        ? "top-5 left-1/2 w-44 -translate-x-1/2 text-center"
        : step.side === "left"
          ? "right-5 top-1/2 w-40 -translate-y-1/2 text-right"
          : `${step.tone === "accent" ? "left-12" : "left-5"} top-1/2 w-44 -translate-y-1/2 text-left`;

  return (
    <div
      className={`absolute ${place}`}
      style={step.shift ? { left: step.shift.x, top: step.shift.y } : undefined}
    >
      <p
        className={`flex items-baseline gap-2 ${
          align === "right" ? "justify-end" : align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted">{step.n}</span>
        <span
          className={`font-mono text-[0.75rem] tracking-[-0.015rem] underline uppercase ${
            step.tone === "accent" ? "text-accent" : "text-foreground"
          }`}
        >
          {step.name}
        </span>
      </p>
      <p className="mt-1 text-[0.75rem] leading-snug text-faint">{step.note}</p>
      {step.list ? (
        <ul className="mt-1">
          {step.list.map((item) => (
            <li
              key={item}
              className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function edgeLit(beat: Beat | null, selectedIndex: number, edgeIndex: number) {
  if (selectedIndex > edgeIndex) return true;
  return beat !== null && beat.index > edgeIndex;
}

function meetFrame(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  half: number,
  end: "start" | "end",
) {
  if (half <= 0) return { x1, y1, x2, y2 };
  const cx = end === "end" ? x2 : x1;
  const cy = end === "end" ? y2 : y1;
  const ox = end === "end" ? x1 : x2;
  const oy = end === "end" ? y1 : y2;
  const dx = cx - ox;
  const dy = cy - oy;
  const span = Math.max(Math.abs(dx), Math.abs(dy));
  if (span === 0) return { x1, y1, x2, y2 };
  const scale = Math.min(half / span, 1);
  const x = cx - dx * scale;
  const y = cy - dy * scale;
  return end === "end" ? { x1, y1, x2: x, y2: y } : { x1: x, y1: y, x2, y2 };
}

function PlayButton({ playing, onClick }: { playing: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={playing}
      aria-label={playing ? "Pause the flow" : "Play the flow"}
      className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase"
    >
      {playing ? (
        <span className="flex gap-0.5" aria-hidden>
          <span className="h-3 w-1 bg-accent" />
          <span className="h-3 w-1 bg-accent" />
        </span>
      ) : (
        <span
          aria-hidden
          className="block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-accent"
        />
      )}
      {playing ? "Pause" : "Play"}
    </button>
  );
}

export function SystemPath() {
  const [open, setOpen] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState<Beat | null>(null);
  const cursor = useRef<Beat>({ index: 0, phase: "node" });
  const finished = useRef(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const [frameHalf, setFrameHalf] = useState(0);
  const shown = beat?.phase === "node" ? steps[beat.index].n : open;
  const selectedIndex = open === null ? -1 : steps.findIndex((step) => step.n === open);
  const modelIndex = steps.findIndex((step) => step.tone === "accent");

  useLayoutEffect(() => {
    const diagram = diagramRef.current;
    const frame = frameRef.current;
    if (!diagram || !frame) return;
    const measure = () => {
      const host = diagram.getBoundingClientRect();
      const box = frame.getBoundingClientRect();
      if (host.width === 0 || box.width === 0) return;
      const unit = W / host.width;
      setFrameHalf((box.width / 2) * unit + unit);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(diagram);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let timer = 0;
    const linkMs = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : LINK_MS;

    const advance = () => {
      const { index, phase } = cursor.current;
      if (phase === "link") {
        setBeat({ index, phase: "link" });
        timer = window.setTimeout(() => {
          cursor.current = { index, phase: "node" };
          advance();
        }, linkMs);
        return;
      }
      setBeat({ index, phase: "node" });
      timer = window.setTimeout(() => {
        if (index + 1 >= steps.length) {
          finished.current = true;
          setPlaying(false);
          return;
        }
        cursor.current = { index: index + 1, phase: "link" };
        advance();
      }, HOLD_MS);
    };

    advance();
    return () => window.clearTimeout(timer);
  }, [playing]);

  function onPlay() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (finished.current) {
      finished.current = false;
      cursor.current = { index: 0, phase: "node" };
      setBeat(null);
    }
    setOpen(null);
    setPlaying(true);
  }

  function onNode(step: Step) {
    setPlaying(false);
    finished.current = true;
    cursor.current = { index: 0, phase: "node" };
    const was = shown;
    setBeat(null);
    setOpen(was === step.n ? null : step.n);
  }

  return (
    <figure
      className="relative border border-line bg-[linear-gradient(180deg,#e8e6e4_0%,#f4f3f2_46%,#f9f9f9_100%)]"
      aria-label="A request enters the gateway. The gateway checks it against policy, then against risk, rights, and budget. It chooses which systems to open and retrieves the passage. It can hand the request to an agent. The agent calls the model as many times as it needs and opens its own systems through MCP. The completed request goes back to the orchestrator, which serves the answer. Every reasoning step is kept with the trace."
    >
      <div className="flex justify-end px-4 pt-4 lg:absolute lg:top-[2%] lg:right-[3.64%] lg:z-20 lg:px-0 lg:pt-0">
        <PlayButton playing={playing} onClick={onPlay} />
      </div>

      <ol className="grid px-4 py-6 lg:hidden">
        {steps.map((step, index) => {
          const blinking = playing && beat?.phase === "node" && beat.index === index;
          return (
            <li key={step.n} className="grid grid-cols-[0.875rem_minmax(0,1fr)] gap-4">
              <div className="flex flex-col items-center">
                <span className={`size-3.5 shrink-0 ${squareClass(step.tone)} ${blinking ? "node-blink" : ""}`} />
                {index < steps.length - 1 ? (
                  <span className={`w-px flex-1 ${edgeLit(beat, selectedIndex, index) ? "bg-accent" : "bg-foreground"}`} />
                ) : null}
              </div>
              <div className={step.tone === "accent" ? "mb-4 border border-dashed border-accent px-3 py-2" : "pb-5"}>
                <p className="flex items-baseline gap-2">
                  <span className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted">{step.n}</span>
                  <span
                    className={`font-mono text-[0.75rem] tracking-[-0.015rem] underline uppercase ${
                      step.tone === "accent" ? "text-accent" : ""
                    }`}
                  >
                    {step.name}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-snug text-faint">{step.note}</p>
                {shown === step.n ? (
                  <p className="mt-2 text-sm leading-snug text-faint">{step.description}</p>
                ) : null}
                {step.list ? (
                  <ul className="mt-2 grid gap-1">
                    {step.list.map((item) => (
                      <li
                        key={item}
                        className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <div ref={diagramRef} className="relative hidden lg:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          {steps.slice(0, -1).map((step, index) => {
            const next = steps[index + 1];
            const lit = edgeLit(beat, selectedIndex, index);
            const trimmed =
              index + 1 === modelIndex
                ? meetFrame(step.x, step.y, next.x, next.y, frameHalf, "end")
                : index === modelIndex
                  ? meetFrame(step.x, step.y, next.x, next.y, frameHalf, "start")
                  : { x1: step.x, y1: step.y, x2: next.x, y2: next.y };
            return (
              <line
                key={`${step.n}-${next.n}`}
                x1={trimmed.x1}
                y1={trimmed.y1}
                x2={trimmed.x2}
                y2={trimmed.y2}
                stroke={lit ? "#FF5C00" : "currentColor"}
                strokeWidth={lit ? 1.75 : 1.25}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          <line
            x1={W - 28}
            y1={36}
            x2={W - 28}
            y2={H - 24}
            stroke="#d6d3d2"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {steps.map((step) => (
            <line
              key={step.n}
              x1={W - 34}
              y1={step.y}
              x2={W - 22}
              y2={step.y}
              stroke="#d6d3d2"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {steps.map((step, index) => {
          const blinking = playing && beat?.phase === "node" && beat.index === index;
          return (
            <div
              key={step.n}
              className="absolute"
              style={{ left: `${(step.x / W) * 100}%`, top: `${(step.y / H) * 100}%` }}
            >
              {step.tone === "accent" ? (
                <span
                  ref={frameRef}
                  className="absolute top-0 left-0 size-14 -translate-x-1/2 -translate-y-1/2 border border-dashed border-accent"
                />
              ) : null}
              <button
                type="button"
                aria-expanded={shown === step.n}
                aria-label={step.name}
                onClick={() => onNode(step)}
                className="absolute top-0 left-0 z-10 size-8 -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  className={`absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 ${squareClass(step.tone)} ${blinking ? "node-blink" : ""}`}
                />
              </button>
              {shown === step.n ? (
                <div className="absolute bottom-full left-1/2 z-30 mb-3 w-56 -translate-x-1/2 border border-foreground bg-surface px-3 py-2 text-left">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] uppercase">
                    {step.n} {step.name}
                  </p>
                  <p className="mt-1 text-sm leading-snug text-faint">{step.description}</p>
                </div>
              ) : null}
              <Label step={step} />
            </div>
          );
        })}
      </div>

      <figcaption className="flex flex-col gap-2 border-t border-line px-4 py-4 lg:flex-row lg:items-baseline lg:justify-between lg:px-6">
        <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
          <span className="size-1.5 bg-accent" aria-hidden />
          Flow
        </p>
        <p className="text-sm leading-snug text-faint">
          Every reasoning step is kept with the trace.
        </p>
      </figcaption>
    </figure>
  );
}
