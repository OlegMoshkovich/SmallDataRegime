"use client";

import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowRight } from "@/components/button";
import { AgentsPanel } from "@/components/agents-panel";
import { DemoChat } from "@/components/demo-chat";
import { GatewayPanel } from "@/components/gateway-panel";
import { ModelsPanel } from "@/components/models-panel";
import { PremisePanel } from "@/components/premise-panel";
import { SystemPath } from "@/components/system-path";

const views = [
  { id: "summary", label: "Summary" },
  { id: "agents", label: "Agents" },
  { id: "models", label: "Models" },
  { id: "gateway", label: "Gateway" },
  { id: "premise", label: "Details" },
  { id: "trajectory", label: "Flow" },
  { id: "demo", label: "Demo" },
  { id: "setup", label: "Architecture" },
] as const;

type View = (typeof views)[number]["id"];

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
  compact = false,
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
  compact?: boolean;
  onShow: (event: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onPress: (event: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onHide: () => void;
}) {
  const hit = compact ? 132 : 156;
  const extraLines = (detail ? 1 : 0) + (subdetail ? 1 : 0);
  return (
    <g
      className="cursor-help"
      onMouseEnter={(event) => onShow(event, label, info)}
      onMouseMove={(event) => onShow(event, label, info)}
      onMouseLeave={onHide}
      onClick={(event) => onPress(event, label, info)}
    >
      <rect
        x={x - hit / 2}
        y={compact ? y - 26 : y - 28}
        width={hit}
        height={extraLines === 2 ? (compact ? 84 : 96) : extraLines === 1 ? (compact ? 70 : 80) : compact ? 58 : 62}
        fill="transparent"
      />
      <IsoCube x={x} y={y} accent={accent} />
      <text
        x={x}
        y={y + 22}
        textAnchor="middle"
        className={`fill-foreground font-mono tracking-[-0.01em] uppercase ${compact ? "text-[12px]" : "text-[13px]"}`}
      >
        {label}
      </text>
      {detail ? (
        <text
          x={x}
          y={compact ? y + 36 : y + 38}
          textAnchor="middle"
          className={`fill-faint font-mono tracking-[-0.01em] uppercase ${compact ? "text-[11px]" : "text-[12px]"}`}
        >
          {detail}
        </text>
      ) : null}
      {subdetail ? (
        <text
          x={x}
          y={compact ? y + 50 : y + 54}
          textAnchor="middle"
          className={`fill-faint font-mono tracking-[-0.01em] uppercase ${compact ? "text-[11px]" : "text-[12px]"}`}
        >
          {subdetail}
        </text>
      ) : null}
    </g>
  );
}

