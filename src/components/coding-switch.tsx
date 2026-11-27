"use client";

import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "@/components/button";
import { CodingAgent } from "@/components/coding-agent";

const views = [
  { id: "summary", label: "Summary" },
  { id: "sources", label: "Sources" },
  { id: "platform", label: "Platform" },
  { id: "agent", label: "Agent" },
  { id: "review", label: "Review" },
  { id: "demo", label: "Demo" },
  { id: "setup", label: "Architecture" },
] as const;

type View = (typeof views)[number]["id"];

function isView(value: string | null): value is View {
  return views.some((item) => item.id === value);
}

function IsoCube({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
  const top = `${x},${y - 20} ${x + 11},${y - 14} ${x},${y - 8} ${x - 11},${y - 14}`;
  const left = `${x - 11},${y - 14} ${x},${y - 8} ${x},${y + 4} ${x - 11},${y - 2}`;
  const right = `${x},${y - 8} ${x + 11},${y - 14} ${x + 11},${y - 2} ${x},${y + 4}`;
  return (
    <g stroke={accent ? "#FF5C00" : "#101010"} strokeWidth="1.1" strokeLinejoin="miter">
      <polygon points={left} fill={accent ? "#b84828" : "#e7e4e2"} />
      <polygon points={right} fill={accent ? "#FF5C00" : "#f7f6f5"} />
      <polygon points={top} fill={accent ? "#e97858" : "#ffffff"} />
    </g>
  );
}

function PlaneNode({
  x,
  y,
  label,
  detail,
  subdetail,
  info,
  accent = false,
  onShow,
  onPress,
  onHide,
}: {
  x: number;
  y: number;
  label: string;
  detail?: string;
  subdetail?: string;
  info: string;
  accent?: boolean;
  onShow: (event: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onPress: (event: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onHide: () => void;
}) {
  const extraLines = (detail ? 1 : 0) + (subdetail ? 1 : 0);
  return (
    <g
      className="cursor-help"
      onMouseEnter={(event) => onShow(event, label, info)}
      onMouseMove={(event) => onShow(event, label, info)}
      onMouseLeave={onHide}
      onClick={(event) => onPress(event, label, info)}
    >
      <rect x={x - 78} y={y - 28} width={156} height={extraLines === 2 ? 96 : extraLines === 1 ? 80 : 62} fill="transparent" />
      <IsoCube x={x} y={y} accent={accent} />
      <text x={x} y={y + 22} textAnchor="middle" className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase">
        {label}
      </text>
      {detail ? (
        <text x={x} y={y + 38} textAnchor="middle" className="fill-faint font-mono text-[12px] tracking-[-0.01em] uppercase">
          {detail}
        </text>
      ) : null}
      {subdetail ? (
        <text x={x} y={y + 54} textAnchor="middle" className="fill-faint font-mono text-[12px] tracking-[-0.01em] uppercase">
          {subdetail}
        </text>
      ) : null}
    </g>
  );
}

function CodingDiagram() {
  const frameX = 76;
  const frameW = 760;
  const frameCenter = frameX + frameW / 2;
  const col = [170, 360, 554, 744];
  const proxy = { x: col[0], y: 230 };
  const task = { x: col[1], y: 230 };
  const gateway = { x: col[2], y: 230 };
  const otel = { x: col[3], y: 230 };
  const ticket = { x: col[0], y: 324 };
  const tools = { x: col[1], y: 324 };
  const sandbox = { x: col[2], y: 324 };
  const redis = { x: col[3], y: 324 };
  const postgres = { x: (col[0] + col[1]) / 2, y: 418 };
  const model = { x: col[2], y: 418 };
  const plan = { x: col[0], y: 640 };
  const tests = { x: col[1], y: 640 };
  const branch = { x: col[2], y: 640 };
  const review = { x: col[3], y: 640 };
  const humanX = (col[0] + col[1]) / 2;
  const appsX = (col[2] + col[3]) / 2;
  const gitX = frameX + frameW + 48;
  const gitCenter = gitX + 80;
  const dash = "5 4";
  const sectionRef = useRef<HTMLElement>(null);
  const [tip, setTip] = useState<{ title: string; body: string; x: number; y: number } | null>(null);

  function coarsePointer() {
    return window.matchMedia("(hover: none)").matches;
  }

  function placeTip(event: ReactMouseEvent<SVGGElement>, title: string, body: string) {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    const width = 288;
    const height = 148;
    let x = event.clientX - bounds.left + 14;
    let y = event.clientY - bounds.top + 18;
    if (x + width > bounds.width - 8) x = event.clientX - bounds.left - width - 10;
    if (y + height > bounds.height - 8) y = event.clientY - bounds.top - height - 10;
    return { title, body, x: Math.max(8, x), y: Math.max(8, y) };
  }

  function showTip(event: ReactMouseEvent<SVGGElement>, title: string, body: string) {
    if (coarsePointer()) return;
    const next = placeTip(event, title, body);
    if (next) setTip(next);
  }

  function pressTip(event: ReactMouseEvent<SVGGElement>, title: string, body: string) {
    event.stopPropagation();
    if (!coarsePointer()) return;
    const next = placeTip(event, title, body);
    if (!next) return;
    setTip((current) => (current?.title === title ? null : next));
  }

  function hideTip() {
    if (coarsePointer()) return;
    setTip(null);
  }

  const node = { onShow: showTip, onPress: pressTip, onHide: hideTip };

  return (
    <section ref={sectionRef} className="relative border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span aria-hidden className="size-1.5 bg-accent" />
        Architecture
      </p>
      <p className="mt-5 max-w-xl text-base leading-snug text-faint">
        A task enters through the gateway. A sandbox clones the repository, calls the model only
        through the model proxy, and leaves a pull request. The repository stays where it is.
      </p>
      <div className="mt-5 max-w-full min-w-0 overflow-x-auto">
        <svg
          onClick={() => {
            if (coarsePointer()) setTip(null);
          }}
          viewBox="0 0 1120 760"
          className="block h-auto w-full min-w-[64rem]"
          role="img"
          aria-label="Coding architecture. A person and the git host arrive at one URL. The gateway checks the task, a sandbox runs the tools, and the model proxy is the only path to the model. The pull request is what leaves."
        >
          <rect x={frameX} y="176" width={frameW} height="292" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x={frameX} y="584" width={frameW} height="140" fill="#f4f3f2" stroke="#d6d3d2" />

          <g fill="none" stroke="#c8c4c2" strokeWidth="1.25" strokeDasharray={dash}>
            <path d={`M${proxy.x + 12},${proxy.y - 14} L${task.x - 12},${task.y - 14}`} />
            <path d={`M${task.x + 12},${task.y - 14} L${gateway.x - 12},${gateway.y - 14}`} />
            <path d={`M${proxy.x},${proxy.y - 22} C ${task.x},${proxy.y - 64} ${task.x},${gateway.y - 64} ${gateway.x},${gateway.y - 22}`} />
            <path d={`M${gateway.x + 12},${gateway.y - 14} L${otel.x - 12},${otel.y - 14}`} />
            <path d={`M${gateway.x + 8},${gateway.y + 2} L${redis.x - 8},${redis.y - 18}`} />
            <path d={`M${gateway.x},${gateway.y + 4} L${sandbox.x},${sandbox.y - 20}`} />
            <path d={`M${gateway.x - 10},${gateway.y + 2} L${postgres.x + 8},${postgres.y - 20}`} />
            <path d={`M${sandbox.x - 12},${sandbox.y - 10} L${tools.x + 12},${tools.y - 10}`} />
            <path d={`M${sandbox.x - 8},${sandbox.y + 2} L${postgres.x + 10},${postgres.y - 18}`} />
            <path d={`M${ticket.x + 6},${ticket.y + 4} L${postgres.x - 8},${postgres.y - 18}`} />
          </g>
          <path
            d={`M${gateway.x + 14},${gateway.y - 8} C ${gateway.x + 150},${gateway.y + 24} ${model.x + 150},${model.y - 80} ${model.x + 12},${model.y - 18}`}
            fill="none"
            stroke="#FF5C00"
            strokeWidth="1.6"
          />
          <path
            d={`M${model.x + 18},${model.y - 2} H ${gitCenter} V 548`}
            fill="none"
            stroke="#FF5C00"
            strokeWidth="1.5"
            strokeDasharray={dash}
          />

          <g fill="none" stroke="#101010" strokeWidth="1.25">
            {[humanX, appsX].map((x) => (
              <g key={x}>
                <path d={`M${x},128 v18`} />
                <path d={`M${x - 3.5},133 l3.5,-6 l3.5,6`} />
                <path d={`M${x - 3.5},141 l3.5,6 l3.5,-6`} />
              </g>
            ))}
          </g>
          <g fill="none" stroke="#FF5C00" strokeWidth="1.35">
            <path d={`M${model.x},456 v36`} />
            <path d={`M${model.x - 3.5},462 l3.5,-6 l3.5,6`} />
            <path d={`M${model.x - 3.5},486 l3.5,6 l3.5,-6`} />
            <path d={`M${model.x},552 v24`} />
            <path d={`M${model.x - 3.5},558 l3.5,-6 l3.5,6`} />
            <path d={`M${model.x - 3.5},570 l3.5,6 l3.5,-6`} />
          </g>

          <g
            className="cursor-help"
            onMouseEnter={(event) =>
              showTip(event, "One URL", "A person and the git host both arrive here. The repository is not copied out. Sign-in is the enterprise’s single sign-on.")
            }
            onMouseMove={(event) =>
              showTip(event, "One URL", "A person and the git host both arrive here. The repository is not copied out. Sign-in is the enterprise’s single sign-on.")
            }
            onMouseLeave={hideTip}
            onClick={(event) =>
              pressTip(event, "One URL", "A person and the git host both arrive here. The repository is not copied out. Sign-in is the enterprise’s single sign-on.")
            }
          >
            <rect x={frameX} y="78" width={frameW} height="36" fill="#ffffff" stroke="#101010" />
            <text x={frameCenter} y="101" textAnchor="middle" className="fill-foreground font-mono text-[14px] tracking-[-0.01em] uppercase">
              HTTPS · the repo stays · Corporate SSO
            </text>
          </g>
          <g
            className="cursor-help"
            onMouseEnter={(event) =>
              showTip(event, "The coding model", "The model proxy is the only caller. The sandbox does not open a port on the GPU. Plan, tests, the branch, and review all use that one path.")
            }
            onMouseMove={(event) =>
              showTip(event, "The coding model", "The model proxy is the only caller. The sandbox does not open a port on the GPU. Plan, tests, the branch, and review all use that one path.")
            }
            onMouseLeave={hideTip}
            onClick={(event) =>
              pressTip(event, "The coding model", "The model proxy is the only caller. The sandbox does not open a port on the GPU. Plan, tests, the branch, and review all use that one path.")
            }
          >
            <rect x={model.x - 228} y="508" width="456" height="34" fill="#ffffff" stroke="#FF5C00" />
            <text x={model.x} y="530" textAnchor="middle" className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase">
              Model proxy → the coding model only
            </text>
          </g>

          <g fill="none" stroke="#101010" strokeWidth="1.25">
            {[humanX - 44, humanX, humanX + 44].map((x) => (
              <g key={`human-${x}`} transform={`translate(${x} 28)`}>
                <circle cx="0" cy="0" r="5" />
                <path d="M-8 16c1.4-5 4-7.5 8-7.5s6.6 2.5 8 7.5" />
              </g>
            ))}
            {[appsX - 44, appsX, appsX + 44].map((x) => (
              <g key={`screen-${x}`} transform={`translate(${x} 30)`}>
                <rect x="-9" y="-7" width="18" height="12" />
                <path d="M0 5v4M-5 9h10" />
              </g>
            ))}
          </g>
          <text x={humanX} y="62" textAnchor="middle" className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase">
            A human · Task
          </text>
          <text x={appsX} y="62" textAnchor="middle" className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase">
            Git host · API
          </text>

          <PlaneNode {...proxy} {...node} label="Proxy" detail="TLS entry point" info="The entry on the internal network. It terminates HTTPS and sends the task to the task UI and the API to the gateway." />
          <PlaneNode {...task} {...node} label="Task UI" detail="where the job is written" info="Where a person writes the task, or where a ticket is opened. The UI calls the gateway." />
          <PlaneNode {...gateway} {...node} label="Gateway ×2" detail="policy and budget" accent info="Checks the person, the policy, and the budget before a repository is opened." />
          <PlaneNode {...otel} {...node} label="OTel" detail="session traces" info="The trace of the run goes to the monitoring the enterprise already uses." />
          <PlaneNode {...ticket} {...node} label="Ticket" detail="the tracker" info="The job in the tracker. The task is this ticket. The agent does not start from a blank editor." />
          <PlaneNode {...tools} {...node} label="Tools" detail="shell, editor, browser" info="The tools run in the sandbox, as the person who started the task. They do not get that person’s laptop." />
          <PlaneNode {...sandbox} {...node} label="Sandbox ×2" detail="clone and run" info="A clone of the repository. Two sandboxes so two tasks do not share a machine." />
          <PlaneNode {...redis} {...node} label="Redis 7" detail="budgets and cache" info="The token budget for the session. The gateway is what talks to it." />
          <PlaneNode {...postgres} {...node} label="Postgres 16" detail="sessions and logs" info="The session, the job queue, and the log of every tool call. A run can be replayed from here." />
          <PlaneNode {...model} {...node} label="Model proxy" detail="sole path to the model" accent info="The only path to the model. The sandbox does not call a model directly." />
          <PlaneNode {...plan} {...node} label="Plan" detail="steps in code" subdetail="a person can stop it" info="The ordered steps. A person can edit them or stop the run before files change." />
          <PlaneNode {...tests} {...node} label="Tests" detail="the repo’s suite" subdetail="a red check stays" info="The sandbox runs the tests the repository already has. A failure stays on the session." />
          <PlaneNode {...branch} {...node} label="Branch" detail="the change" subdetail="not a silent write" info="The edit is a branch. The repository itself is not rewritten in place." />
          <PlaneNode {...review} {...node} label="Review" detail="a person merges" subdetail="the agent does not" info="The pull request waits. A person reads the diff and merges. The agent does not." />

          <g
            className="cursor-help"
            onMouseEnter={(event) => showTip(event, "Git host", "The repository stays on the git host. The sandbox clones it. The only thing sent back is a pull request.")}
            onMouseMove={(event) => showTip(event, "Git host", "The repository stays on the git host. The sandbox clones it. The only thing sent back is a pull request.")}
            onMouseLeave={hideTip}
            onClick={(event) => pressTip(event, "Git host", "The repository stays on the git host. The sandbox clones it. The only thing sent back is a pull request.")}
          >
            <rect x={gitX} y="548" width="160" height="72" fill="#ffffff" stroke="#101010" />
            <text x={gitCenter} y="580" textAnchor="middle" className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase">
              Git
            </text>
            <text x={gitCenter} y="598" textAnchor="middle" className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase">
              host
            </text>
          </g>
          <path d={`M${gitCenter},620 v22`} fill="none" stroke="#101010" strokeWidth="1.25" />
          <path d={`M${gitCenter - 3.5},636 l3.5,6 l3.5,-6`} fill="none" stroke="#101010" strokeWidth="1.25" />
          <g
            className="cursor-help"
            onMouseEnter={(event) => showTip(event, "Pull request", "The change leaves as a pull request. It names the ticket. A person reviews it. Nothing merges until that person says so.")}
            onMouseMove={(event) => showTip(event, "Pull request", "The change leaves as a pull request. It names the ticket. A person reviews it. Nothing merges until that person says so.")}
            onMouseLeave={hideTip}
            onClick={(event) => pressTip(event, "Pull request", "The change leaves as a pull request. It names the ticket. A person reviews it. Nothing merges until that person says so.")}
          >
            <rect x={gitX} y="648" width="160" height="64" fill="#ffffff" stroke="#101010" strokeDasharray={dash} />
            <text x={gitCenter} y="674" textAnchor="middle" className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase">
              Pull request
            </text>
            <text x={gitCenter} y="692" textAnchor="middle" className="fill-faint font-mono text-[12px] tracking-[-0.01em]">
              a person merges
            </text>
          </g>
        </svg>
      </div>
      {tip ? (
        <div role="tooltip" className="pointer-events-none absolute z-20 w-72 border border-line bg-surface px-3 py-2.5" style={{ left: tip.x, top: tip.y }}>
          <p className="font-mono text-[0.7rem] tracking-[-0.01em] uppercase">{tip.title}</p>
          <p className="mt-1.5 text-sm leading-snug text-faint">{tip.body}</p>
        </div>
      ) : null}
    </section>
  );
}

function Section({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        {eyebrow}
      </p>
      {children}
    </section>
  );
}

function Table({
  columns,
  rows,
}: {
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-normal text-muted">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-t border-line">
              {row.map((cell, index) => (
                <td
                  key={`${row[0]}-${index}`}
                  className={
                    index === 0
                      ? "px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] whitespace-nowrap uppercase"
                      : "px-4 py-3 text-sm text-faint"
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodingSwitch({
  enabled,
  initialReady,
}: {
  enabled: boolean;
  initialReady: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("view");
  const view: View = isView(requested) ? requested : "summary";

  function select(next: View) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "summary") params.delete("view");
    else params.set("view", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex w-full max-w-full flex-wrap items-center gap-2 lg:contents">
          <button
            type="button"
            aria-pressed={view === "demo"}
            onClick={() => select("demo")}
            className={`group relative order-last inline-flex h-[31px] items-center justify-center overflow-hidden border px-3.5 font-mono text-[0.8125rem] leading-none tracking-[-0.0175rem] capitalize lg:order-none ${
              view === "demo"
                ? "border-transparent bg-ink text-paper [--stripe:rgba(255,255,255,0.18)]"
                : "border-line-strong bg-background text-foreground [--stripe:rgba(0,0,0,0.14)]"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              Demo <ArrowRight />
            </span>
            <span
              aria-hidden
              className="stripe-hover pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
            />
          </button>
          <div
            className="contents lg:ml-auto lg:flex lg:w-fit lg:max-w-full lg:flex-wrap lg:justify-end lg:gap-0 lg:border lg:border-line"
            role="group"
            aria-label="View"
          >
            {views
              .filter((item) => item.id !== "demo")
              .map((item, index) => {
                const selected = view === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => select(item.id)}
                    className={`h-[31px] px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase max-lg:border max-lg:border-line ${
                      index > 0 ? "lg:border-l lg:border-line" : ""
                    } ${selected ? "bg-foreground text-background" : "bg-surface text-muted"}`}
                  >
                    {item.label}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {view === "summary" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Coding">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              A coding agent takes a task, works in a repository, and returns a change a person
              can review. Code fixes the steps. A model reasons inside each step, in a sandbox,
              with that person’s permissions.
            </p>
            <Table
              columns={["Layer", "What runs"]}
              rows={[
                ["Task", "A ticket, a message, or a written job"],
                ["Plan", "An ordered list the person can edit before the run"],
                ["Workspace", "A sandbox with the repo, a shell, an editor, and a browser"],
                ["Tools", "Read, edit, test, and search, as that person"],
                ["Review", "Tests, a diff, and a pull request"],
                ["Record", "The session, kept so it can be replayed"],
              ]}
            />
          </Section>
          <Section eyebrow="Products">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The pieces of a coding platform, and why an enterprise cares.
            </p>
            <Table
              columns={["Product", "What it does", "Why an enterprise cares"]}
              rows={[
                ["Task intake", "Turns a ticket or a message into one job", "Work starts from the tracker the team already uses"],
                ["Planner", "Writes the steps and waits when the task says so", "A person sees the plan before the files change"],
                ["Workspace", "Clones the repo into a sandbox", "The agent does not get the person’s laptop"],
                ["Tools", "Shell, editor, browser, and search", "Every call is as that person, and is stored"],
                ["Review", "Runs tests and opens a pull request", "Nothing merges without a person"],
                ["Replay", "Keeps the session step by step", "A failed run can be read, not guessed at"],
              ]}
            />
          </Section>
        </div>
      ) : null}

      {view === "sources" ? (
        <Section eyebrow="Sources">
          <p className="mt-5 max-w-xl text-base leading-snug text-faint">
            The agent does not start from a blank editor. It reads the repository, the ticket, the
            docs, and the last test run. The file stays where the team keeps it.
          </p>
          <Table
            columns={["Source", "What it holds", "How the agent uses it"]}
            rows={[
              ["Repository", "The branch, the files, and the history", "Reads the code it is allowed to change"],
              ["Ticket", "The job, the acceptance notes, and the comments", "The task is the ticket, not a fresh prompt"],
              ["Docs", "The spec, the wiki, and the decisions already written", "A change follows the note the team maintains"],
              ["CI", "The last failure and the test command", "A red check is part of the task"],
              ["Knowledge", "Notes kept about this codebase", "The next session does not relearn the layout"],
            ]}
          />
        </Section>
      ) : null}

      {view === "platform" ? (
        <Section eyebrow="Platform">
          <p className="mt-5 max-w-xl text-base leading-snug text-faint">
            One task is one session. The session gets a sandbox, the person’s permissions, and a
            record. Several sessions can run. They do not share a machine.
          </p>
          <Table
            columns={["Piece", "What it is", "The rule"]}
            rows={[
              ["Session", "One run of one task", "It can wait, restart, and be replayed"],
              ["Sandbox", "The machine the tools run on", "Shell, editor, and browser stay inside it"],
              ["Identity", "The person who started the task", "Tools act with that person’s access"],
              ["Secrets", "Tokens for the git host and the tracker", "They exist for this session, then they go"],
              ["Parallel", "Several sessions at once", "Each one has its own sandbox and its own branch"],
              ["Audit", "Every tool call and model call", "The company can read what the agent did"],
            ]}
          />
        </Section>
      ) : null}

      {view === "agent" ? (
        <Section eyebrow="Agent">
          <p className="mt-5 max-w-xl text-base leading-snug text-faint">
            The coding agent is a versioned, bounded program for one task. Code fixes the steps.
            A model reasons inside each step, within limits, with the caller’s permissions. It
            returns a change a person can check.
          </p>
          <Table
            columns={["Part", "What it is", "What it is not"]}
            rows={[
              ["Contract", "A task in, a pull request out", "A chat with no artifact"],
              ["Steps", "Read, plan, edit, test, open", "A free loop the model invents"],
              ["Tools", "Shell, editor, browser, and search", "The person’s whole machine"],
              ["Models", "Called through the gateway", "A direct port on the GPU"],
              ["Controls", "A plan check, a token limit, a human review", "A merge the agent makes alone"],
            ]}
          />
        </Section>
      ) : null}

      {view === "review" ? (
        <Section eyebrow="Review">
          <p className="mt-5 max-w-xl text-base leading-snug text-faint">
            The agent proposes. A person accepts. Tests run before the pull request, and the
            session can be read after the fact.
          </p>
          <Table
            columns={["Check", "What happens", "Who decides"]}
            rows={[
              ["Plan", "The steps are shown before files change", "The person can edit or stop them"],
              ["Tests", "The sandbox runs the suite the repo already has", "A red check stays on the session"],
              ["Diff", "The change is a branch, not a silent write", "The person reads the diff"],
              ["Pull request", "The agent opens it and names the ticket", "Review uses the team’s existing rules"],
              ["Replay", "Each tool call and model call is kept", "A later reader can follow the run"],
              ["Merge", "The request waits", "A person merges. The agent does not"],
            ]}
          />
        </Section>
      ) : null}

      {view === "demo" ? (
        enabled ? (
          <CodingAgent enabled initialReady={initialReady} />
        ) : (
          <p className="border border-line bg-surface p-4 text-sm">
            The agent is off. Set <span className="font-mono text-[0.8125rem]">OPENCODE_AGENT=1</span> to turn it on outside development.
          </p>
        )
      ) : null}

      {view === "setup" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <CodingDiagram />
          <Section eyebrow="What moves, and what stays">
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Stays</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The repository, the tickets, the docs, and the secrets. Weights stay on the
                  enterprise’s machines. The session log stays with the run.
                </p>
              </article>
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Moves</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  A branch and a pull request. The person reviews that change. The agent does not
                  merge it, and the company’s code is not used to train a model.
                </p>
              </article>
            </div>
          </Section>
        </div>
      ) : null}
    </div>
  );
}
