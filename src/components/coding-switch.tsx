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
  { id: "implementation", label: "Implementation" },
  { id: "demo", label: "Demo" },
  { id: "setup", label: "Architecture" },
] as const;

type View = (typeof views)[number]["id"];

function isView(value: string | null): value is View {
  return views.some((item) => item.id === value);
}

function CodeCube({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
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

function CodeNode({
  x, y, accent = false, label, label2, sublabel, detail, more, info, example, onShow, onHide, onPress, onSelect,
}: {
  x: number; y: number; accent?: boolean; label: string; label2?: string; sublabel?: string;
  detail?: string; more?: string; info?: string; example?: string;
  onShow?: (e: ReactMouseEvent<SVGGElement>, title: string, info: string, example: string) => void;
  onHide?: () => void;
  onPress?: (e: ReactMouseEvent<SVGGElement>, title: string, info: string, example: string) => void;
  onSelect?: () => void;
}) {
  const cls = `font-mono text-[11px] tracking-tight uppercase ${accent ? "fill-accent" : "fill-foreground"}`;
  const l1y = label2 ? y + 16 : y + 22;
  const nodeLabel = label2 ? `${label} ${label2}` : label;
  const handlers = (info || example) && onShow && onHide && onPress ? {
    className: "cursor-pointer",
    onMouseEnter: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info ?? "", example ?? ""),
    onMouseMove: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info ?? "", example ?? ""),
    onMouseLeave: onHide,
    onClick: (e: ReactMouseEvent<SVGGElement>) => {
      onPress(e, nodeLabel, info ?? "", example ?? "");
      onSelect?.();
    },
  } : {};
  return (
    <g {...handlers}>
      <rect x={x - 70} y={y - 26} width={140} height={label2 ? (more ? 100 : detail ? 86 : 68) : (more ? 90 : detail ? 72 : 56)} fill="transparent" />
      <CodeCube x={x} y={y} accent={accent} />
      <text x={x} y={l1y} textAnchor="middle" className={cls}>{label}</text>
      {label2 ? <text x={x} y={l1y + 13} textAnchor="middle" className={cls}>{label2}</text> : null}
      {sublabel ? <text x={x} y={l1y + (label2 ? 26 : 13)} textAnchor="middle" className="fill-muted font-mono text-[10px]">{sublabel}</text> : null}
      {detail ? <text x={x} y={l1y + (label2 ? 39 : 26)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{detail}</text> : null}
      {more ? <text x={x} y={l1y + (label2 ? 51 : 38)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{more}</text> : null}
    </g>
  );
}

function CodeConnectDiagram() {
  const gateX = 148;
  const c = [300, 448, 596, 744];
  const cY = 202;
  const pY = 374;
  const sY = 540;

  const sectionRef = useRef<HTMLElement>(null);
  const [tip, setTip] = useState<{ title: string; info: string; example: string; x: number; y: number } | null>(null);
  const [route, setRoute] = useState<string | null>(null);
  const [tips, setTips] = useState(false);
  const [examples, setExamples] = useState(false);

  function choose(id: string) {
    setRoute((current) => (current === id ? null : id));
  }

  function pick(owners: string[]) {
    const on = route !== null && owners.includes(route);
    return { stroke: on ? "#FF5C00" : "#b5b2b0", strokeWidth: on ? 1.8 : 1.2 };
  }

  function coarsePointer() {
    return window.matchMedia("(hover: none)").matches;
  }

  function placeTip(event: { clientX: number; clientY: number }, title: string, info: string, example: string) {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    const width = 288;
    const height = 320;
    let x = event.clientX - bounds.left + 14;
    let y = event.clientY - bounds.top + 18;
    if (x + width > bounds.width - 8) x = event.clientX - bounds.left - width - 10;
    if (y + height > bounds.height - 8) y = event.clientY - bounds.top - height - 10;
    return {
      title,
      info: tips ? info : "",
      example: examples ? example : "",
      x: Math.max(8, x),
      y: Math.max(8, y),
    };
  }

  function showTip(event: { clientX: number; clientY: number }, title: string, info: string, example: string) {
    if (coarsePointer() || (!tips && !examples)) return;
    const next = placeTip(event, title, info, example);
    if (next && (next.info || next.example)) setTip(next);
  }

  function pressTip(event: ReactMouseEvent<SVGElement>, title: string, info: string, example: string) {
    event.stopPropagation();
    if (!coarsePointer() || (!tips && !examples)) return;
    const next = placeTip(event, title, info, example);
    if (!next || (!next.info && !next.example)) return;
    setTip((current) => (current?.title === title ? null : next));
  }

  function hideTip() {
    if (coarsePointer()) return;
    setTip(null);
  }

  const node = { onShow: showTip, onHide: hideTip, onPress: pressTip };

  return (
    <section ref={sectionRef} className="relative border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        How it connects
      </p>
      <div className="mt-6 max-w-full min-w-0 overflow-x-auto">
        <svg
          viewBox="0 0 1120 640"
          className="block h-auto w-full min-w-[48rem]"
          role="img"
          aria-label="The agent is the program you opened in the IDE. It runs in that window, on your machine, in the folder already open. You type a task, it plans and edits there, and the diff stays in the editor until you accept it."
        >
          <rect x="90" y="152" width="722" height="136" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="324" width="722" height="132" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="492" width="722" height="124" fill="#f4f3f2" stroke="#d6d3d2" />

          <text x="5" y="66" className="fill-foreground font-mono text-[11px] uppercase">ACCESS</text>
          <text x="5" y="81" className="fill-muted font-mono text-[10px]">Users, tools</text>
          <line x1="5" y1="96" x2="82" y2="96" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="187" className="fill-foreground font-mono text-[11px] uppercase">CONTROL</text>
          <text x="5" y="202" className="fill-muted font-mono text-[10px]">Run on</text>
          <text x="5" y="215" className="fill-muted font-mono text-[10px]">your machines</text>
          <line x1="5" y1="276" x2="82" y2="276" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="359" className="fill-foreground font-mono text-[11px] uppercase">COMPUTE</text>
          <text x="5" y="374" className="fill-muted font-mono text-[10px]">In the</text>
          <text x="5" y="387" className="fill-muted font-mono text-[10px]">editor</text>
          <line x1="5" y1="444" x2="82" y2="444" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="526" className="fill-foreground font-mono text-[11px] uppercase">STORAGE</text>
          <text x="5" y="541" className="fill-muted font-mono text-[10px]">The files</text>
          <text x="5" y="554" className="fill-muted font-mono text-[10px]">you have open</text>
          <line x1="5" y1="604" x2="82" y2="604" stroke="#d6d3d2" strokeWidth="0.8" />

          {c.map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy="128" r="9" fill="#101010" />
              <text x={cx} y="132" textAnchor="middle" fill="white" fontSize="11" className="font-mono">{i + 1}</text>
            </g>
          ))}

          {[c[0], c[3]].map((cx) => (
            <g key={cx} fill="none" stroke="#101010" strokeWidth="1.2" transform={`translate(${cx} 44)`}>
              <circle cx="0" cy="0" r="6" />
              <path d="M-9 18c1.5-6 4.5-9 9-9s7.5 3 9 9" />
            </g>
          ))}
          {[c[1], c[2]].map((cx) => (
            <g key={cx} fill="none" stroke="#101010" strokeWidth="1.2" transform={`translate(${cx} 44)`}>
              <rect x="-10" y="-8" width="20" height="14" />
              <path d="M0 6v5M-6 11h12" />
            </g>
          ))}

          {([
            [c[0], "YOU", "IN THE IDE"],
            [c[1], "AGENT", "PLAN"],
            [c[2], "AGENT", "EDIT"],
            [c[3], "YOU", "THE DIFF"],
          ] as [number, string, string][]).map(([cx, l1, l2]) => (
            <g key={cx}>
              <text x={cx} y="84" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l1}</text>
              <text x={cx} y="98" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l2}</text>
            </g>
          ))}
          {([
            {
              id: "ide",
              title: "You in the IDE",
              info: "You open the agent inside the editor and type the task. The files already open stay the files it works on.",
              example: "In VS Code you type: change this function so the empty case returns early.",
            },
            {
              id: "plan",
              title: "The plan",
              info: "The agent reads the open files and writes the steps. You can stop it before a file changes.",
              example: "It names the function, the test it will run, and waits.",
            },
            {
              id: "edit",
              title: "The edit",
              info: "It changes the code in the workspace and runs the check from the terminal.",
              example: "It edits the function, runs the test, and the red check stays in the session.",
            },
            {
              id: "diff",
              title: "The diff",
              info: "The change appears in the editor. Nothing is saved as the new code until you accept it.",
              example: "You keep the edit. The file on disk updates. Rejecting it leaves the file as it was.",
            },
          ] as const).map((item, i) => (
            <rect
              key={item.id}
              x={c[i] - 62}
              y={24}
              width={124}
              height={114}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={(e) => showTip(e, item.title, item.info, item.example)}
              onMouseMove={(e) => showTip(e, item.title, item.info, item.example)}
              onMouseLeave={hideTip}
              onClick={(e) => {
                pressTip(e, item.title, item.info, item.example);
                choose(item.id);
              }}
            />
          ))}

          <g fill="none" strokeDasharray="4 3">
            <line x1={c[0]} y1="138" x2={c[0]} y2={cY - 22} {...pick(["ide", "task", "read", "gateway"])} />
            <line x1={c[1]} y1="138" x2={c[1]} y2={cY - 22} {...pick(["plan", "steps", "model", "gateway"])} />
            <line x1={c[2]} y1="138" x2={c[2]} y2={cY - 22} {...pick(["edit", "apply", "check", "gateway"])} />
            <line x1={c[3]} y1="138" x2={c[3]} y2={cY - 22} {...pick(["diff", "accept", "files", "gateway"])} />
            <line x1={c[0]} y1="278" x2={c[0]} y2={pY - 22} {...pick(["ide", "task", "read", "workspace", "gateway"])} />
            <line x1={c[0]} y1="448" x2={c[0]} y2={sY - 22} {...pick(["ide", "task", "read", "workspace", "gateway"])} />
            <line x1={c[1]} y1="278" x2={c[1]} y2={pY - 22} {...pick(["plan", "steps", "model", "workspace", "gateway"])} />
            <line x1={c[1]} y1="448" x2={c[1]} y2="478" {...pick(["plan", "steps", "model", "workspace", "gateway"])} />
            <line x1={c[2]} y1="278" x2={c[2]} y2={pY - 22} {...pick(["edit", "apply", "check", "log", "workspace", "gateway"])} />
            <line x1={c[2]} y1="448" x2={c[2]} y2={sY - 22} {...pick(["edit", "apply", "check", "log", "gateway"])} />
            <line x1={c[3]} y1="278" x2={c[3]} y2={sY - 22} {...pick(["diff", "accept", "files", "workspace", "gateway"])} />
            <line x1={c[3]} y1="478" x2={c[2]} y2="478" {...pick(["diff", "accept", "files", "workspace", "gateway"])} />
            <line x1={c[2]} y1="478" x2={c[1]} y2="478" {...pick(["edit", "apply", "check", "diff", "accept", "files", "workspace", "gateway"])} />
            <line x1={c[1]} y1="478" x2={c[0]} y2="478" {...pick(["plan", "steps", "model", "edit", "apply", "check", "diff", "accept", "files", "workspace", "gateway"])} />
          </g>

          <CodeNode x={gateX} y={cY} accent label="GATEWAY" label2="CHECK"
            detail="who and budget"
            more="before a file opens"
            info={"The task hits the gateway first. It checks the person, the policy, and the budget.\n\nThe editor does not call a model on its own. That call goes through the gateway, then the model proxy."}
            example="You are signed in. The gateway allows the task. A person without access to the folder never gets a plan."
            onSelect={() => choose("gateway")}
            {...node} />
          <CodeNode x={c[0]} y={cY} label="TASK" label2="WORDS"
            detail="what you typed"
            more="change the code"
            info={"The task is the sentence in the IDE. It names the change. It does not name a new repository.\n\nThe files already open are the files the agent is allowed to read."}
            example="You type: change this function so the empty case returns early."
            onSelect={() => choose("task")}
            {...node} />
          <CodeNode x={c[1]} y={cY} label="PLAN" label2="STEPS"
            detail="what it will touch"
            more="you can stop it"
            info={"The agent writes the steps before it edits: which file, which function, which check.\n\nYou can edit the plan or stop the run. A file it did not name stays closed."}
            example="The plan says: read the function, change the empty case, run the test. You remove the test. It does not run."
            onSelect={() => choose("steps")}
            {...node} />
          <CodeNode x={c[2]} y={cY} label="EDIT" label2="APPLY"
            detail="in the open folder"
            more="not a second repo"
            info={"The agent edits the file in the workspace you already have open. It uses the terminal in that same editor.\n\nIt does not clone the project somewhere else, and it does not commit."}
            example="The function changes in the buffer. The terminal runs the test. The file on disk is still the old one."
            onSelect={() => choose("apply")}
            {...node} />
          <CodeNode x={c[3]} y={cY} label="DIFF" label2="ACCEPT"
            detail="shown in the IDE"
            more="you keep or reject"
            info={"The change is a diff in the editor. Accept writes it. Reject throws it away.\n\nThe agent does not save over the file, and it does not push."}
            example="You accept. The file updates. Rejecting leaves the function as it was when you typed the task."
            onSelect={() => choose("accept")}
            {...node} />

          <CodeNode x={c[0]} y={pY} label="READ" label2="FILES"
            detail="what is open"
            more="nothing else"
            info={"The agent reads the files in the workspace, and the ones the plan names.\n\nA file outside that folder is not opened. The model sees the passages the read step returned."}
            example="It reads the function you pointed at, and the test file next to it. It does not open the rest of the disk."
            onSelect={() => choose("read")}
            {...node} />
          <CodeNode x={c[1]} y={pY} label="MODEL" label2="CALL"
            detail="through the proxy"
            more="this task only"
            info={"The model decides how to read the code, which edit to try, and when it has enough.\n\nThe call goes through the model proxy. The editor does not open a port on the GPU. Your code is not used to train the model."}
            example="The model proposes the early return. The weights stay on the enterprise’s machines."
            onSelect={() => choose("model")}
            {...node} />
          <CodeNode x={c[2]} y={pY} label="CHECK" label2="TERMINAL"
            detail="the command you use"
            more="a red check stays"
            info={"The terminal runs the check the project already has. The agent does not invent a new definition of done.\n\nA failure stays on the session, next to the diff."}
            example="The test fails on the empty case. The diff still appears, with that failure named."
            onSelect={() => choose("check")}
            {...node} />

          <CodeNode x={c[0]} y={sY} label="WORKSPACE" label2="FOLDER"
            sublabel="the files you opened"
            detail="stays in the IDE"
            more="not copied out"
            info={"The folder open in the editor is the place the agent reads and the place the diff is about.\n\nThe files are not uploaded as a second copy. The plan, the edit, and the diff all point back here."}
            example="VS Code has the project open. The agent works in that window. Closing the task does not move the folder."
            onSelect={() => choose("workspace")}
            {...node} />
          <CodeNode x={c[2]} y={sY} label="SESSION" label2="LOG"
            detail="each step"
            more="replay, not a copy"
            info={"The log keeps the task, the plan, each edit, and each model call. You can read a run that went wrong.\n\nIt is not a second copy of the folder."}
            example="You open the log and see the test command and the red check, in order."
            onSelect={() => choose("log")}
            {...node} />
          <CodeNode x={c[3]} y={sY} label="FILES" label2="ON DISK"
            sublabel="after you accept"
            detail="the saved change"
            more="reject leaves them"
            info={"Accept writes the diff into the files. Reject does not.\n\nA commit and a push are still yours. The agent stops at the diff."}
            example="You accept. The function on disk has the early return. You commit when you are ready."
            onSelect={() => choose("files")}
            {...node} />

          <text x="845" y="166" className="fill-muted font-mono text-[11px] uppercase">HOW TO READ IT</text>
          {([
            { y: 192, lines: ["The agent is the program", "in the IDE. Code fixes", "its steps. You type the task."] },
            { y: 260, lines: ["It runs in that window,", "on your machine, in the", "folder you have open."] },
            { y: 328, lines: ["Plan and edit stay there.", "Only the model call leaves,", "through the gateway,", "on your machines."] },
            { y: 410, lines: ["The diff stays in the IDE.", "Accept writes the file.", "The agent does not push."] },
          ] as { y: number; lines: string[] }[]).map((item, i) => (
            <g key={item.y}>
              <circle cx="855" cy={item.y} r="9" fill="#101010" />
              <text x="855" y={item.y + 4} textAnchor="middle" fill="white" className="font-mono text-[11px]">{i + 1}</text>
              {item.lines.map((line, j) => (
                <text key={j} x="870" y={item.y + (j * 14) + 4} className="fill-faint font-mono text-[11px]">{line}</text>
              ))}
            </g>
          ))}
          <g
            role="switch"
            aria-checked={tips}
            aria-label="Show hover details"
            className="cursor-pointer"
            onClick={() => {
              setTips((open) => !open);
              setTip(null);
            }}
          >
            <rect x="845" y="500" width="34" height="16" rx="8" fill={tips ? "#101010" : "#f4f3f2"} stroke="#101010" />
            <circle cx={tips ? 870 : 854} cy="508" r="5" fill={tips ? "#ffffff" : "#101010"} />
            <text x="889" y="512" className="fill-muted font-mono text-[11px] uppercase">Info</text>
          </g>
          <g
            role="switch"
            aria-checked={examples}
            aria-label="Show hover examples"
            className="cursor-pointer"
            onClick={() => {
              setExamples((open) => !open);
              setTip(null);
            }}
          >
            <rect x="960" y="500" width="34" height="16" rx="8" fill={examples ? "#101010" : "#f4f3f2"} stroke="#101010" />
            <circle cx={examples ? 985 : 969} cy="508" r="5" fill={examples ? "#ffffff" : "#101010"} />
            <text x="1004" y="512" className="fill-muted font-mono text-[11px] uppercase">Example</text>
          </g>
        </svg>
      </div>
      {tip ? (
        <div
          className="pointer-events-none absolute z-10 w-72 border border-line bg-surface px-4 py-3 shadow-sm"
          style={{ left: tip.x, top: tip.y }}
        >
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{tip.title}</p>
          {tip.info.split("\n\n").filter(Boolean).map((para) => (
            <p key={para} className="mt-2 text-sm leading-snug text-faint first:mt-1">{para}</p>
          ))}
          {tip.example ? (
            <>
              {tip.info ? (
                <p className="mt-3 font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">Example</p>
              ) : null}
              <p className="mt-1 text-sm leading-snug text-faint">{tip.example}</p>
            </>
          ) : null}
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
            The agent is the program you open in the IDE. It runs in that window, on your machine,
            in the folder already open. Code fixes the steps. A model reasons inside each step,
            through the gateway, on your machines. The diff stays in the editor until you accept it.
          </p>
          <Table
            columns={["Part", "What it is", "What it is not"]}
            rows={[
              ["The agent", "The program in the IDE for one task", "A person, or a second computer"],
              ["Where it runs", "That window, on your machine, in the open folder", "A clone on another host"],
              ["Steps", "Read, plan, edit, check", "A free loop the model invents"],
              ["The model", "Called through the gateway, on your machines", "A GPU inside the editor"],
              ["The result", "A diff you accept in the IDE", "A commit or a push the agent makes"],
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

      {view === "implementation" ? (
        <Section eyebrow="Implementation">
          <p className="mt-5 max-w-xl text-base leading-snug text-faint">
            Use OpenCode as the runtime in the IDE, and send the model call to OpenRouter.
          </p>
          <Table
            columns={["Step", "What you do", "What it connects"]}
            rows={[
              ["1. The runtime", "Use the OpenCode runtime. The extension is a branded package around it, under its own publisher.", "VS Code stays the editor. OpenCode owns the session."],
              ["2. The license", "Ship the MIT license and the notices OpenCode requires, including bundled dependencies and assets.", "The package can carry its own name on the Marketplace."],
              ["3. The IDE", "Add OpenCode as a terminal command or a sidebar. The OpenCode CLI is the dependency either way.", "The person types the task in the window already open."],
              ["4. The session", "OpenCode opens one session in that folder, on the build agent. Allow edit. Refuse shell until the program allows it.", "Code answers permissions. The model does not."],
              ["5. OpenRouter", "Set the OpenCode provider to OpenRouter. Pick a model id it publishes, such as openai/gpt-4.1.", "The editor does not open a port on the GPU."],
              ["6. Sign-in", "The person signs in with the enterprise account. Keep OPENROUTER_API_KEY on the machine that runs OpenCode.", "The key goes to OpenRouter only, as a bearer token."],
              ["7. Ship", "Publish the extension to the VS Code Marketplace and Open VSX. Install and update the OpenCode CLI with it.", "Cursor and Windsurf are checked on their own."],
              ["8. The diff", "OpenCode edits the open files and streams text, tool, status, and error events back. Accept writes the file. Reject leaves it.", "OpenCode does not commit or push."],
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
          <CodeConnectDiagram />
          <Section eyebrow="What moves, and what stays">
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Stays</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The agent, in the IDE on your machine. The open folder. The files, until you
                  accept the diff. Weights stay on your machines. The session log stays with the run.
                </p>
              </article>
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Moves</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The model call, through the gateway. The diff, into the open files, after you
                  accept it. The agent does not commit or push, and the code is not used to train a model.
                </p>
              </article>
            </div>
          </Section>
        </div>
      ) : null}
    </div>
  );
}