function HostingMobile({
  onShow,
  onPress,
  onHide,
  onClear,
}: {
  onShow: (event: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onPress: (event: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onHide: () => void;
  onClear: () => void;
}) {
  const L = 86;
  const R = 250;
  const mid = 168;
  const frameX = 10;
  const frameW = 304;
  const dash = "5 4";
  const r0 = 248;
  const r1 = 348;
  const r2 = 448;
  const r3 = 548;
  const r4 = 648;
  const node = {
    compact: true,
    onShow,
    onPress,
    onHide,
  };

  return (
    <svg
      onClick={onClear}
      viewBox="0 0 340 1160"
      className="block h-auto w-full"
      role="img"
      aria-label="On premise hosting. The proxy serves the chat and the gateway. The gateway calls Redis, Postgres, the agent workers, and the model proxy. The model proxy is the only path to the GPU ports and to the egress proxy."
    >
      <g fill="none" stroke="#101010" strokeWidth="1.25">
        {[mid - 36, mid, mid + 36].map((x) => (
          <g key={`human-${x}`} transform={`translate(${x} 16)`}>
            <circle cx="0" cy="0" r="5" />
            <path d="M-8 16c1.4-5 4-7.5 8-7.5s6.6 2.5 8 7.5" />
          </g>
        ))}
        {[mid - 36, mid, mid + 36].map((x) => (
          <g key={`screen-${x}`} transform={`translate(${x} 64)`}>
            <rect x="-9" y="-7" width="18" height="12" />
            <path d="M0 5v4M-5 9h10" />
          </g>
        ))}
      </g>
      <text x={mid} y="46" textAnchor="middle" className="fill-foreground font-mono text-[12px] uppercase">
        A human · Chat UI
      </text>
      <text x={mid} y="94" textAnchor="middle" className="fill-foreground font-mono text-[12px] uppercase">
        Enterprise apps · API
      </text>

      <g
        className="cursor-help"
        onMouseEnter={(event) =>
          onShow(
            event,
            "One URL",
            "ai.enterprise.internal on TLS 443. A human and enterprise apps both arrive here, and sign in with corporate single sign-on.",
          )
        }
        onMouseMove={(event) =>
          onShow(
            event,
            "One URL",
            "ai.enterprise.internal on TLS 443. A human and enterprise apps both arrive here, and sign in with corporate single sign-on.",
          )
        }
        onMouseLeave={onHide}
        onClick={(event) =>
          onPress(
            event,
            "One URL",
            "ai.enterprise.internal on TLS 443. A human and enterprise apps both arrive here, and sign in with corporate single sign-on.",
          )
        }
      >
        <rect x={frameX} y="108" width={frameW} height="46" fill="#ffffff" stroke="#101010" />
        <text x={mid} y="127" textAnchor="middle" className="fill-foreground font-mono text-[12px] uppercase">
          HTTPS · ai.enterprise.internal
        </text>
        <text x={mid} y="143" textAnchor="middle" className="fill-faint font-mono text-[11px] uppercase">
          Corporate SSO
        </text>
      </g>

      <g fill="none" stroke="#101010" strokeWidth="1.25">
        {[L, R].map((x) => (
          <g key={x}>
            <path d={`M${x},160 v16`} />
            <path d={`M${x - 3.5},165 l3.5,-6 l3.5,6`} />
            <path d={`M${x - 3.5},171 l3.5,6 l3.5,-6`} />
          </g>
        ))}
      </g>

      <rect x={frameX} y="184" width={frameW} height="500" fill="#f4f3f2" stroke="#d6d3d2" />
      <rect x={frameX} y="760" width={frameW} height="214" fill="#f4f3f2" stroke="#d6d3d2" />

      <g fill="none" stroke="#c8c4c2" strokeWidth="1.25" strokeDasharray={dash}>
        <path d={`M${L + 14},${r0 - 14} H${R - 14}`} />
        <path d={`M${mid},${r0 - 14} V${r1 - 22} H${L}`} />
        <path d={`M${L + 14},${r1 - 14} H${R - 14}`} />
        <path d={`M${mid},${r1 + 8} V${r3 - 14}`} />
        <path d={`M${L + 14},${r2 - 14} H${R - 14}`} />
        <path d={`M${L + 14},${r3 - 14} H${R - 14}`} />
        <path d={`M${mid},${r3 - 14} V${r4 - 14} H${L + 14}`} />
      </g>
      <path
        d={`M${L + 14},${r1 - 8} H176 V${r4 - 22} H${R}`}
        fill="none"
        stroke="#FF5C00"
        strokeWidth="1.6"
      />
      <path
        d={`M${R + 14},${r4 - 2} H328 V996 H${frameX + frameW}`}
        fill="none"
        stroke="#FF5C00"
        strokeWidth="1.5"
        strokeDasharray={dash}
      />
      <g fill="none" stroke="#FF5C00" strokeWidth="1.35">
        <path d={`M${R},${r4 + 34} V708`} />
        <path d={`M${R - 3.5},${r4 + 40} l3.5,-6 l3.5,6`} />
        <path d={`M${R - 3.5},702 l3.5,6 l3.5,-6`} />
        <path d={`M${mid},748 V776`} />
        <path d={`M${mid - 3.5},754 l3.5,-6 l3.5,6`} />
        <path d={`M${mid - 3.5},770 l3.5,6 l3.5,-6`} />
      </g>

      <g
        className="cursor-help"
        onMouseEnter={(event) =>
          onShow(
            event,
            "Ports 8001–8004",
            "The model proxy is the only caller of these ports. 8001 is Qwen, 8002 is DeepSeek, 8003 is the embedding model, and 8004 is the reranker.",
          )
        }
        onMouseMove={(event) =>
          onShow(
            event,
            "Ports 8001–8004",
            "The model proxy is the only caller of these ports. 8001 is Qwen, 8002 is DeepSeek, 8003 is the embedding model, and 8004 is the reranker.",
          )
        }
        onMouseLeave={onHide}
        onClick={(event) =>
          onPress(
            event,
            "Ports 8001–8004",
            "The model proxy is the only caller of these ports. 8001 is Qwen, 8002 is DeepSeek, 8003 is the embedding model, and 8004 is the reranker.",
          )
        }
      >
        <rect x={frameX} y="708" width={frameW} height="36" fill="#ffffff" stroke="#FF5C00" />
        <text x={mid} y="730" textAnchor="middle" className="fill-foreground font-mono text-[12px] uppercase">
          Ports 8001–8004 only
        </text>
      </g>

      <PlaneNode
        x={L}
        y={r0}
        label="Proxy"
        detail="TLS entry point"
        info="The single entry point on the internal network. It terminates HTTPS and sends the chat to the chat UI and the API to the gateway."
        {...node}
      />
      <PlaneNode
        x={R}
        y={r0}
        label="Chat UI"
        detail="SSO, human interface"
        info="Where a human signs in with the enterprise’s single sign-on and talks to the system. The chat calls the gateway."
        {...node}
      />
      <PlaneNode
        x={L}
        y={r1}
        label="Gateway ×2"
        detail="policy and routing"
        info="Two Fastify instances on port 8080. They check the request, enforce policy, and route it to a model, an agent, or a search."
        accent
        {...node}
      />
      <PlaneNode
        x={R}
        y={r1}
        label="OTel"
        detail="telemetry export"
        info="Sends OpenTelemetry traces out to the monitoring the enterprise already runs."
        {...node}
      />
      <PlaneNode
        x={L}
        y={r2}
        label="Agent worker ×2"
        detail="job queue workers"
        info="Two background workers. They run multi-step tasks from the pg-boss queue in Postgres, and call tools through the MCP servers."
        {...node}
      />
      <PlaneNode
        x={R}
        y={r2}
        label="MCP servers"
        detail="tool connectors"
        info="Three connectors. They are the tools an agent uses to reach SharePoint, a read-only database, and the sanctions list."
        {...node}
      />
      <PlaneNode
        x={L}
        y={r3}
        label="Postgres 16"
        detail="vectors, jobs, logs"
        info="Stores document vectors for search, runs the pg-boss job queue, and keeps the logs and the runs."
        {...node}
      />
      <PlaneNode
        x={R}
        y={r3}
        label="Redis 7"
        detail="budgets and cache"
        info="Tracks token budgets as they are spent, and caches frequent responses. The gateway is what talks to it."
        {...node}
      />
      <PlaneNode
        x={L}
        y={r4}
        label="Ingestion"
        detail="SharePoint sync"
        info="Syncs new and changed SharePoint files, and skips a file that has not changed. The vectors land in Postgres."
        {...node}
      />
      <PlaneNode
        x={R}
        y={r4}
        label="Model proxy"
        detail="sole path to models"
        info="The only path to the models. No other container calls a model directly. It is also the only service with a route out."
        accent
        {...node}
      />

      <PlaneNode
        x={L}
        y={812}
        label="vLLM Qwen"
        detail="GPU 0 · 8001"
        subdetail="chat and routing"
        info="Qwen3-30B-A3B in FP8, about 31 GB. It handles chat, answers from retrieved documents, and chooses where a task goes. FP8 is 8-bit floating point, which shrinks the memory it needs."
        {...node}
      />
      <PlaneNode
        x={R}
        y={812}
        label="vLLM DeepSeek"
        detail="GPU 1 · 8002"
        subdetail="compliance reasoning"
        info="DeepSeek-R1-Distill-Qwen-32B in FP8, about 33 GB. It does the compliance reasoning that needs step-by-step logic."
        {...node}
      />
      <PlaneNode
        x={L}
        y={916}
        label="Embeddings"
        detail="BGE-M3 · 8003"
        subdetail="document vectorization"
        info="BGE-M3, about 2 GB. It turns a document into vectors that can be searched."
        {...node}
      />
      <PlaneNode
        x={R}
        y={916}
        label="Reranker"
        detail="8004"
        subdetail="search result scoring"
        info="bge-reranker-v2-m3, about 2 GB. It scores the search results so the most relevant passages reach the model."
        {...node}
      />

      <g
        className="cursor-help"
        onMouseEnter={(event) =>
          onShow(
            event,
            "Egress proxy",
            "The enterprise egress proxy. Only the model proxy is allowed to leave through it, and only when the use case policy allows an external model.",
          )
        }
        onMouseMove={(event) =>
          onShow(
            event,
            "Egress proxy",
            "The enterprise egress proxy. Only the model proxy is allowed to leave through it, and only when the use case policy allows an external model.",
          )
        }
        onMouseLeave={onHide}
        onClick={(event) =>
          onPress(
            event,
            "Egress proxy",
            "The enterprise egress proxy. Only the model proxy is allowed to leave through it, and only when the use case policy allows an external model.",
          )
        }
      >
        <rect x={frameX} y="996" width={frameW} height="52" fill="#ffffff" stroke="#101010" />
        <text x={mid} y="1026" textAnchor="middle" className="fill-foreground font-mono text-[12px] uppercase">
          Egress proxy
        </text>
      </g>
      <path d={`M${mid},1048 v16`} fill="none" stroke="#101010" strokeWidth="1.25" />
      <path d={`M${mid - 3.5},1058 l3.5,6 l3.5,-6`} fill="none" stroke="#101010" strokeWidth="1.25" />
      <g
        className="cursor-help"
        onMouseEnter={(event) =>
          onShow(
            event,
            "External API",
            "An external frontier API. A request reaches it only when that use case’s policy allows it, and the sensitivity check passes.",
          )
        }
        onMouseMove={(event) =>
          onShow(
            event,
            "External API",
            "An external frontier API. A request reaches it only when that use case’s policy allows it, and the sensitivity check passes.",
          )
        }
        onMouseLeave={onHide}
        onClick={(event) =>
          onPress(
            event,
            "External API",
            "An external frontier API. A request reaches it only when that use case’s policy allows it, and the sensitivity check passes.",
          )
        }
      >
        <rect x={frameX} y="1072" width={frameW} height="56" fill="#ffffff" stroke="#101010" strokeDasharray={dash} />
        <text x={mid} y="1094" textAnchor="middle" className="fill-foreground font-mono text-[12px] uppercase">
          External API
        </text>
        <text x={mid} y="1112" textAnchor="middle" className="fill-faint font-mono text-[11px]">
          if allowed
        </text>
      </g>
    </svg>
  );
}

function SummaryHosting() {
  const frameX = 76;
  const frameW = 760;
  const frameCenter = frameX + frameW / 2;
  const col = [170, 360, 554, 744];
  const proxy = { x: col[0], y: 230 };
  const chat = { x: col[1], y: 230 };
  const gateway = { x: col[2], y: 230 };
  const otel = { x: col[3], y: 230 };
  const ingestion = { x: col[0], y: 324 };
  const mcp = { x: col[1], y: 324 };
  const worker = { x: col[2], y: 324 };
  const redis = { x: col[3], y: 324 };
  const postgres = { x: (col[0] + col[1]) / 2, y: 418 };
  const model = { x: col[2], y: 418 };
  const qwen = { x: col[0], y: 640 };
  const deepseek = { x: col[1], y: 640 };
  const embeddings = { x: col[2], y: 640 };
  const reranker = { x: col[3], y: 640 };
  const humanX = (col[0] + col[1]) / 2;
  const appsX = (col[2] + col[3]) / 2;
  const egressX = frameX + frameW + 48;
  const egressCenter = egressX + 80;
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

  return (
    <section ref={sectionRef} className="relative border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span aria-hidden className="size-1.5 bg-accent" />
        On premise pilot
      </p>
      <div className="mt-5 lg:hidden">
        <HostingMobile
          onShow={showTip}
          onPress={pressTip}
          onHide={hideTip}
          onClear={() => {
            if (coarsePointer()) setTip(null);
          }}
        />
      </div>
      <div className="mt-5 hidden max-w-full min-w-0 overflow-x-auto lg:block">
        <svg
          onClick={() => {
            if (coarsePointer()) setTip(null);
          }}
          viewBox="0 0 1120 760"
          className="block h-auto w-full min-w-[64rem]"
          role="img"
          aria-label="On premise hosting. The proxy serves the chat and the gateway. The gateway calls Redis, Postgres, the agent workers, and the model proxy. The model proxy is the only path to the GPU ports and to the egress proxy."
        >
          <rect x={frameX} y="176" width={frameW} height="292" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x={frameX} y="584" width={frameW} height="140" fill="#f4f3f2" stroke="#d6d3d2" />

          <g fill="none" stroke="#c8c4c2" strokeWidth="1.25" strokeDasharray={dash}>
            <path d={`M${proxy.x + 12},${proxy.y - 14} L${chat.x - 12},${chat.y - 14}`} />
            <path d={`M${chat.x + 12},${chat.y - 14} L${gateway.x - 12},${gateway.y - 14}`} />
            <path
              d={`M${proxy.x},${proxy.y - 22} C ${chat.x},${proxy.y - 64} ${chat.x},${gateway.y - 64} ${gateway.x},${gateway.y - 22}`}
            />
            <path d={`M${gateway.x + 12},${gateway.y - 14} L${otel.x - 12},${otel.y - 14}`} />
            <path d={`M${gateway.x + 8},${gateway.y + 2} L${redis.x - 8},${redis.y - 18}`} />
            <path d={`M${gateway.x},${gateway.y + 4} L${worker.x},${worker.y - 20}`} />
            <path d={`M${gateway.x - 10},${gateway.y + 2} L${postgres.x + 8},${postgres.y - 20}`} />
            <path d={`M${worker.x - 12},${worker.y - 10} L${mcp.x + 12},${mcp.y - 10}`} />
            <path d={`M${worker.x - 8},${worker.y + 2} L${postgres.x + 10},${postgres.y - 18}`} />
            <path d={`M${ingestion.x + 6},${ingestion.y + 4} L${postgres.x - 8},${postgres.y - 18}`} />
          </g>
          <path
            d={`M${gateway.x + 14},${gateway.y - 8} C ${gateway.x + 150},${gateway.y + 24} ${model.x + 150},${model.y - 80} ${model.x + 12},${model.y - 18}`}
            fill="none"
            stroke="#FF5C00"
            strokeWidth="1.6"
          />
          <path
            d={`M${model.x + 18},${model.y - 2} H ${egressCenter} V 548`}
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
              showTip(
                event,
                "One URL",
                "ai.enterprise.internal on TLS 443. A human and enterprise apps both arrive here, and sign in with corporate single sign-on.",
              )
            }
            onMouseMove={(event) =>
              showTip(
                event,
                "One URL",
                "ai.enterprise.internal on TLS 443. A human and enterprise apps both arrive here, and sign in with corporate single sign-on.",
              )
            }
            onMouseLeave={hideTip}
            onClick={(event) =>
              pressTip(
                event,
                "One URL",
                "ai.enterprise.internal on TLS 443. A human and enterprise apps both arrive here, and sign in with corporate single sign-on.",
              )
            }
          >
            <rect x={frameX} y="78" width={frameW} height="36" fill="#ffffff" stroke="#101010" />
            <text
              x={frameCenter}
              y="101"
              textAnchor="middle"
              className="fill-foreground font-mono text-[14px] tracking-[-0.01em] uppercase"
            >
              HTTPS · ai.enterprise.internal · Corporate SSO
            </text>
          </g>
          <g
            className="cursor-help"
            onMouseEnter={(event) =>
              showTip(
                event,
                "Ports 8001–8004",
                "The model proxy is the only caller of these ports. 8001 is Qwen, 8002 is DeepSeek, 8003 is the embedding model, and 8004 is the reranker.",
              )
            }
            onMouseMove={(event) =>
              showTip(
                event,
                "Ports 8001–8004",
                "The model proxy is the only caller of these ports. 8001 is Qwen, 8002 is DeepSeek, 8003 is the embedding model, and 8004 is the reranker.",
              )
            }
            onMouseLeave={hideTip}
            onClick={(event) =>
              pressTip(
                event,
                "Ports 8001–8004",
                "The model proxy is the only caller of these ports. 8001 is Qwen, 8002 is DeepSeek, 8003 is the embedding model, and 8004 is the reranker.",
              )
            }
          >
            <rect x={model.x - 228} y="508" width="456" height="34" fill="#ffffff" stroke="#FF5C00" />
            <text
              x={model.x}
              y="530"
              textAnchor="middle"
              className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase"
            >
              Model proxy → ports 8001–8004 only
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
          <text
            x={humanX}
            y="62"
            textAnchor="middle"
            className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase"
          >
            A human · Chat UI
          </text>
          <text
            x={appsX}
            y="62"
            textAnchor="middle"
            className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase"
          >
            Enterprise apps · API
          </text>

          <PlaneNode
            {...proxy}
            label="Proxy"
            detail="TLS entry point"
            info="The single entry point on the internal network. It terminates HTTPS and sends the chat to the chat UI and the API to the gateway."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...chat}
            label="Chat UI"
            detail="SSO, human interface"
            info="Where a human signs in with the enterprise’s single sign-on and talks to the system. The chat calls the gateway."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...gateway}
            label="Gateway ×2"
            detail="policy and routing"
            info="Two Fastify instances on port 8080. They check the request, enforce policy, and route it to a model, an agent, or a search."
            accent
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...otel}
            label="OTel"
            detail="telemetry export"
            info="Sends OpenTelemetry traces out to the monitoring the enterprise already runs."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...ingestion}
            label="Ingestion"
            detail="SharePoint sync"
            info="Syncs new and changed SharePoint files, and skips a file that has not changed. The vectors land in Postgres."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...mcp}
            label="MCP servers"
            detail="tool connectors"
            info="Three connectors. They are the tools an agent uses to reach SharePoint, a read-only database, and the sanctions list."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...worker}
            label="Agent worker ×2"
            detail="job queue workers"
            info="Two background workers. They run multi-step tasks from the pg-boss queue in Postgres, and call tools through the MCP servers."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...redis}
            label="Redis 7"
            detail="budgets and cache"
            info="Tracks token budgets as they are spent, and caches frequent responses. The gateway is what talks to it."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...postgres}
            label="Postgres 16"
            detail="vectors, jobs, logs"
            info="Stores document vectors for search, runs the pg-boss job queue, and keeps the logs and the runs."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...model}
            label="Model proxy"
            detail="sole path to models"
            info="The only path to the models. No other container calls a model directly. It is also the only service with a route out."
            accent
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />

          <PlaneNode
            {...qwen}
            label="vLLM Qwen"
            detail="GPU 0 · 8001"
            subdetail="chat and routing"
            info="Qwen3-30B-A3B in FP8, about 31 GB. It handles chat, answers from retrieved documents, and chooses where a task goes. FP8 is 8-bit floating point, which shrinks the memory it needs."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...deepseek}
            label="vLLM DeepSeek"
            detail="GPU 1 · 8002"
            subdetail="compliance reasoning"
            info="DeepSeek-R1-Distill-Qwen-32B in FP8, about 33 GB. It does the compliance reasoning that needs step-by-step logic."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...embeddings}
            label="Embeddings"
            detail="BGE-M3 · 8003"
            subdetail="document vectorization"
            info="BGE-M3, about 2 GB. It turns a document into vectors that can be searched."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />
          <PlaneNode
            {...reranker}
            label="Reranker"
            detail="8004"
            subdetail="search result scoring"
            info="bge-reranker-v2-m3, about 2 GB. It scores the search results so the most relevant passages reach the model."
            onShow={showTip}
            onHide={hideTip}
            onPress={pressTip}
          />

          <g
            className="cursor-help"
            onMouseEnter={(event) =>
              showTip(
                event,
                "Egress proxy",
                "The enterprise egress proxy. Only the model proxy is allowed to leave through it, and only when the use case policy allows an external model.",
              )
            }
            onMouseMove={(event) =>
              showTip(
                event,
                "Egress proxy",
                "The enterprise egress proxy. Only the model proxy is allowed to leave through it, and only when the use case policy allows an external model.",
              )
            }
            onMouseLeave={hideTip}
            onClick={(event) =>
              pressTip(
                event,
                "Egress proxy",
                "The enterprise egress proxy. Only the model proxy is allowed to leave through it, and only when the use case policy allows an external model.",
              )
            }
          >
            <rect x={egressX} y="548" width="160" height="72" fill="#ffffff" stroke="#101010" />
            <text
              x={egressCenter}
              y="580"
              textAnchor="middle"
              className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase"
            >
              Egress
            </text>
            <text
              x={egressCenter}
              y="598"
              textAnchor="middle"
              className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase"
            >
              proxy
            </text>
          </g>
          <path d={`M${egressCenter},620 v22`} fill="none" stroke="#101010" strokeWidth="1.25" />
          <path d={`M${egressCenter - 3.5},636 l3.5,6 l3.5,-6`} fill="none" stroke="#101010" strokeWidth="1.25" />
          <g
            className="cursor-help"
            onMouseEnter={(event) =>
              showTip(
                event,
                "External API",
                "An external frontier API. A request reaches it only when that use case’s policy allows it, and the sensitivity check passes.",
              )
            }
            onMouseMove={(event) =>
              showTip(
                event,
                "External API",
                "An external frontier API. A request reaches it only when that use case’s policy allows it, and the sensitivity check passes.",
              )
            }
            onMouseLeave={hideTip}
            onClick={(event) =>
              pressTip(
                event,
                "External API",
                "An external frontier API. A request reaches it only when that use case’s policy allows it, and the sensitivity check passes.",
              )
            }
          >
            <rect
              x={egressX}
              y="648"
              width="160"
              height="64"
              fill="#ffffff"
              stroke="#101010"
              strokeDasharray={dash}
            />
            <text
              x={egressCenter}
              y="674"
              textAnchor="middle"
              className="fill-foreground font-mono text-[13px] tracking-[-0.01em] uppercase"
            >
              External API
            </text>
            <text
              x={egressCenter}
              y="692"
              textAnchor="middle"
              className="fill-faint font-mono text-[12px] tracking-[-0.01em]"
            >
              if allowed
            </text>
          </g>
        </svg>
      </div>
      {tip ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-20 w-72 border border-line bg-surface px-3 py-2.5"
          style={{ left: tip.x, top: tip.y }}
        >
          <p className="font-mono text-[0.7rem] tracking-[-0.01em] uppercase">{tip.title}</p>
          <p className="mt-1.5 text-sm leading-snug text-faint">{tip.body}</p>
        </div>
      ) : null}
    </section>
  );
}

