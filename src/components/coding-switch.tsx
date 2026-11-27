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
  x, y, accent = false, mark = "idle", label, label2, sublabel, detail, more, info, example, onShow, onHide, onPress, onSelect,
}: {
  x: number; y: number; accent?: boolean; mark?: "idle" | "on" | "off"; label: string; label2?: string; sublabel?: string;
  detail?: string; more?: string; info?: string; example?: string;
  onShow?: (e: ReactMouseEvent<SVGGElement>, title: string, info: string, example: string) => void;
  onHide?: () => void;
  onPress?: (e: ReactMouseEvent<SVGGElement>, title: string, info: string, example: string) => void;
  onSelect?: () => void;
}) {
  const lit = mark === "on" || (mark !== "off" && accent);
  const cls = `font-mono text-[11px] tracking-tight uppercase ${accent && mark !== "off" ? "fill-accent" : "fill-foreground"}`;
  const l1y = label2 ? y + 16 : y + 22;
  const nodeLabel = label2 ? `${label} ${label2}` : label;
  const handlers = (info || example) && onShow && onHide && onPress ? {
    className: "cursor-pointer",
    onMouseEnter: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info ?? "", example ?? ""),
    onMouseMove: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info ?? "", example ?? ""),
    onMouseLeave: onHide,
    onClick: (e: ReactMouseEvent<SVGGElement>) => {
      e.stopPropagation();
      onPress(e, nodeLabel, info ?? "", example ?? "");
      onSelect?.();
    },
  } : {};
  return (
    <g opacity={mark === "off" ? 0.28 : 1} {...handlers}>
      <rect x={x - 70} y={y - 26} width={140} height={label2 ? (more ? 100 : detail ? 86 : 68) : (more ? 90 : detail ? 72 : 56)} fill="transparent" />
      <CodeCube x={x} y={y} accent={lit} />
      <text x={x} y={l1y} textAnchor="middle" className={cls}>{label}</text>
      {label2 ? <text x={x} y={l1y + 13} textAnchor="middle" className={cls}>{label2}</text> : null}
      {sublabel ? <text x={x} y={l1y + (label2 ? 26 : 13)} textAnchor="middle" className="fill-muted font-mono text-[10px]">{sublabel}</text> : null}
      {detail ? <text x={x} y={l1y + (label2 ? 39 : 26)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{detail}</text> : null}
      {more ? <text x={x} y={l1y + (label2 ? 51 : 38)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{more}</text> : null}
    </g>
  );
}

const runLinks: Record<string, string[]> = {
  ide: ["chat", "server"],
  chat: ["ide", "server"],
  server: ["ide", "chat", "trace", "cache", "loop", "index", "model"],
  trace: ["server"],
  sync: ["index"],
  tools: ["loop"],
  loop: ["server", "tools", "index"],
  cache: ["server"],
  index: ["server", "loop", "sync"],
  model: ["server"],
};

const runEdgeEnds: Record<string, string[]> = {
  "ide-chat": ["ide", "chat"],
  "chat-server": ["chat", "server"],
  "ide-server": ["ide", "server"],
  "server-trace": ["server", "trace"],
  "server-cache": ["server", "cache"],
  "server-loop": ["server", "loop"],
  "server-index": ["server", "index"],
  "loop-tools": ["loop", "tools"],
  "loop-index": ["loop", "index"],
  "sync-index": ["sync", "index"],
  "server-model": ["server", "model"],
};

type RunPick = { kind: "node"; id: string } | { kind: "edge"; id: string } | null;

function runActive(id: string) {
  return new Set([id, ...(runLinks[id] ?? [])]);
}

function runMark(picked: RunPick, id: string): "idle" | "on" | "off" {
  if (!picked) return "idle";
  if (picked.kind === "edge") return (runEdgeEnds[picked.id] ?? []).includes(id) ? "on" : "off";
  return runActive(picked.id).has(id) ? "on" : "off";
}

function runEdgeOn(picked: RunPick, edgeId: string) {
  if (!picked) return false;
  if (picked.kind === "edge") return picked.id === edgeId;
  const ends = runEdgeEnds[edgeId] ?? [];
  if (!ends.includes(picked.id)) return false;
  const active = runActive(picked.id);
  return ends.every((end) => active.has(end));
}

function runStroke(picked: RunPick, on: boolean, idle: string, width: number) {
  if (!picked) return { stroke: idle, strokeWidth: width };
  if (on) return { stroke: "#FF5C00", strokeWidth: Math.max(width, 1.8) };
  return { stroke: "#e4e1df", strokeWidth: width };
}

function RunLink({
  id, d, picked, onPick, idle, width, dashed = false,
}: {
  id: string; d: string; picked: RunPick; onPick: (id: string) => void; idle: string; width: number; dashed?: boolean;
}) {
  const paint = runStroke(picked, runEdgeOn(picked, id), idle, width);
  return (
    <g
      className="cursor-pointer"
      onClick={(event) => {
        event.stopPropagation();
        onPick(id);
      }}
    >
      <path d={d} fill="none" stroke="transparent" strokeWidth={14} pointerEvents="stroke" />
      <path d={d} fill="none" pointerEvents="none" strokeDasharray={dashed ? "5 4" : undefined} {...paint} />
    </g>
  );
}

function CursorRunDiagram() {
  const col = [170, 360, 554, 744];
  const ide = { x: col[0], y: 118 };
  const chat = { x: col[1], y: 118 };
  const server = { x: col[2], y: 118 };
  const trace = { x: col[3], y: 118 };
  const sync = { x: col[0], y: 212 };
  const tools = { x: col[1], y: 212 };
  const loop = { x: col[2], y: 212 };
  const cache = { x: col[3], y: 212 };
  const index = { x: (col[0] + col[1]) / 2, y: 306 };
  const model = { x: col[2], y: 306 };
  const sectionRef = useRef<HTMLElement>(null);
  const [tip, setTip] = useState<{ title: string; info: string; example: string; x: number; y: number } | null>(null);
  const [tips, setTips] = useState(false);
  const [examples, setExamples] = useState(false);
  const [picked, setPicked] = useState<RunPick>(null);

  function pick(id: string) {
    setPicked((current) => (current?.kind === "node" && current.id === id ? null : { kind: "node", id }));
  }

  function pickEdge(id: string) {
    setPicked((current) => (current?.kind === "edge" && current.id === id ? null : { kind: "edge", id }));
  }

  function mark(id: string) {
    return runMark(picked, id);
  }

  function coarsePointer() {
    return window.matchMedia("(hover: none)").matches;
  }

  function placeTip(event: { clientX: number; clientY: number }, title: string, info: string, example: string) {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    const width = 288;
    const height = 220;
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

  function pressTip(event: ReactMouseEvent<SVGGElement>, title: string, info: string, example: string) {
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
        How Cursor runs
      </p>
      <div className="mt-6 max-w-full min-w-0 overflow-x-auto">
        <svg
          onClick={() => {
            if (coarsePointer()) setTip(null);
            setPicked(null);
          }}
          viewBox="0 0 860 448"
          className="block h-auto w-full min-w-[40rem]"
          role="img"
          aria-label="How Cursor runs. The IDE and the chat stay on this machine. Every request goes to Cursor’s server, which builds the prompt. The agent loop calls tools locally. The index keeps the path and the lines. The chat log is the trace of the run. The model call leaves through that server."
        >
          <rect x="76" y="64" width="760" height="326" fill="#f4f3f2" stroke="#d6d3d2" />

          <RunLink id="ide-chat" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${ide.x + 12},${ide.y - 14} L${chat.x - 12},${chat.y - 14}`} />
          <RunLink id="chat-server" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${chat.x + 12},${chat.y - 14} L${server.x - 12},${server.y - 14}`} />
          <RunLink id="ide-server" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${ide.x},${ide.y - 22} C ${chat.x},${ide.y - 64} ${chat.x},${server.y - 64} ${server.x},${server.y - 22}`} />
          <RunLink id="server-trace" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${server.x + 12},${server.y - 14} L${trace.x - 12},${trace.y - 14}`} />
          <RunLink id="server-cache" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${server.x + 8},${server.y + 2} L${cache.x - 8},${cache.y - 18}`} />
          <RunLink id="server-loop" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${server.x},${server.y + 4} L${loop.x},${loop.y - 20}`} />
          <RunLink id="server-index" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${server.x - 10},${server.y + 2} L${index.x + 8},${index.y - 20}`} />
          <RunLink id="loop-tools" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${loop.x - 12},${loop.y - 10} L${tools.x + 12},${tools.y - 10}`} />
          <RunLink id="loop-index" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${loop.x - 8},${loop.y + 2} L${index.x + 10},${index.y - 18}`} />
          <RunLink id="sync-index" picked={picked} onPick={pickEdge} idle="#c8c4c2" width={1.25} dashed d={`M${sync.x + 6},${sync.y + 4} L${index.x - 8},${index.y - 18}`} />
          <RunLink id="server-model" picked={picked} onPick={pickEdge} idle="#FF5C00" width={1.6} d={`M${server.x + 14},${server.y - 8} C ${server.x + 150},${server.y + 24} ${model.x + 150},${model.y - 80} ${model.x + 12},${model.y - 18}`} />

          <CodeNode x={ide.x} y={ide.y} mark={mark("ide")} label="IDE" detail="this machine" more="read, edit, shell"
            info="You type the task here. Read, edit, search, and the terminal run in the IDE, on your machine."
            example="A developer types the order status task in the IDE. Search, read, and edit of the schema, the API handler, and the page all run in that window, on this machine, in the folder already open."
            onSelect={() => pick("ide")}
            {...node} />
          <CodeNode x={chat.x} y={chat.y} mark={mark("chat")} label="CHAT" detail="this thread" more="previous turns"
            info="This thread holds the previous turns. The next request sends that thread with the task."
            example="The thread already holds the schema read and the migration edit. The next turn sends that thread, so the API step starts from the order status work already done."
            onSelect={() => pick("chat")}
            {...node} />
          <CodeNode x={server.x} y={server.y} mark={mark("server")} accent label="SERVER" detail="every request" more="builds the prompt"
            info="Every request goes to Cursor’s server over HTTPS, including one that uses your own key. The server builds the prompt and calls the model."
            example="Each step of the order status task goes to Cursor’s server. The server builds the prompt from the task, the thread, and the tool results for the schema, the API, and the page, then calls the model."
            onSelect={() => pick("server")}
            {...node} />
          <CodeNode x={trace.x} y={trace.y} mark={mark("trace")} label="TRACE" detail="the chat log" more="on this machine"
            info="The chat log on this machine is the trace of the run: the task, each tool call, and each model turn."
            example="The chat log on this machine keeps the trace: the order status task, the search of the schema, the edit of the migration, the edit of the API, the edit of the page, and each model turn."
            onSelect={() => pick("trace")}
            {...node} />
          <CodeNode x={sync.x} y={sync.y} mark={mark("sync")} label="SYNC" detail="changed files" more="a hash per file"
            info="Cursor hashes the file tree. A changed file is chunked and embedded again. An unchanged chunk keeps the embedding it already has."
            example="After the order status edits, sync hashes the tree again. The migration, the API handler, and the page are chunked and embedded. Every other file keeps the embedding it already has."
            onSelect={() => pick("sync")}
            {...node} />
          <CodeNode x={tools.x} y={tools.y} mark={mark("tools")} label="TOOLS" detail="run in the IDE" more="read, edit, search"
            info="The agent asks for a tool, and the IDE runs it. Read, edit, and search stay on your machine."
            example="A developer asks for an order status stored in the database, returned by the API, and shown on the page. The loop calls search, then read, on the schema. The IDE returns the table. It then calls edit on the migration, the API handler, and the page. Each edit runs in the open folder, and the result is sent back before the next call."
            onSelect={() => pick("tools")}
            {...node} />
          <CodeNode x={loop.x} y={loop.y} mark={mark("loop")} label="LOOP" detail="one step" more="then the result"
            info="The loop takes one step, waits for the tool result, then asks the model again. You can stop the run before a file changes."
            example="A developer asks to add an order status that is stored in the database, returned by the API, and shown in the front end. The loop searches for the schema, reads it, and waits. The next step edits the migration. The step after that reads the API handler and edits the response. The last step edits the page that renders the status. You stop it after the API edit, and the front end file stays as it was."
            onSelect={() => pick("loop")}
            {...node} />
          <CodeNode x={cache.x} y={cache.y} mark={mark("cache")} label="CACHE" detail="this request" more="encrypted"
            info="File text can be cached encrypted for that request. The cache lasts only as long as the request."
            example="While the order status request is open, the text of the schema, the API handler, and the page can be cached encrypted for that request. The cache ends when the request ends."
            onSelect={() => pick("cache")}
            {...node} />
          <CodeNode x={index.x} y={index.y} mark={mark("index")} label="INDEX" detail="embeddings" more="path and lines"
            info="The index stores embeddings with the path and the line range. The source text stays in the repo. A later search returns the path and the lines, and the IDE reads the file when the text is needed."
            example="A developer asks for an order status in the database, the API, and the front end. The index finds the schema, the API handler, and the page from their embeddings. Each hit is a path and a line range. The source text stays in the repo. The IDE then reads those three files at the lines the index named."
            onSelect={() => pick("index")}
            {...node} />
          <CodeNode x={model.x} y={model.y} mark={mark("model")} accent label="MODEL" detail="the only call" more="out of the IDE"
            info="The model call leaves the IDE only through Cursor’s server. The reply streams back into the same window."
            example="The model call leaves the IDE only through Cursor’s server. It names the migration edit, then the API edit, then the page edit. Each reply streams back into the same window."
            onSelect={() => pick("model")}
            {...node} />

          <g
            role="switch"
            aria-checked={tips}
            aria-label="Show hover details"
            className="cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              setTips((open) => !open);
              setTip(null);
            }}
          >
            <rect x="76" y="416" width="34" height="16" rx="8" fill={tips ? "#101010" : "#f4f3f2"} stroke="#101010" />
            <circle cx={tips ? 101 : 85} cy="424" r="5" fill={tips ? "#ffffff" : "#101010"} />
            <text x="118" y="428" className="fill-muted font-mono text-[11px] uppercase">Info</text>
          </g>
          <g
            role="switch"
            aria-checked={examples}
            aria-label="Show hover examples"
            className="cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              setExamples((open) => !open);
              setTip(null);
            }}
          >
            <rect x="178" y="416" width="34" height="16" rx="8" fill={examples ? "#101010" : "#f4f3f2"} stroke="#101010" />
            <circle cx={examples ? 203 : 187} cy="424" r="5" fill={examples ? "#ffffff" : "#101010"} />
            <text x="220" y="428" className="fill-muted font-mono text-[11px] uppercase">Example</text>
          </g>
        </svg>
      </div>
      {tip ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-20 w-72 border border-line bg-surface px-4 py-3 shadow-sm"
          style={{ left: tip.x, top: tip.y }}
        >
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{tip.title}</p>
          {tip.info ? <p className="mt-1 text-sm leading-snug text-faint">{tip.info}</p> : null}
          {tip.example ? (
            <>
              {tip.info ? <p className="mt-3 font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">Example</p> : null}
              <p className="mt-1 text-sm leading-snug text-faint">{tip.example}</p>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
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
          aria-label="How Cursor is organized. Tools run in the IDE. Each request goes to Cursor’s server, which builds the prompt and calls the model. The repo index keeps embeddings, paths, and line numbers. Previous requests stay in the chat on this machine."
        >
          <rect x="90" y="152" width="722" height="136" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="324" width="722" height="132" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="492" width="722" height="124" fill="#f4f3f2" stroke="#d6d3d2" />

          <text x="5" y="66" className="fill-foreground font-mono text-[11px] uppercase">ACCESS</text>
          <text x="5" y="81" className="fill-muted font-mono text-[10px]">You, the IDE</text>
          <line x1="5" y1="96" x2="82" y2="96" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="187" className="fill-foreground font-mono text-[11px] uppercase">CONTROL</text>
          <text x="5" y="202" className="fill-muted font-mono text-[10px]">The request</text>
          <text x="5" y="215" className="fill-muted font-mono text-[10px]">and the tools</text>
          <line x1="5" y1="276" x2="82" y2="276" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="359" className="fill-foreground font-mono text-[11px] uppercase">COMPUTE</text>
          <text x="5" y="374" className="fill-muted font-mono text-[10px]">Search and</text>
          <text x="5" y="387" className="fill-muted font-mono text-[10px]">the model</text>
          <line x1="5" y1="444" x2="82" y2="444" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="526" className="fill-foreground font-mono text-[11px] uppercase">STORAGE</text>
          <text x="5" y="541" className="fill-muted font-mono text-[10px]">What is</text>
          <text x="5" y="554" className="fill-muted font-mono text-[10px]">kept</text>
          <line x1="5" y1="604" x2="82" y2="604" stroke="#d6d3d2" strokeWidth="0.8" />

          {c.map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy="128" r="9" fill="#101010" />
              <text x={cx} y="132" textAnchor="middle" fill="white" fontSize="11" className="font-mono">{i + 1}</text>
            </g>
          ))}

          {[c[0]].map((cx) => (
            <g key={cx} fill="none" stroke="#101010" strokeWidth="1.2" transform={`translate(${cx} 44)`}>
              <circle cx="0" cy="0" r="6" />
              <path d="M-9 18c1.5-6 4.5-9 9-9s7.5 3 9 9" />
            </g>
          ))}
          {[c[1], c[2], c[3]].map((cx) => (
            <g key={cx} fill="none" stroke="#101010" strokeWidth="1.2" transform={`translate(${cx} 44)`}>
              <rect x="-10" y="-8" width="20" height="14" />
              <path d="M0 6v5M-6 11h12" />
            </g>
          ))}

          {([
            [c[0], "YOU", "IN CURSOR"],
            [c[1], "AGENT", "LOOP"],
            [c[2], "INDEX", "REPO"],
            [c[3], "CHAT", "HISTORY"],
          ] as [number, string, string][]).map(([cx, l1, l2]) => (
            <g key={cx}>
              <text x={cx} y="84" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l1}</text>
              <text x={cx} y="98" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l2}</text>
            </g>
          ))}
          {([
            {
              id: "ide",
              title: "You in Cursor",
              info: "You type the task in Cursor. Read, edit, search, and the terminal run in that IDE, on your machine.",
              example: "You ask it to change a function. The file it opens is the file in the folder you already have open.",
            },
            {
              id: "plan",
              title: "The agent loop",
              info: "The agent takes one step, asks for a tool, waits for the result, then asks the model again. You can stop it before a file changes.",
              example: "It reads the function, then asks to edit it. You stop the run. The file stays as it was.",
            },
            {
              id: "edit",
              title: "The repo index",
              info: "Cursor chunks the repo and embeds the chunks. The index keeps the path and the line range. The source text is not stored in the index.",
              example: "A later question finds the same function from the index, without reading every file again.",
            },
            {
              id: "diff",
              title: "Chat history",
              info: "Previous requests in this project stay on this machine. The next turn sends that thread, so the model can see what already happened.",
              example: "You ask a follow-up. The earlier read and the earlier edit are already in the thread.",
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

          <CodeNode x={gateX} y={cY} accent label="SERVER" label2="BUILD"
            detail="prompt and model"
            more="every request"
            info={"Every request goes to Cursor’s server over HTTPS, including a request that uses your own key. The server builds the prompt and calls the model.\n\nFile text can be cached encrypted for that request. The cache key lasts only as long as the request. With privacy mode on, the request is not used for training."}
            example="You ask for a change. The IDE sends the task and the tool results. The model reply streams back into the same window."
            onSelect={() => choose("gateway")}
            {...node} />
          <CodeNode x={c[0]} y={cY} label="IDE" label2="CLIENT"
            detail="tools run here"
            more="read, edit, shell"
            info={"Cursor is the editor. Read, search, edit, and the terminal run on your machine, in the folder you opened.\n\nThe model does not open those files itself. It asks, and the IDE runs the tool."}
            example="The agent asks to read a file. The IDE reads it locally and sends the passage back."
            onSelect={() => choose("task")}
            {...node} />
          <CodeNode x={c[1]} y={cY} label="AGENT" label2="LOOP"
            detail="one step, then wait"
            more="you can stop it"
            info={"The loop is the organization. One step, one tool, then the result goes back to the model.\n\nRules in the repo, such as AGENTS.md, are read into the prompt with the task."}
            example="It searches, reads one file, then edits. You stop it after the read. The edit does not happen."
            onSelect={() => choose("steps")}
            {...node} />
          <CodeNode x={c[2]} y={cY} label="INDEX" label2="SYNC"
            detail="only what changed"
            more="a hash per file"
            info={"Cursor hashes the file tree. A changed file is chunked and sent to be embedded. An unchanged chunk reuses the embedding already stored.\n\nThe sync does not rewrite the files on your machine."}
            example="You edit one file. Only that file’s chunks are embedded again."
            onSelect={() => choose("apply")}
            {...node} />
          <CodeNode x={c[3]} y={cY} label="CHAT" label2="THREAD"
            detail="this conversation"
            more="sent with the turn"
            info={"The thread is the memory of previous requests in this chat: the task, each tool result, and each reply.\n\nThe next turn sends that thread to the server. It is not a second copy of the repo."}
            example="You say “do the same for the other function.” The thread already holds the first edit."
            onSelect={() => choose("accept")}
            {...node} />

          <CodeNode x={c[0]} y={pY} label="READ" label2="FILES"
            detail="a passage, locally"
            more="then sent back"
            info={"A read runs in the IDE. The model sees the passage the tool returned.\n\nA file outside the workspace is not opened."}
            example="It reads the function you named, and the test next to it."
            onSelect={() => choose("read")}
            {...node} />
          <CodeNode x={c[1]} y={pY} label="MODEL" label2="CALL"
            detail="from the server"
            more="this turn only"
            info={"The model call leaves the IDE only through Cursor’s server. The editor does not open a port on the GPU.\n\nThe reply streams back. The weights are not copied into the project."}
            example="The model names the edit. The IDE applies it in the open file."
            onSelect={() => choose("model")}
            {...node} />
          <CodeNode x={c[2]} y={pY} label="SEARCH" label2="INDEX"
            detail="path and lines"
            more="not the source"
            info={"Semantic search uses the index. A hit is a path and a line range.\n\nThe source text is not kept in the index. The IDE still reads the file when the agent needs the text."}
            example="Search returns the file and the lines. The read tool then opens that file locally."
            onSelect={() => choose("check")}
            {...node} />

          <CodeNode x={c[0]} y={sY} label="REPO" label2="FOLDER"
            sublabel="the working copy"
            detail="stays on disk"
            more="the files you open"
            info={"The folder you opened is the working copy. Reads and edits point here.\n\nThe index and the chat point back at these files. They do not replace them."}
            example="Closing the chat leaves the folder where it was."
            onSelect={() => choose("workspace")}
            {...node} />
          <CodeNode x={c[2]} y={sY} label="CODE" label2="INDEX"
            detail="embeddings"
            more="path and lines"
            info={"The index stores embeddings with the relative path and the start and end lines. The source text is not stored there.\n\nA teammate’s index can be reused when the file trees match. A result is returned only for a file you already have."}
            example="The next session finds the function from the index, then reads it from the repo."
            onSelect={() => choose("log")}
            {...node} />
          <CodeNode x={c[3]} y={sY} label="CHAT" label2="LOG"
            sublabel="previous requests"
            detail="on this machine"
            more="scoped to the project"
            info={"The trace of a run is the chat: the task, each tool call, and each model turn. It is stored on this machine, for this workspace.\n\nA later chat in the same project can be reopened from that log. During a live turn, the thread is sent to the server for the model. With privacy mode on, it is not kept for training."}
            example="You reopen yesterday’s chat and the earlier reads are still in it."
            onSelect={() => choose("files")}
            {...node} />

          <text x="845" y="166" className="fill-muted font-mono text-[11px] uppercase">HOW TO READ IT</text>
          {([
            { y: 192, lines: ["You type in Cursor.", "Read, edit, and search", "run in the IDE."] },
            { y: 260, lines: ["Each step goes to", "Cursor’s server. It builds", "the prompt and calls", "the model."] },
            { y: 328, lines: ["The repo is chunked.", "The index keeps the path", "and the lines, not the", "source text."] },
            { y: 410, lines: ["Past requests stay", "on this machine. The next", "turn sends that thread."] },
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
          <CursorRunDiagram />
          <CodeConnectDiagram />
          <Section eyebrow="What moves, and what stays">
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Stays</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The repo on disk. The chat log of previous requests, on this machine, for this
                  project. Rules in the repo, such as AGENTS.md.
                </p>
              </article>
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">Moves</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The request, to Cursor’s server, which builds the prompt and calls the model.
                  Changed chunks, long enough to embed. The index keeps the path and the lines.
                  With privacy mode on, the request is not kept for training.
                </p>
              </article>
            </div>
          </Section>
        </div>
      ) : null}
    </div>
  );
}