export function ArchitectureSwitch() {
  const [view, setView] = useState<View>("summary");

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex w-full max-w-full flex-wrap items-center gap-2 lg:contents">
          <button
            type="button"
            aria-pressed={view === "demo"}
            onClick={() => setView("demo")}
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
                    onClick={() => setView(item.id)}
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
        <div className="grid min-w-0 gap-16 *:min-w-0">
          <section className="w-full border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
            <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
              <span className="size-1.5 bg-accent" aria-hidden />
              Summary
            </p>
            <p className="mt-4 max-w-4xl text-base leading-relaxed text-faint">
              We write it in TypeScript and ship it as containers. The agent harnesses, document
              retrieval, and the local models all run beside the gateway, right next to the GPUs.
              Who may see what, which model serves each use case, the budgets, the logging: all of
              it is configuration, reviewed like code.
            </p>

            <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {[
                [
                  "Single access point",
                  "Every model call, agent run, and document lookup goes through the gateway. Applications call the gateway. The gateway calls the model.",
                ],
                [
                  "Local deployment",
                  "A request leaves the enterprise only when policy allows it and the sensitivity check passes. Customer files stay on the enterprise’s machines.",
                ],
                [
                  "Governance is configuration",
                  "Teams, model groups, use cases, budgets, and logging live in versioned files. A file that fails validation is rejected, and the last good policy stays active.",
                ],
                [
                  "Everything is replayable",
                  "Each request and each agent step is logged with its inputs, model, tools, and output. A run can be replayed against a new model or prompt and compared with the original.",
                ],
                [
                  "Modules work alone",
                  "The gateway, the compliance agent, document search, and text-to-SQL can each be piloted on their own.",
                ],
                [
                  "Build on what exists",
                  "We keep the enterprise’s single sign-on, document permissions, and Kubernetes.",
                ],
              ].map(([title, body]) => (
                <article key={title} className="bg-surface p-5">
                  <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">{title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-faint">{body}</p>
                </article>
              ))}
            </div>

            <div className="mt-12">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                A request
              </p>
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-faint">
                The gateway itself is stateless. Policy, logs, and runs live in Postgres; caches
                and budget counters live in Redis. Chat answers stream back as they are generated.
                The output check reads the answer as it arrives, then the full text just before the
                last event. Logging comes last, so even a failed or blocked request still gets
                logged.
              </p>
              <ol className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["01 Authenticate", "The human’s sign-in token, or the application’s credentials."],
                  ["02 Identity", "The human, their team, their groups, and the use case."],
                  ["03 Policy", "The compiled rules for that team and use case."],
                  ["04 Sensitivity", "Identifiers, account numbers, card numbers, names, and document labels set how sensitive the request is."],
                  ["05 Route", "A model group, an agent, or a search. The match cannot override where the data is allowed to run."],
                  ["06 Budget", "The estimated tokens are reserved against the team and the use case. At the limit, the request waits until the reset."],
                  ["07 Execute", "Call the model, start an agent, or search. If a model fails, the next in the chain answers. A local route stays local."],
                  ["08 Guard", "Leaked identifiers and claims the policy does not allow are blocked. Structured output is checked against its schema."],
                  ["09 Record", "Request, route, model, tokens, cost, latency, policy version, and a content hash. The budget is settled."],
                ].map(([title, body]) => (
                  <li key={title} className="bg-surface p-5">
                    <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
                      {title}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-faint">{body}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Where it runs
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The router picks what serves the request, then applies a hard rule for where it
                  may run. A use case can only tighten that rule. Customer data stays local. A
                  confidential draft stays local unless that use case names an external model.
                  Internal questions try local first. A public question may use a local or an
                  external model. Financial-crime use cases stay local at every level.
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  A named use case goes straight to its agent. Otherwise the request is compared
                  with examples for each route, then a small local model chooses, and a general
                  local chat route catches what is still unsure. Each model group has an ordered
                  fallback. An external model may fall back to a local one. A failed model is
                  skipped for a short time, and each model is watched on its own.
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Products
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  Document search has two paths. Live search asks the document store with the human’s
                  own token, so a file they cannot open never reaches the model. An index keeps changed
                  files, splits them, and stores who may read each piece. At question time the
                  gateway filters by the human’s groups, ranks the pieces, and sends a short set
                  to a local model, each with its file link.
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The compliance agent is a versioned harness. It reads the checklist, screens
                  names against the sanctions list without a model, pulls recent transactions from
                  a read-only view, searches case notes, and reasons on a local model. The output
                  is an evidence pack: findings, citations, a recommended action, and open
                  questions. A human approves, edits, or rejects. Escalation, filing, and
                  contacting a customer wait for that human.
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  An agent calls models only through the gateway, and its tools act with the
                  original human’s permissions. A run is a durable job. It survives a restart,
                  can wait for a human, and can be replayed step by step. Text-to-SQL comes after
                  the pilot and writes against named definitions, so the same question returns the
                  same number.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Models
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  Qwen serves chat, retrieval answers, and the router. DeepSeek serves the
                  compliance agent’s reasoning. A small embedding model and a reranker share a GPU
                  or run on CPU. Each model is its own container on the GPU machine, and only the
                  gateway calls those containers. Weights are mirrored into the enterprise’s
                  artifact store and mounted read-only, so nothing downloads at runtime.
                  Interactive requests go first. Batch work, nightly evaluations, and re-indexing
                  wait for off-hours.
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  Machines
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The application machine holds the chat, the gateway, the workers, the connectors,
                  Postgres, and Redis. The GPU machine serves the models, and its firewall accepts
                  traffic only from the application machine. The only route out of the enterprise
                  leaves from the gateway, through the enterprise’s egress proxy, and only for a
                  use case whose policy allows an external model. A human reaches one internal
                  URL. The API sits on the same URL. People sign in with the enterprise’s single
                  sign-on. Applications use client credentials. The same signed images move to the
                  enterprise’s Kubernetes later, with no code change.
                </p>
              </div>
            </div>
          </section>
          <section className="border-t border-line pt-8">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              Examples
            </p>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-faint">
              A human just asks, in the chat. This is the experience we have in mind, not a client
              of record.
            </p>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2">
              <li className="border border-line bg-surface p-4">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  A facility
                </p>
                <p className="mt-2 text-base">Can we waive the covenant on this facility?</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The orchestrator opens the credit policy and the facility file where they already
                  live. The question names a client, so the file does not leave the enterprise. It hands
                  the question to Compliance. Compliance answers on Qwen 30B, on the enterprise’s
                  machines.
                </p>
              </li>
              <li className="border border-line bg-surface p-4">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  A document
                </p>
                <p className="mt-2 text-base">Find the policy that covers this covenant.</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The orchestrator finds the document and opens it where it already lives. The
                  passage comes back in the chat. The human does not open the system, and the file
                  is not copied out.
                </p>
              </li>
              <li className="border border-line bg-surface p-4">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  A fraud alert
                </p>
                <p className="mt-2 text-base">What should we do with this fraud alert?</p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  The orchestrator opens the alert and the account activity, then hands the question
                  to the anti-fraud agent. The agent drafts what it found. A human decides. Nothing
                  is filed. The alert names a client, so the model stays on the enterprise’s machines.
                </p>
              </li>
              <li className="border border-line bg-surface p-4">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
                  A public question
                </p>
                <p className="mt-2 text-base">
                  How should we describe this product on the public site?
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  No client file is opened. The orchestrator may send that request to Claude.
                </p>
              </li>
            </ol>
          </section>
          <section className="border-t border-line pt-8">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
              The privacy rule
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  Stays on the enterprise’s machines
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  Client files, positions, credit memos, and anything else the enterprise is not free to
                  send out. The orchestrator opens them in place and the agent answers with an
                  on-prem model. Qwen 30B and DeepSeek are the models for this class.
                </p>
              </article>
              <article className="border border-line bg-surface p-5">
                <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  May leave
                </p>
                <p className="mt-3 text-base leading-relaxed text-faint">
                  A question that opens no such material: wording, a public product, a general
                  method. The orchestrator may call Claude. The frontier model never receives the
                  file the on-prem path was built to keep.
                </p>
              </article>
            </div>
          </section>
        </div>
      ) : null}
      {view === "trajectory" ? <SystemPath /> : null}
      {view === "agents" ? <AgentsPanel /> : null}
      {view === "premise" ? <PremisePanel /> : null}
      {view === "models" ? <ModelsPanel /> : null}
      {view === "gateway" ? <GatewayPanel /> : null}
      {view === "demo" ? (
        <div className="flex min-w-0 flex-col">
          <DemoChat embedded />
        </div>
      ) : null}
      {view === "setup" ? <SummaryHosting /> : null}
    </div>
  );
}
