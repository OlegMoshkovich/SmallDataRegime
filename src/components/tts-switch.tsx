"use client";

import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowRight } from "@/components/button";
import { TtsDemo } from "@/components/tts-demo";

const views = [
  { id: "summary", label: "Summary" },
  { id: "databases", label: "Databases" },
  { id: "platform", label: "Platform" },
  { id: "data", label: "Data" },
  { id: "genie", label: "Genie" },
  { id: "demo", label: "Demo" },
  { id: "setup", label: "Setup" },
] as const;

type View = (typeof views)[number]["id"];

function DbCube({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
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

function DbNode({
  x, y, accent = false, label, label2, sublabel, detail, more, info, onShow, onHide, onPress, onSelect,
}: {
  x: number; y: number; accent?: boolean; label: string; label2?: string; sublabel?: string;
  detail?: string; more?: string; info?: string;
  onShow?: (e: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onHide?: () => void;
  onPress?: (e: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onSelect?: () => void;
}) {
  const cls = `font-mono text-[11px] tracking-tight uppercase ${accent ? "fill-accent" : "fill-foreground"}`;
  const l1y = label2 ? y + 16 : y + 22;
  const nodeLabel = label2 ? `${label} ${label2}` : label;
  const handlers = info && onShow && onHide && onPress ? {
    className: "cursor-pointer",
    onMouseEnter: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info),
    onMouseMove: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info),
    onMouseLeave: onHide,
    onClick: (e: ReactMouseEvent<SVGGElement>) => {
      onPress(e, nodeLabel, info);
      onSelect?.();
    },
  } : {};
  return (
    <g {...handlers}>
      <rect x={x - 70} y={y - 26} width={140} height={label2 ? (more ? 100 : detail ? 86 : 68) : (more ? 90 : detail ? 72 : 56)} fill="transparent" />
      <DbCube x={x} y={y} accent={accent} />
      <text x={x} y={l1y} textAnchor="middle" className={cls}>{label}</text>
      {label2 ? <text x={x} y={l1y + 13} textAnchor="middle" className={cls}>{label2}</text> : null}
      {sublabel ? <text x={x} y={l1y + (label2 ? 26 : 13)} textAnchor="middle" className="fill-muted font-mono text-[10px]">{sublabel}</text> : null}
      {detail ? <text x={x} y={l1y + (label2 ? 39 : 26)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{detail}</text> : null}
      {more ? <text x={x} y={l1y + (label2 ? 51 : 38)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{more}</text> : null}
    </g>
  );
}

function DatabricksConnectDiagram() {
  const ucX = 148;
  const c = [300, 448, 596, 744];
  const cY = 202;
  const pY = 374;
  const sY = 540;

  const sectionRef = useRef<HTMLElement>(null);
  const [tip, setTip] = useState<{ title: string; body: string; x: number; y: number } | null>(null);
  const [route, setRoute] = useState<string | null>(null);

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

  function placeTip(event: { clientX: number; clientY: number }, title: string, body: string) {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    const width = 288;
    const height = 320;
    let x = event.clientX - bounds.left + 14;
    let y = event.clientY - bounds.top + 18;
    if (x + width > bounds.width - 8) x = event.clientX - bounds.left - width - 10;
    if (y + height > bounds.height - 8) y = event.clientY - bounds.top - height - 10;
    return { title, body, x: Math.max(8, x), y: Math.max(8, y) };
  }

  function showTip(event: { clientX: number; clientY: number }, title: string, body: string) {
    if (coarsePointer()) return;
    const next = placeTip(event, title, body);
    if (next) setTip(next);
  }

  function pressTip(event: ReactMouseEvent<SVGElement>, title: string, body: string) {
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
          aria-label="Databricks platform connection diagram showing four access flows through control, compute, and storage layers, governed by Unity Catalog."
        >
          {/* Layer backgrounds */}
          <rect x="90" y="152" width="722" height="136" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="324" width="722" height="132" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="492" width="722" height="124" fill="#f4f3f2" stroke="#d6d3d2" />

          {/* Left side labels */}
          <text x="5" y="66" className="fill-foreground font-mono text-[11px] uppercase">ACCESS</text>
          <text x="5" y="81" className="fill-muted font-mono text-[10px]">Users, tools</text>
          <line x1="5" y1="96" x2="82" y2="96" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="187" className="fill-foreground font-mono text-[11px] uppercase">CONTROL</text>
          <text x="5" y="202" className="fill-muted font-mono text-[10px]">Run by</text>
          <text x="5" y="215" className="fill-muted font-mono text-[10px]">Databricks</text>
          <line x1="5" y1="276" x2="82" y2="276" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="359" className="fill-foreground font-mono text-[11px] uppercase">COMPUTE</text>
          <text x="5" y="374" className="fill-muted font-mono text-[10px]">Your cloud or</text>
          <text x="5" y="387" className="fill-muted font-mono text-[10px]">serverless</text>
          <line x1="5" y1="444" x2="82" y2="444" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="526" className="fill-foreground font-mono text-[11px] uppercase">STORAGE</text>
          <text x="5" y="541" className="fill-muted font-mono text-[10px]">Where data</text>
          <text x="5" y="554" className="fill-muted font-mono text-[10px]">is kept</text>
          <line x1="5" y1="604" x2="82" y2="604" stroke="#d6d3d2" strokeWidth="0.8" />

          {/* Access → control. The numbered step sits below the labels, with no stub through the words. */}
          {c.map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy="128" r="9" fill="#101010" />
              <text x={cx} y="132" textAnchor="middle" fill="white" fontSize="11" className="font-mono">{i + 1}</text>
            </g>
          ))}

          {/* User icons */}
          {[c[0], c[1]].map((cx) => (
            <g key={cx} fill="none" stroke="#101010" strokeWidth="1.2" transform={`translate(${cx} 44)`}>
              <circle cx="0" cy="0" r="6" />
              <path d="M-9 18c1.5-6 4.5-9 9-9s7.5 3 9 9" />
            </g>
          ))}
          {[c[2], c[3]].map((cx) => (
            <g key={cx} fill="none" stroke="#101010" strokeWidth="1.2" transform={`translate(${cx} 44)`}>
              <rect x="-10" y="-8" width="20" height="14" />
              <path d="M0 6v5M-6 11h12" />
            </g>
          ))}

          {/* Access column labels */}
          {([
            [c[0], "DATA", "ENGINEERS"],
            [c[1], "ANALYSTS", "BI TOOLS"],
            [c[2], "AI APPS", "AGENTS"],
            [c[3], "BUSINESS", "APPS"],
          ] as [number, string, string][]).map(([cx, l1, l2]) => (
            <g key={cx}>
              <text x={cx} y="84" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l1}</text>
              <text x={cx} y="98" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l2}</text>
            </g>
          ))}
          {([
            {
              id: "engineers",
              title: "Data engineers",
              body: "They own the pipelines that build the tables.\n\nA job joins a customer's products and channels into one profile and commits that row to Delta.",
            },
            {
              id: "analysts",
              title: "Analysts and BI tools",
              body: "They ask questions and open reports.\n\nAn analyst asks Genie for this period's totals, and the SQL warehouse reads those figures from Delta.",
            },
            {
              id: "ai",
              title: "AI apps and agents",
              body: "They retrieve records and call a model.\n\nAn agent reads the customer's Delta row, searches the documents, and model serving returns the score.",
            },
            {
              id: "business",
              title: "Business apps",
              body: "They read and write the live row on a screen.\n\nThe offer app opens the customer's Lakebase record, writes the next product, and that write syncs to Delta.",
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
              onMouseEnter={(e) => showTip(e, item.title, item.body)}
              onMouseMove={(e) => showTip(e, item.title, item.body)}
              onMouseLeave={hideTip}
              onClick={(e) => {
                pressTip(e, item.title, item.body);
                choose(item.id);
              }}
            />
          ))}

          {/* Dashed links. A selected box turns the lines on its route orange. */}
          <g fill="none" strokeDasharray="4 3">
            <line x1={c[0]} y1="138" x2={c[0]} y2={cY - 22} {...pick(["engineers", "jobs", "spark", "catalog"])} />
            <line x1={c[1]} y1="138" x2={c[1]} y2={cY - 22} {...pick(["analysts", "genie", "warehouse", "catalog"])} />
            <line x1={c[2]} y1="138" x2={c[2]} y2={cY - 22} {...pick(["ai", "agents", "serving", "catalog"])} />
            <line x1={c[3]} y1="138" x2={c[3]} y2={cY - 22} {...pick(["business", "apps", "lakebase", "catalog"])} />
            <line x1={c[0]} y1="278" x2={c[0]} y2={pY - 22} {...pick(["engineers", "jobs", "spark", "delta", "catalog"])} />
            <line x1={c[0]} y1="448" x2={c[0]} y2={sY - 22} {...pick(["engineers", "jobs", "spark", "delta", "catalog"])} />
            <line x1={c[1]} y1="278" x2={c[1]} y2={pY - 22} {...pick(["analysts", "genie", "warehouse", "delta", "catalog"])} />
            <line x1={c[1]} y1="448" x2={c[1]} y2="478" {...pick(["analysts", "genie", "warehouse", "delta", "catalog"])} />
            <line x1={c[2]} y1="278" x2={c[2]} y2={pY - 22} {...pick(["ai", "agents", "serving", "models", "delta", "catalog"])} />
            <line x1={c[2]} y1="448" x2={c[2]} y2={sY - 22} {...pick(["ai", "agents", "serving", "models", "catalog"])} />
            <line x1={c[3]} y1="278" x2={c[3]} y2={sY - 22} {...pick(["business", "apps", "lakebase", "delta", "catalog"])} />
            <line x1={c[3]} y1="478" x2={c[2]} y2="478" {...pick(["business", "apps", "lakebase", "delta", "catalog"])} />
            <line x1={c[2]} y1="478" x2={c[1]} y2="478" {...pick(["ai", "agents", "serving", "business", "apps", "lakebase", "delta", "catalog"])} />
            <line x1={c[1]} y1="478" x2={c[0]} y2="478" {...pick(["analysts", "genie", "warehouse", "ai", "agents", "serving", "business", "apps", "lakebase", "delta", "catalog"])} />
          </g>

          {/* Control layer nodes */}
          <DbNode x={ucX} y={cY} accent label="UNITY" label2="CATALOG"
            detail="permission fabric"
            more="checks every query"
            info={"Unity Catalog is the single governance layer. Every table, model, file, and function is registered here. Access policies, lineage, and audit logs all flow through it, whichever service runs the query.\n\nA notebook, a Genie question, an agent call, and an app query each ask Catalog before they touch data. Catalog records who read a table, which job wrote it, and which model was trained on it. A missing grant stops the query."}
            onSelect={() => choose("catalog")}
            {...node} />
          <DbNode x={c[0]} y={cY} label="LAKEFLOW" label2="JOBS"
            detail="designer and notebooks"
            more="writes the tables"
            info={"Lakeflow is where engineers ingest and transform data. Pipelines are built in Lakeflow Designer or in notebooks, and jobs run them on a schedule, on Spark. The result is written as Delta or Iceberg tables.\n\nBronze-to-silver pipelines live here: clean a raw feed, join it to a reference table, and commit the output. Unity Catalog decides which tables the job may read and which schema it may write."}
            onSelect={() => choose("jobs")}
            {...node} />
          <DbNode x={c[1]} y={cY} label="GENIE" label2="AI/BI"
            detail="dashboards, metric views"
            more="questions become SQL"
            info={"Genie lets analysts ask a question in plain language and get an answer from Delta tables. It turns the question into SQL, sends it to the SQL warehouse, and returns a table or a chart. AI/BI dashboards use the same metric views, so a question and a report share one definition.\n\nThe warehouse returns only the tables that the analyst is allowed to read. A follow-up question stays on that same governed set of tables."}
            onSelect={() => choose("genie")}
            {...node} />
          <DbNode x={c[2]} y={cY} label="AGENT BRICKS" label2="AI GATEWAY"
            detail="build and run agents"
            more="logs every model call"
            info={"Agents AI is where teams build, evaluate, and deploy agents on enterprise data. An agent retrieves rows or documents, calls a model, and returns an answer or a next step. AI Gateway sits in front of model serving and records the caller, the model, the token cost, and the response on every call.\n\nRate limits and spend controls are applied at the gateway. Unity Catalog still decides which tables, files, and model versions that agent may open."}
            onSelect={() => choose("agents")}
            {...node} />
          <DbNode x={c[3]} y={cY} label="DATABRICKS" label2="APPS"
            detail="hosted web apps"
            more="inherit catalog rights"
            info={"Databricks Apps hosts internal web applications, in Python or React, on the platform itself. The app runs next to the data and keeps the signed-in user's Unity Catalog grants, so a screen can only show what that user is allowed to query.\n\nLive operational screens usually read and write Lakebase Postgres. Reports go to the SQL warehouse, and predictions go to model serving, under the same Catalog grants."}
            onSelect={() => choose("apps")}
            {...node} />

          {/* Compute layer nodes */}
          <DbNode x={c[0]} y={pY} label="SPARK" label2="CLUSTERS"
            detail="distributed processing"
            more="runs jobs at scale"
            info={"Apache Spark clusters run notebooks and jobs across many machines. A transformation is split into tasks, then committed as one Delta transaction, so a reader sees a finished update. Clusters scale out for a large run and scale back when the run ends.\n\nSpark is the engine under the engineering path. It writes the Delta tables that the SQL warehouse later reads."}
            onSelect={() => choose("spark")}
            {...node} />
          <DbNode x={c[1]} y={pY} label="DATABRICKS" label2="SQL"
            detail="warehouse queries"
            more="reads the same tables"
            info={"The SQL warehouse is a serverless engine for BI queries. Genie, dashboards, and JDBC or ODBC tools all send SQL here. The warehouse reads the Delta tables Spark wrote, applies the Catalog grant, and returns rows.\n\nAn idle warehouse scales down, so a quiet dashboard does not keep machines running. A burst of questions scales it back up."}
            onSelect={() => choose("warehouse")}
            {...node} />
          <DbNode x={c[2]} y={pY} label="MODEL" label2="SERVING"
            detail="foundation model APIs"
            more="answers one request"
            info={"You choose the model in MLflow: a named version of your own model, or a foundation model by name. Serving hosts that choice on an endpoint, with a workload size, and scales with the requests.\n\nAgent Bricks calls the endpoint through AI Gateway, which logs the caller, the cost, and the limit. Serving loads the weights from MLflow. Unity Catalog decides who may register the model and who may call it."}
            onSelect={() => choose("serving")}
            {...node} />

          {/* Storage layer nodes */}
          <DbNode x={c[0]} y={sY} label="DELTA LAKE" label2="ICEBERG"
            sublabel="shared by 1 and 2"
            detail="open table formats"
            more="one copy, many readers"
            info={"Delta and Iceberg tables are Parquet files in the enterprise cloud account, with transactions, schema changes, and time travel. A commit finishes as a whole, so a reader sees the previous version or the new one. Iceberg readers reach the same tables through UniForm.\n\nSpark writes these tables. The SQL warehouse, agents, and apps read the same files. The paths meet on this one copy."}
            onSelect={() => choose("delta")}
            {...node} />
          <DbNode x={c[2]} y={sY} label="MLFLOW" label2="VECTOR SEARCH"
            detail="registry and embeddings"
            more="search the documents"
            info={"The MLflow registry stores each model version: weights, signature, and the files needed to load it. A training run in a notebook logs the version, and someone promotes it when it is ready to serve. Feature tables and vector indexes sit here too, including the document indexes agents search.\n\nModel Serving and agents load a named version. Catalog decides who may register a model and who may call it."}
            onSelect={() => choose("models")}
            {...node} />
          <DbNode x={c[3]} y={sY} label="LAKEBASE" label2="POSTGRES"
            sublabel="synced to Delta"
            detail="managed Postgres"
            more="live reads and writes"
            info={"Lakebase is managed Postgres for live application data, so it sits with storage. Business apps insert, update, and read rows with short transactions. Each change is captured and streamed into a Delta table, so Spark, the warehouse, and agents see the same records shortly after the app writes them.\n\nCatalog governs the Postgres tables and the Delta tables they land in. The app keeps its fast reads and writes on Postgres."}
            onSelect={() => choose("lakebase")}
            {...node} />

          {/* Right legend */}
          <text x="845" y="166" className="fill-muted font-mono text-[11px] uppercase">HOW TO READ IT</text>
          {([
            { y: 192, lines: ["Lakeflow jobs run on", "Spark, which writes Delta", "and Iceberg tables."] },
            { y: 260, lines: ["Genie and dashboards send", "SQL to the warehouse,", "which reads the same tables."] },
            { y: 330, lines: ["Agents call models through", "AI Gateway; serving loads", "MLflow models and searches", "documents."] },
            { y: 405, lines: ["Apps keep live data in", "Lakebase, synced to Delta."] },
          ] as { y: number; lines: string[] }[]).map((item, i) => (
            <g key={item.y}>
              <circle cx="855" cy={item.y} r="9" fill="#101010" />
              <text x="855" y={item.y + 4} textAnchor="middle" fill="white" className="font-mono text-[11px]">{i + 1}</text>
              {item.lines.map((line, j) => (
                <text key={j} x="870" y={item.y + (j * 14) + 4} className="fill-faint font-mono text-[11px]">{line}</text>
              ))}
            </g>
          ))}
          <text x="870" y="472" className="fill-faint font-mono text-[11px]">Unity Catalog checks</text>
          <text x="870" y="486" className="fill-faint font-mono text-[11px]">permissions on every</text>
          <text x="870" y="500" className="fill-faint font-mono text-[11px]">service and table.</text>
        </svg>
      </div>
      {tip ? (
        <div
          className="pointer-events-none absolute z-10 w-72 border border-line bg-surface px-4 py-3 shadow-sm"
          style={{ left: tip.x, top: tip.y }}
        >
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{tip.title}</p>
          {tip.body.split("\n\n").map((para) => (
            <p key={para} className="mt-2 text-sm leading-snug text-faint first:mt-1">{para}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-line">
      <td className="py-3 pr-6 align-top font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase whitespace-nowrap">
        {label}
      </td>
      <td className="py-3 text-sm leading-snug text-faint">{children}</td>
    </tr>
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

function CardGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="border border-line bg-surface px-4 py-4">
          <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
            {item.title}
          </p>
          <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

const databaseFamilies: {
  title: string;
  stores: string;
  query: string;
  example: string;
  use: string;
  body: string;
}[] = [
  {
    title: "Relational OLTP",
    stores: "Rows, keys, constraints",
    query: "SQL transactions",
    example: "UPDATE account SET balance = balance - 40 WHERE id = 12",
    use: "Systems of record: accounts, orders, payments, ERP",
    body: "Each row is one record. Primary keys, foreign keys, and unique constraints make illegal states hard to write. The engine records a change in a write-ahead log before it applies it, then commit makes the change durable. A transaction groups several statements so they all land or none do. Data is usually normalized: the customer lives once and accounts point at the customer, so a join rebuilds the full picture. PostgreSQL, MySQL, SQL Server, Oracle, and Db2 are the usual enterprise engines. PostgreSQL and Oracle also store JSON, arrays, and spatial values in SQL, so those shapes often stay in the same engine. This is where an application writes the fact it legally owns.",
  },
  {
    title: "Distributed SQL",
    stores: "Relational rows, sharded",
    query: "SQL across shards",
    example: "BEGIN; UPDATE inventory SET qty = qty - 1 WHERE sku = 'A'; COMMIT",
    use: "Global OLTP that one machine cannot hold",
    body: "Same tables and SQL as a single-node database. Rows are split across machines, and replicas agree through consensus before a commit returns. Use it when write volume or a multi-region footprint outgrows one primary. Cross-shard transactions work and cost more latency than a local Postgres commit. Spanner, CockroachDB, YugabyteDB, and TiDB are the common products. Vitess shards MySQL in the same spirit.",
  },
  {
    title: "Columnar warehouse",
    stores: "Columns, compressed",
    query: "Analytical SQL",
    example: "SELECT region, SUM(amount) FROM payments GROUP BY region",
    use: "Reporting, finance, risk, regulatory history",
    body: "Values of one field sit together on disk and compress well. A sum over amount reads that column, so a scan of years of payments stays cheap. Single-row updates are a poor fit; loads arrive in batches or micro-batches. Queries take a snapshot: the scan sees one version of the table the whole way through. Snowflake, BigQuery, Redshift, Teradata, and Databricks SQL are the enterprise warehouses. ClickHouse, Druid, and Pinot are the same idea aimed at dashboards that must include the last few seconds. SAP HANA keeps this columnar layout in memory under a lot of ERP estates.",
  },
  {
    title: "Lake and lakehouse",
    stores: "Files plus a table log",
    query: "SQL from several engines",
    example: "SELECT * FROM prod.payments.transactions VERSION AS OF 42",
    use: "Cheap shared history for BI, ML, and replay",
    body: "The bytes live as files, usually Parquet, in object storage (S3, ADLS, GCS). A table format (Delta, Iceberg, or Hudi) adds a log that says which files currently form the table, so readers get transactions, schema changes, and time travel. A catalog maps the name prod.payments.transactions to those files and holds permissions. Spark, Trino, a warehouse, or Python can read the same table. Raw files can sit beside tables: the reader supplies the schema later (schema-on-read). This is the shared history under analytics and models, and a poor place to authorize a payment.",
  },
  {
    title: "Document",
    stores: "JSON or BSON documents",
    query: "Field filters, aggregation pipelines",
    example: "db.claims.find({ status: 'open', 'policy.type': 'home' })",
    use: "Catalogs, profiles, payloads with varying fields",
    body: "One document holds a nested object, and two documents in the same collection may carry different fields. That suits a catalog, a claim payload, or a profile whose shape depends on the product. Indexes are declared on the fields you filter. The natural query fetches or updates one document. MongoDB's query API is the usual one; Amazon DocumentDB speaks that same API. Couchbase adds N1QL, SQL over documents.",
  },
  {
    title: "Key-value and cache",
    stores: "A key and its value",
    query: "Get, set, increment by key",
    example: "GET acct:12:balance",
    use: "Sessions, rate limits, hot lookups, counters",
    body: "Retrieval is an exact key. There is no join and no rich filter. Redis and Memcached keep values in memory and answer in microseconds; Redis also offers lists, sets, sorted sets, and streams, and can persist to disk. DynamoDB stores JSON items by partition key and optional sort key, at any scale, still without joins. Enterprises use these on the request path: a session, a rate limit, today's fraud-velocity counter. A cache is allowed to miss. On a miss, the service reads the system of record and fills the key.",
  },
  {
    title: "Wide-column",
    stores: "A row key and sparse columns",
    query: "CQL or a key scan",
    example: "SELECT * FROM events WHERE account_id = 12 AND ts > '2026-01-01'",
    use: "Very high write rates with known-key reads",
    body: "Cassandra, ScyllaDB, HBase, and Bigtable group columns under a partition key. Columns can be sparse and can appear over time. CQL looks like SQL, and efficient reads include the partition key; a query that scans every partition is the wrong shape. There are no arbitrary joins. The layout fits device telemetry, message metadata, and event history when the application always knows the key it wants. Wide-column here means sparse columns under a key. A columnar warehouse, which stores one field for every row together, is a different layout.",
  },
  {
    title: "Graph",
    stores: "Nodes, edges, properties",
    query: "Traversal: Cypher, Gremlin, GSQL",
    example: "MATCH (a:Account {id:12})-[:TRANSFER*1..3]->(b) RETURN b",
    use: "Fraud rings, ownership, dependency maps",
    body: "The relationship is the record. An account, a device, a person, and a beneficiary are nodes; transfers and ownership are edges. A query names a pattern of hops, and cost grows with how deep and how wide that pattern is. Neo4j uses Cypher, Neptune speaks Gremlin and openCypher, TigerGraph uses GSQL. RDF triple stores (Stardog, GraphDB) answer the same kind of question with SPARQL over subject-predicate-object facts. Enterprises use graphs for AML networks, beneficial ownership, householding, and maps of which systems call which.",
  },
  {
    title: "Time series",
    stores: "A timestamp and measurements",
    query: "Range plus interval rollup",
    example: "SELECT mean(value) FROM cpu WHERE time > now() - 1h GROUP BY time(1m)",
    use: "Metrics, sensors, market ticks, throughput",
    body: "Time is the primary axis. Engines store points in time-ordered chunks, compress them, and roll them up (one-second raw, one-minute averages, then hourly). Retention policies drop or downsample old data on purpose. TimescaleDB is this model inside PostgreSQL, so the query is SQL. InfluxDB has its own query languages. Prometheus uses PromQL. In capital markets, kdb+ and its q language hold tick history. The job is rate, trend, and last-N-minutes, which is a different question from a customer transaction.",
  },
  {
    title: "Search",
    stores: "An inverted index over text",
    query: "Query DSL, ranked matches",
    example: "{ query: { match: { name: 'amina okafor' } } }",
    use: "Lookup by words, logs, policy search",
    body: "At index time the engine splits text into terms, applies stemming and synonyms, and stores each term pointing at the documents that contain it. A query ranks matches; it can tolerate a typo and combine text with structured filters. Elasticsearch and OpenSearch use a JSON query DSL. Solr uses Lucene syntax. This is how a contact center finds a customer by a fragment of a name, how staff search policy documents, and how security teams search logs. The index is rebuilt from a source system. It lags that source by the time the pipeline takes.",
  },
  {
    title: "Vector",
    stores: "Embeddings plus metadata",
    query: "Nearest neighbor, then filters",
    example: "search(embedding, k = 8) WHERE entity = 'retail'",
    use: "Similar cases, policy Q&A, retrieval for assistants",
    body: "A model turns a passage, a case, or a product into a list of numbers. An approximate nearest-neighbor index returns the stored vectors closest to a query vector. Metadata filters keep the neighbors inside a tenant, a product line, or a date range. pgvector does this inside PostgreSQL. Milvus, Weaviate, Qdrant, Pinecone, and Databricks Vector Search are dedicated indexes. Hybrid search mixes this ranking with keyword search. The documents themselves stay in the system of record or the lake; the vector store is a derived index for 'what is similar'.",
  },
  {
    title: "Embedded",
    stores: "A file or an in-process engine",
    query: "SQL in the same process",
    example: "SELECT * FROM read_parquet('s3://lake/payments/*.parquet')",
    use: "Devices, local apps, analyst engines, inner components",
    body: "No separate database server. SQLite is a file plus a SQL engine: phones, appliances, desktop apps, and tests. It allows many readers and one writer. DuckDB is an analytical engine in-process: an analyst or a pipeline runs SQL directly on Parquet files, including files in object storage. RocksDB is a key-value engine embedded inside other systems, including stream processors and several databases. These hold local or intermediate data. A shared enterprise system of record stays on a server engine.",
  },
  {
    title: "Navigational and mainframe",
    stores: "Trees, networks, keyed files",
    query: "Walk a path designed in advance",
    example: "Get next child under this parent (IMS DL/I)",
    use: "Long-lived core systems in enterprises",
    body: "IMS stores hierarchies. A program walks them with DL/I calls: get unique, get next, get next within parent. CODASYL databases store a network of predefined links. VSAM is a keyed or sequential file, often read from COBOL, with the access path chosen when the file was designed. Adabas is still in some insurance and public-sector estates. These remain systems of record for deposits, policies, and ledgers opened decades ago. Modern practice copies changes out with CDC and leaves the navigational store as the owner of the write.",
  },
  {
    title: "Multi-model",
    stores: "Several shapes in one product",
    query: "The API you chose for that container",
    example: "SELECT * FROM c WHERE c.status = 'open'",
    use: "Platforms that expose more than one access style",
    body: "Cosmos DB, ArangoDB, and similar products offer document, key-value, graph, or column APIs from one service. The access pattern still decides the shape: a graph API answers hops, a document API answers field filters. The product label does not remove that choice. In practice an enterprise still separates the system of record from the derived indexes, even when one vendor hosts both.",
  },
];

function DatabasesView() {
  return (
    <div className="grid min-w-0 gap-6 *:min-w-0">
      <Section eyebrow="The question picks the store">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          A database holds data, finds it by a known access pattern, and lets many programs share
          it. Enterprises run several at once, because every reader asks a different question of the
          same fact.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "System of record",
              body: "The application that owns the fact writes it here. Transactions and constraints make the write complete: a payment is posted, or it is not.",
            },
            {
              label: "Operational read",
              body: "A service reads current state on the request path. Often the same database. Sometimes a replica kept for read scale and failover.",
            },
            {
              label: "Analytical store",
              body: "History kept so a scan can sum, join, and replay. Warehouses and lakehouses. Writers are pipelines, and readers are analysts, reports, and models.",
            },
            {
              label: "Derived index",
              body: "A projection rebuilt for one access pattern: a hot key, a word, a relationship, or a similar passage. Search, vector, graph, and cache sit here. The source can rebuild them.",
            },
          ].map((item) => (
            <div key={item.label} className="border border-line bg-surface px-4 py-5">
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="From a write to a read">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          Storage is the layout that makes one kind of read cheap; retrieval is the path from a
          question back to those bytes. A point read follows an index to a single record. A scan
          sweeps a column or a set of files and adds them up.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              n: "01",
              label: "Capture",
              body: "An application inserts or updates the system of record: one account, one payment, one order line.",
            },
            {
              n: "02",
              label: "Durability",
              body: "The engine appends the change to a log, applies it to pages or files, and commit tells the caller it will survive a crash.",
            },
            {
              n: "03",
              label: "Publish",
              body: "Change data capture or an event copies the committed change onto a log (Kafka, Pulsar) or into a file drop.",
            },
            {
              n: "04",
              label: "Land",
              body: "A pipeline appends the raw change to a lake or a staging table and keeps the history, including late and corrected records.",
            },
            {
              n: "05",
              label: "Model",
              body: "Jobs clean, join, and aggregate into tables shaped for a business question: a customer profile, a daily balance, a risk feature.",
            },
            {
              n: "06",
              label: "Serve",
              body: "A screen, a dashboard, a model, or an agent reads the copy built for that question. The system of record stays authoritative.",
            },
          ].map((step) => (
            <div key={step.n} className="border border-line bg-surface px-4 py-5">
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                {step.n} {step.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Families">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          The families below cover the types enterprises actually run day to day. The query column
          shows the access style each one is built around.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal text-muted">Family</th>
                <th className="px-4 py-3 font-normal text-muted">What it stores</th>
                <th className="px-4 py-3 font-normal text-muted">How you query</th>
                <th className="px-4 py-3 font-normal text-muted">Enterprise use</th>
              </tr>
            </thead>
            <tbody>
              {databaseFamilies.map((family) => (
                <tr key={family.title} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                    {family.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-faint">{family.stores}</td>
                  <td className="px-4 py-3 text-sm text-faint">{family.query}</td>
                  <td className="px-4 py-3 text-sm text-faint">{family.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="How each one is stored and queried">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          A one-line query first, then the layout and the job it's good for. The products named here
          are the ones large organizations really run today.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {databaseFamilies.map((family) => (
            <div key={family.title} className="border border-line bg-surface px-4 py-5">
              <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                {family.title}
              </p>
              <p className="mt-2 font-mono text-[0.7rem] leading-snug break-words text-accent">
                {family.example}
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">{family.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Words that organize the model">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          These words describe layout, freshness, and who owns the bytes. They show up across every
          family.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal text-muted">Word</th>
                <th className="px-4 py-3 font-normal text-muted">Means</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["OLTP", "Many small reads and writes, one business action at a time. The operational database."],
                ["OLAP", "Fewer, larger reads: sums, cohorts, and extracts over history. The warehouse and the lakehouse."],
                ["Row store", "Fields of one record sit together. A single-account update touches one place."],
                ["Column store", "All values of one field sit together. A sum over a year touches one column."],
                ["Wide-column", "Sparse columns grouped under a row key, built for key lookups at high write rates."],
                ["Index", "A side structure from a lookup key to a location. It speeds one read and adds work to every write."],
                ["View", "A saved query. The engine runs it when you read."],
                ["Materialized view", "That query's result, stored and refreshed on a schedule or as data changes."],
                ["Schema-on-write", "The database checks the shape at insert and rejects a row that does not fit. Relational engines work this way."],
                ["Schema-on-read", "Files are stored as they arrived. The reader applies a schema, and bad records surface at query time. Raw lakes work this way."],
                ["Write-ahead log", "The change is appended to a log before it is applied. After a crash the engine replays the log to finish or undo."],
                ["Replica", "A copy the same database maintains for failover or for spreading reads."],
                ["Cache", "A fast copy that may miss or lag. A miss falls back to the source."],
                ["Derived store", "Search, graph, vector, and gold tables. Safe to rebuild from the system of record."],
                ["Catalog", "Names, schemas, owners, and permissions. Unity Catalog, Glue, and Hive are catalogs; the bytes may live elsewhere."],
                ["CDC", "Change data capture. A feed of inserts, updates, and deletes from a source, used to keep another store current."],
              ].map(([word, means]) => (
                <tr key={word} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                    {word}
                  </td>
                  <td className="px-4 py-3 text-sm text-faint">{means}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Freshness">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          Once a write commits, who gets to see it and how soon. The product decides which of
          these contracts a screen is allowed to lean on.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Transactional",
              body: "Commit returns only when the write is durable. The next read of that database sees it. Account posting, inventory, and entitlements need this.",
            },
            {
              label: "Snapshot",
              body: "A query sees one version of the table from start to finish. Warehouses and Delta tables work this way. The version can be a few minutes behind the operational system.",
            },
            {
              label: "Lagging copy",
              body: "A replica, cache, search index, or vector index catches up after the commit. The lag is the pipeline. Read the source when a stale answer is unacceptable.",
            },
          ].map((item) => (
            <div key={item.label} className="border border-line bg-surface px-4 py-5">
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="One fact, many stores">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          A customer account is written once, then copied into whatever shape each reader needs.
          When the copies disagree, the system of record wins and the copy is rebuilt.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal text-muted">Reader</th>
                <th className="px-4 py-3 font-normal text-muted">Question</th>
                <th className="px-4 py-3 font-normal text-muted">Store they hit</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Core application", "Post this payment, correctly, once", "Relational OLTP or a navigational core system"],
                ["Busy customer screen", "Show a balance in a millisecond", "Key-value cache, filled from the core"],
                ["Finance and risk", "Sum a year of payments by product", "Warehouse or lakehouse table"],
                ["Data scientist", "Replay raw history and build features", "Lake files and modeled tables"],
                ["Contact center", "Find this person from a fragment of a name", "Search index"],
                ["Financial crime", "Who is linked through devices and transfers", "Graph"],
                ["Control room", "Is authorization latency rising this minute", "Time series"],
                ["Internal assistant", "Which policy passages are about this case", "Vector index over documents"],
              ].map(([reader, question, store]) => (
                <tr key={reader} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                    {reader}
                  </td>
                  <td className="px-4 py-3 text-sm text-faint">{question}</td>
                  <td className="px-4 py-3 text-sm text-faint">{store}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Stores that sit beside databases">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          Enterprise data also lives in the shared infrastructure that sits around the databases.
          Pipelines are what move the bytes between them.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Object and file storage",
              body: "S3, ADLS, GCS, and file shares hold bytes by path: extracts, images, statements, model files, Parquet. A database or a table format on top is what makes a path queryable as a table. Overnight batch files are still how many institutions exchange data.",
            },
            {
              label: "Event log",
              body: "Kafka, Pulsar, and Kinesis keep an ordered, append-only log. Consumers read forward from an offset. A correction is a new event. The log connects systems of record to lakes, search, and caches. Stream SQL can read it; the stored form is the log itself.",
            },
            {
              label: "Federation",
              body: "A query engine sends SQL to the database that already holds the data and returns rows, with no copy. Useful for discovery and for a report that can tolerate the source's load. Heavy or repeated use is a reason to copy the data into an analytical store.",
            },
          ].map((item) => (
            <div key={item.label} className="border border-line bg-surface px-4 py-5">
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Choosing">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          Match the store to the question, the freshness you need, and the write rate. Most estates
          end up using several rows of this table at once.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal text-muted">The job</th>
                <th className="px-4 py-3 font-normal text-muted">Start with</th>
                <th className="px-4 py-3 font-normal text-muted">Because</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Read and write one record correctly", "Relational OLTP", "Transactions, keys, and constraints"],
                ["The same SQL, across regions or huge write volume", "Distributed SQL", "Shards plus consensus, still SQL"],
                ["Scan and aggregate years of history", "Warehouse or lakehouse", "Columnar files and cheap retention"],
                ["Keep raw history for many engines and for ML", "Lakehouse", "Open files, a table log, a shared catalog"],
                ["Each record has a different shape", "Document", "The schema lives with the document"],
                ["A value in under a millisecond, by exact key", "Key-value cache", "Memory, no joins, miss allowed"],
                ["Extreme writes, and you always know the key", "Wide-column", "Partition by that key"],
                ["The question is who is connected to whom", "Graph", "Hops are the query"],
                ["The question is what happened over a time window", "Time series", "Time is the index"],
                ["The question is which text matches", "Search", "Inverted index and ranking"],
                ["The question is what is similar in meaning", "Vector", "Nearest neighbor over embeddings"],
                ["A program on a device, or SQL on a laptop", "Embedded", "SQLite or DuckDB, no server"],
                ["The core system is already a hierarchy or keyed file", "Leave it; copy changes out", "CDC into a lake or warehouse"],
              ].map(([job, start, because]) => (
                <tr key={job} className="border-t border-line">
                  <td className="px-4 py-3 text-sm text-faint">{job}</td>
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                    {start}
                  </td>
                  <td className="px-4 py-3 text-sm text-faint">{because}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

const productInfo: Record<string, string> = {
  "Unity Catalog": "The permission fabric. It records who can see each table, model, and file, and it keeps the lineage and the audit.",
  "Delta Lake": "Open tables on cloud storage. Transactions, schema checks, and time travel sit on the files, and the other products read this copy.",
  Lakeflow: "Ingest and transform. It brings feeds in from core systems, cards, and payments, and it rebuilds tables on a schedule.",
  "Databricks SQL": "The warehouse. It runs the SQL behind dashboards, reports, and Genie questions.",
  Genie: "Plain questions over the governed tables. It turns a question into SQL and returns the answer from Databricks SQL.",
  Lakebase: "Managed Postgres for apps. The live row an app reads and writes sits here, next to the analytical copy.",
  MLflow: "The model registry. Each trained version, its files, and its signature are kept here.",
  "Model Serving": "A model behind an endpoint. One request in, one score or answer out.",
  "AI Gateway": "The front door for model calls. It applies permissions, limits, and guardrails, and it logs every call.",
  "Vector Search": "Search over embedded documents. It returns the passages closest in meaning to a question.",
  "Agent Bricks": "Build and evaluate agents on enterprise data. An agent retrieves rows or passages, calls a model, and returns an answer.",
};

function ExampleView() {
  const [tip, setTip] = useState<{ name: string; body: string; x: number; y: number } | null>(null);
  const rows: [string, string, string, string][] = [
    ["Identity", "Name, date of birth, address", "Delta Lake, Unity Catalog", "The copy the rest of the platform reads, and who is allowed to see it."],
    ["Balance", "Current account balance", "Lakeflow, Delta Lake", "Each change lands in the table."],
    ["Payments", "Each card payment and transfer", "Lakeflow, Delta Lake", "Each event is written as it arrives."],
    ["Hot counter", "Payments in the last hour", "Delta Lake", "The history of those events."],
    ["Live screen", "The offer on her app, and the profile the app reads", "Lakebase, Delta Lake", "One live row, and each write synced into the table."],
    ["Profile", "Products, channels, and the next offer, joined", "Lakeflow, Delta Lake, Databricks SQL, Genie", "The joined row is built, then read as a report or a question."],
    ["Score", "Fraud score on the latest payment", "Model Serving, MLflow, AI Gateway, Delta Lake", "The score comes back, the version is kept, the call is logged, and the row is stored."],
    ["Connections", "Devices, beneficiaries, and accounts she pays", "Delta Lake, Databricks SQL", "The edges are stored and joined."],
    ["Documents", "Passport scan, signed terms, statement PDFs", "Delta Lake, Vector Search, Agent Bricks", "The files, the passages, and the retrieval."],
    ["Answer", "Her NPS response", "Delta Lake, Genie, Databricks SQL", "The metric, read as a plain question."],
    ["Access", "Who opened her record", "Unity Catalog", "Every copy is registered, and each opening is recorded."],
  ];

  function showTip(event: ReactMouseEvent<HTMLElement>, name: string) {
    const body = productInfo[name];
    if (!body) return;
    const width = 288;
    const height = 132;
    let x = event.clientX + 14;
    let y = event.clientY + 16;
    if (x + width > window.innerWidth - 8) x = event.clientX - width - 12;
    if (y + height > window.innerHeight - 8) y = event.clientY - height - 12;
    setTip({ name, body, x: Math.max(8, x), y: Math.max(8, y) });
  }

  return (
    <div className="grid min-w-0 gap-6 *:min-w-0">
      <Section eyebrow="One person">
        <p className="mt-5 max-w-xl text-base leading-snug text-faint">
          Amina Okafor is customer 12. Her name, balance, payments, documents, and score each have a home, and the platform keeps a shared copy wherever more than one system reads the same fact.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal text-muted">Data</th>
                <th className="px-4 py-3 font-normal text-muted">The fact</th>
                <th className="px-4 py-3 font-normal text-muted">Product</th>
                <th className="px-4 py-3 font-normal text-muted">Where it lives</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([kind, fact, product, where]) => (
                <tr key={kind} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                    {kind}
                  </td>
                  <td className="px-4 py-3 text-sm text-faint">{fact}</td>
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                    {product.split(", ").map((name, index) => (
                      <span key={name}>
                        {index > 0 ? ", " : null}
                        <span
                          className="cursor-help underline decoration-dotted decoration-line underline-offset-[3px]"
                          onMouseEnter={(event) => showTip(event, name)}
                          onMouseMove={(event) => showTip(event, name)}
                          onMouseLeave={() => setTip(null)}
                        >
                          {name}
                        </span>
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm text-faint">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      {tip ? (
        <div
          className="pointer-events-none fixed z-50 w-72 border border-line bg-surface px-4 py-3 shadow-sm"
          style={{ left: tip.x, top: tip.y }}
        >
          <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{tip.name}</p>
          <p className="mt-1 text-sm leading-snug text-faint">{tip.body}</p>
        </div>
      ) : null}
    </div>
  );
}

function GenieView() {
  return (
    <div className="grid min-w-0 gap-6 *:min-w-0">
      <Section eyebrow="What it is">
        <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
          Genie is the place an analyst asks a question in plain language and gets an answer from the tables the company already trusts. It does not look through files and it does not invent a number. It writes SQL, a SQL warehouse runs that SQL, and the rows that come back are the answer.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
          A person can ask “what is our NPS this quarter?” or “break that down by region.” The second question is not a new search. Genie keeps the first SQL and changes it. The analyst can open the SQL, see the chart, and ask again. The same metric view feeds a dashboard, so the number in the chat and the number on the report are one definition.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
          Genie sits in the analyst column of the setup. The question enters at Genie, the SQL runs on Databricks SQL, and the rows are read from Delta Lake or Iceberg. Unity Catalog checks the signed-in user before a single row returns. Genie never writes a table. Lakeflow does that. Genie never opens the live app row in Lakebase.
        </p>
      </Section>

      <Section eyebrow="How a space is designed">
        <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
          An author, usually an analyst who knows the model, builds a Genie space before anyone asks a question. The space is the boundary. The model only knows the tables, the words, and the examples the author put in it. A wide-open warehouse makes a poor space. A space for regulatory reporting, with the certified tables and the certified definitions, makes a good one.
        </p>
        <CardGrid
          items={[
            {
              title: "Tables",
              body: "The author picks Unity Catalog tables and views. Comments and column descriptions travel with them. A column named bal_amt with no comment is a guess. A column described as “current ledger balance, in major units, one row per account” is an instruction.",
            },
            {
              title: "Instructions",
              body: "Plain text the model must follow. The fiscal year starts in April. Revenue excludes internal transfers. Never join customers to payments on name. If the question asks for a person who is not in the space, say so instead of scanning another schema.",
            },
            {
              title: "Example SQL",
              body: "A handful of real questions paired with the SQL the business already trusts. These are the patterns the model imitates: which table is the fact, how a date filter is written, how a ratio is rounded. Five careful examples beat a paragraph of advice.",
            },
            {
              title: "Metric views",
              body: "A named measure with one formula. NPS, exposure, past-due balance. Genie is told to use the metric instead of rebuilding it from raw columns. The dashboard uses the same view, so the chat and the report cannot drift apart.",
            },
            {
              title: "Trusted questions",
              body: "Some questions are too important to regenerate. The author saves the SQL, sometimes with a parameter such as region or month. When a new question matches, Genie runs that SQL. The model does not get a chance to rewrite a number the board already signed.",
            },
            {
              title: "Benchmarks",
              body: "A list of questions with the SQL, or the result, that should come back. After any change to instructions or examples, the author runs the list again. A change that makes one answer nicer and breaks ten others is rejected. This is how the space is maintained.",
            },
          ]}
        />
      </Section>

      <Section eyebrow="The harness">
        <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
          The model does not hold a connection to the warehouse. A harness wraps it. The harness is the code that prepares the question, calls the model, checks what the model wrote, runs it, and either repairs it or returns it. The model proposes. The harness disposes. Take the harness away and Genie is a chatbot guessing at columns.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal text-muted">Step</th>
                <th className="px-4 py-3 font-normal text-muted">What the harness does</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1. Assemble", "Packs the new question, the earlier questions in the thread, the prior SQL, the schemas, the instructions, the example SQL, and the metric definitions into one prompt. The model never sees the rest of the catalog."],
                ["2. Choose a path", "Asks the model whether this is a new question, a follow-up that should edit the previous statement, or a match for a trusted question. A match skips generation and runs the saved SQL."],
                ["3. Write SQL", "The model returns one SELECT. The harness accepts a read. It does not hand the model a tool that inserts, updates, deletes, or creates a table."],
                ["4. Check the grant", "Unity Catalog evaluates the statement as the person who asked, not as the author of the space. A missing grant stops the query. The model is not allowed to retry its way into another schema."],
                ["5. Run", "Databricks SQL executes the statement on the warehouse and returns rows. A long scan can be limited. The SQL text is kept, so the analyst can read exactly what ran."],
                ["6. Repair", "An unknown column, a bad join, or a cast error comes back as text. The harness shows that error to the model and asks for a corrected statement. It allows a few tries, then it stops and says the question could not be answered."],
                ["7. Answer", "Turns the rows into a table, a sentence, and usually a chart. The sentence is a reading of those rows. It is not a second guess from the model about numbers that were not returned."],
                ["8. Remember the thread", "Stores the question, the SQL, and the shape of the result. The next turn is sent with that state, so “only the north region” is a filter on the same query, not a fresh interpretation of the business."],
                ["9. Score the space", "Away from live questions, runs the benchmark list through the same steps and compares the SQL or the result with what the author saved. That score is how the author decides an edit to the instructions is safe."],
              ].map(([step, body]) => (
                <tr key={step} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">{step}</td>
                  <td className="px-4 py-3 text-sm text-faint">{body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="One question, end to end">
        <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
          An analyst asks, “What was NPS last quarter, and how does the north region compare?” The harness loads the customer-experience space: the response table, the region dimension, the instruction that NPS is the metric view and not an average someone might invent, and two example questions that already filter on quarter.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
          The model writes a SELECT against the metric view, grouped by region, limited to last quarter. Catalog checks that this analyst may read that view. The warehouse runs it. The harness returns a small table, a bar chart, and the sentence that names the figure. The analyst then says “exclude internal staff.” The harness sends the previous SQL with the new sentence. The model adds the predicate the instructions described. The warehouse runs the edited statement. Nothing is rewritten from scratch, and nothing is written back to the lake.
        </p>
      </Section>

      <Section eyebrow="What the harness refuses">
        <CardGrid
          items={[
            {
              title: "No writes",
              body: "The only statement that runs is a read. Building or correcting a table is a Lakeflow job, authored and reviewed as code, not a side effect of a question.",
            },
            {
              title: "No other schemas",
              body: "Tables outside the space are not in the prompt. A clever question cannot talk the model into a catalog the author did not select.",
            },
            {
              title: "No borrowed identity",
              body: "The warehouse uses the signed-in user. An author who can see salaries does not grant that view to everyone who can open the space.",
            },
            {
              title: "No invented measure",
              body: "Where a metric view exists, the harness points the model at it. The formula for NPS lives in one place. The model does not re-derive it from raw survey rows.",
            },
            {
              title: "No endless retry",
              body: "A broken statement is repaired a few times. After that the harness stops. It does not keep sampling the warehouse until a number appears.",
            },
            {
              title: "No silent change",
              body: "Instructions and examples are edited by the author. The benchmark runs before that edit is trusted. A live user does not retune the space by chatting.",
            },
          ]}
        />
      </Section>
    </div>
  );
}

const hoverInfo: Record<string, string> = {
  Agents:
    "Agent Bricks is where a team builds an agent, checks it on real questions, and runs it. The agent retrieves rows or passages, calls a model, and returns an answer or a next step.",
  "AI and models":
    "Foundation Model APIs and Model Serving host the model behind an endpoint. AI Gateway stands in front and logs the caller, the cost, and the limit. Vector Search finds the passages the agent should read.",
  Analytics:
    "Databricks SQL runs the warehouse queries behind dashboards and reports. Genie turns a plain question into that SQL. Metric views keep one definition of a number, so a question and a dashboard agree.",
  "Machine learning":
    "MLflow records each training run and the model version it produced. The feature store holds the values a model reads at training and again when it scores. Tracking is the history of which run became which version.",
  "Data and pipelines":
    "This is how raw feeds become tables. Lakeflow brings in changes from core systems, cards, and payments, then cleans and joins them on a schedule. Lakeflow Designer builds that same pipeline without code. Lakebase is the managed Postgres an app reads and writes, and each change syncs into Delta Lake so the pipelines and the reports see it.",
  Storage:
    "Delta Lake and Iceberg are the open table formats on the enterprise's own cloud storage. A transaction log sits on the Parquet files, so a commit finishes as a whole and an earlier version can be reopened. Iceberg readers reach the same tables through UniForm.",
  "Unity Catalog":
    "Every table, model, file, and function is registered here. A query asks Catalog before it runs. Lineage shows which job wrote a table and which model was trained on it. A missing grant stops the query.",
  "Delta Lake, Iceberg":
    "The bytes are Parquet files in the enterprise cloud account. The table format adds a log of which files currently form the table, so readers get transactions, schema changes, and time travel. The same files can be read as Iceberg.",
  Lakeflow:
    "A feed of card payments lands continuously. A pipeline cleans it, joins the customer, and commits a silver table on a schedule. Lakeflow Designer draws that pipeline without code.",
  "Databricks SQL":
    "This is the warehouse that runs the SQL for a regulatory report or a dashboard. It reads the Delta tables Lakeflow wrote, applies the Catalog grant, and scales down when the report is quiet.",
  Genie:
    "An analyst asks “what is our NPS?” Genie writes the SQL against the metric view, the warehouse runs it, and the number comes back. A follow-up stays on the same governed tables.",
  Lakebase:
    "The offer screen reads and writes one live row in Postgres. That write syncs into Delta Lake, so the next pipeline and the next report see the offer the app just made.",
  "MLflow, Model Serving":
    "A training run logs a model version in MLflow, with its files and its signature. Model Serving hosts a named version on an endpoint. One payment goes in, and one fraud score comes out.",
  "AI Gateway":
    "The call from an agent passes through the gateway before it reaches the model. The gateway checks who is calling, applies the spend limit, and stores the prompt, the model, and the cost.",
  "Vector Search":
    "Policy documents are split into passages and embedded. A question returns the passages closest in meaning, and the agent reads those before it answers.",
  "Agent Bricks":
    "A compliance agent is built here and checked on past cases. It retrieves the relevant rows and passages, calls the model through the gateway, and drafts the review.",
};

export function TtsSwitch() {
  const [view, setView] = useState<View>("summary");
  const [hoverTip, setHoverTip] = useState<{ title: string; body: string; x: number; y: number } | null>(null);

  function showHover(event: ReactMouseEvent<HTMLElement>, title: string) {
    const body = hoverInfo[title];
    if (!body) return;
    const width = 320;
    const height = 190;
    let x = event.clientX + 14;
    let y = event.clientY + 16;
    if (x + width > window.innerWidth - 8) x = event.clientX - width - 12;
    if (y + height > window.innerHeight - 8) y = event.clientY - height - 12;
    setHoverTip({ title, body, x: Math.max(8, x), y: Math.max(8, y) });
  }

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
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Data Ecosystem : 6 layers">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              One cloud platform for everything your data does: storage, pipelines, analytics, machine learning, and AI agents, all kept under a single catalog that handles permissions, lineage, and discovery.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Layer</th>
                    <th className="px-4 py-3 font-normal text-muted">Products</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Agents", "Agent Bricks · build, evaluate and run agents on enterprise data"],
                    ["AI and models", "Foundation Model APIs · Model Serving · AI Gateway · Vector Search"],
                    ["Analytics", "Databricks SQL · AI/BI dashboards · Genie · metric views"],
                    ["Machine learning", "MLflow · feature store · model training and tracking"],
                    ["Data and pipelines", "Lakeflow · Lakeflow Designer · Lakebase (managed Postgres)"],
                    ["Storage", "Delta Lake and Iceberg tables on cloud object storage"],
                  ].map(([layer, products]) => (
                    <tr key={layer} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <span
                          className="cursor-help underline decoration-dotted decoration-line underline-offset-[3px]"
                          onMouseEnter={(event) => showHover(event, layer)}
                          onMouseMove={(event) => showHover(event, layer)}
                          onMouseLeave={() => setHoverTip(null)}
                        >
                          {layer}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{products}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Products">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              What each product actually does, and why it matters to an enterprise.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Product</th>
                    <th className="px-4 py-3 font-normal text-muted">What it does</th>
                    <th className="px-4 py-3 font-normal text-muted">Why an enterprise cares</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Unity Catalog", "Permissions, lineage, row and column masks", "Proves to auditors who saw what"],
                    ["Delta Lake, Iceberg", "Open table formats on cloud storage", "Open formats limit lock-in"],
                    ["Lakeflow", "Ingest and transform data, also no-code", "Feeds from core systems, cards, payments"],
                    ["Databricks SQL", "Warehouse queries and dashboards", "Regulatory and management reporting"],
                    ["Genie", "Turns plain questions into SQL", '"What is our NPS?" without SQL'],
                    ["Lakebase", "Managed Postgres for apps and agents", "App state next to analytical data"],
                    ["MLflow, Model Serving", "Train, track and serve models", "Fraud, credit scoring, churn"],
                    ["AI Gateway", "Permissions, limits, guardrails, usage logs", "Governed access to LLMs"],
                    ["Vector Search", "Search over embedded documents", "Policy and procedure assistants"],
                    ["Agent Bricks", "Build and evaluate agents on data", "Compliance reviews, case write-ups"],
                  ].map(([product, what, why]) => (
                    <tr key={product} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <span
                          className="cursor-help underline decoration-dotted decoration-line underline-offset-[3px]"
                          onMouseEnter={(event) => showHover(event, product)}
                          onMouseMove={(event) => showHover(event, product)}
                          onMouseLeave={() => setHoverTip(null)}
                        >
                          {product}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{what}</td>
                      <td className="px-4 py-3 text-sm text-faint">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Seven workflows">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Common use cases, and the Databricks products behind each one.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Use case</th>
                    <th className="px-4 py-3 font-normal text-muted">What gets built</th>
                    <th className="px-4 py-3 font-normal text-muted">Databricks pieces</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Fraud and AML", "Real-time scoring of card and transfer events; alert triage", "Lakeflow streaming, MLflow, Model Serving"],
                    ["Credit risk", "Scorecards, IFRS 9 expected loss, stress tests", "Delta, MLflow, lineage for model audit"],
                    ["Customer 360", "One profile across products and channels; next-best-offer", "Lakeflow, Unity Catalog, Lakebase"],
                    ["Regulatory reporting", "Repeatable pipelines, lineage from source to report", "Lakeflow, Databricks SQL, lineage"],
                    ["Questions on data", "NPS, churn, branch sales in plain language", "Metric views, Genie"],
                    ["Documents", "Vendor due diligence, policy Q&A, contract review", "Vector Search, Agent Bricks"],
                    ["Payments data", "Merchant analytics, risk, insight products", "Delta Sharing, Databricks SQL"],
                  ].map(([useCase, what, pieces]) => (
                    <tr key={useCase} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {useCase}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{what}</td>
                      <td className="px-4 py-3 text-sm text-faint">{pieces}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          {hoverTip ? (
            <div
              className="pointer-events-none fixed z-50 w-80 border border-line bg-surface px-4 py-3 shadow-sm"
              style={{ left: hoverTip.x, top: hoverTip.y }}
            >
              <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">{hoverTip.title}</p>
              <p className="mt-1 text-sm leading-snug text-faint">{hoverTip.body}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {view === "platform" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="How it connects">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Four different flows, one shared set of Delta tables underneath, and Unity Catalog checking every one of them.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  n: "01",
                  title: "Engineers",
                  body: "Notebooks and jobs run on Spark, which writes Delta tables.",
                },
                {
                  n: "02",
                  title: "Analysts",
                  body: "Genie and dashboards send SQL to the warehouse, which reads the same tables.",
                },
                {
                  n: "03",
                  title: "Agents",
                  body: "Agents call models through AI Gateway; serving loads MLflow models and searches documents.",
                },
                {
                  n: "04",
                  title: "Apps",
                  body: "Apps keep live data in Lakebase, synced to Delta.",
                },
              ].map((item) => (
                <div key={item.n} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {item.n} {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-snug text-faint">
              Unity Catalog checks permissions on every service and table.
            </p>
          </Section>

          <Section eyebrow="Account and workspaces">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Think of it as one account for the whole company, one Unity Catalog metastore in each
              region, and a workspace for each environment or team.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Account",
                  body: "Users, groups and billing, synced from the company directory. One per company.",
                },
                {
                  label: "Workspace",
                  body: "Where people work: notebooks, jobs, dashboards. Usually one per environment or team.",
                },
                {
                  label: "Unity Catalog",
                  body: "One shared catalog of all data for every workspace in a region. Names read catalog.schema.table.",
                },
              ].map((item) => (
                <div key={item.label} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section eyebrow="Five kinds of compute">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Storage and compute are kept separate, so every kind of compute reads the same tables
              and you size and pay for each workload on its own terms.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Compute</th>
                    <th className="px-4 py-3 font-normal text-muted">Used for</th>
                    <th className="px-4 py-3 font-normal text-muted">How it runs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["All-purpose clusters", "Interactive notebooks and exploration", "Spark clusters people start and share"],
                    ["Jobs compute", "Scheduled pipelines and batch jobs", "Starts for a job, stops when it ends"],
                    ["SQL warehouses", "BI dashboards, SQL queries, Genie", "Photon engine; classic, pro or serverless"],
                    ["Serverless notebooks and jobs", "Same work without managing clusters", "Databricks runs and scales the machines"],
                    ["Model Serving endpoints", "Real-time model and LLM calls", "Autoscaling endpoints, CPU or GPU"],
                  ].map(([compute, use, how]) => (
                    <tr key={compute} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {compute}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{use}</td>
                      <td className="px-4 py-3 text-sm text-faint">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section eyebrow="Existing databases">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Copy the data in, or leave it where it sits and query from there. Either way, on-prem
              databases need a network path from the cloud: a VPN or a private line.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Ingest · CDC",
                  product: "Lakeflow Connect",
                  body: "Reads changes from SQL Server, Oracle, PostgreSQL or MySQL and keeps a copy in Delta tables, continuously updated. Usual path for reporting and ML.",
                },
                {
                  label: "Federate",
                  product: "Lakehouse Federation",
                  body: "Queries run against the source over JDBC, read-only, governed by Unity Catalog. Nothing is copied. For ad hoc reporting and proofs of concept.",
                },
                {
                  label: "Other routes",
                  product: "Custom or partner",
                  body: "Spark JDBC jobs, scheduled query-based connectors, or partner CDC tools such as Fivetran, Qlik or Debezium with Kafka.",
                },
              ].map((item) => (
                <div key={item.label} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                    {item.product}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section eyebrow="Three ways to start">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Most companies work through all three in order: coexist first, land the priority
              data, then migrate system by system.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "A · Coexist",
                  title: "Query in place",
                  body: "Federate existing databases and Hive metastores into Unity Catalog. No data moves; read-only. Best for discovery, quick wins, proofs of concept.",
                },
                {
                  label: "B · Land and expand",
                  title: "Recommended start",
                  body: "Stream changes from priority sources into bronze with CDC. Build new workloads on Databricks; legacy keeps running. Best for new analytics, ML and AI without disruption.",
                },
                {
                  label: "C · Migrate and retire",
                  title: "Move workloads",
                  body: "Convert warehouse SQL and ETL, reconcile results, run in parallel, then switch off the old system. Best for cutting licence and hardware cost.",
                },
              ].map((item) => (
                <div key={item.label} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section eyebrow="Legacy component mapping">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Where each legacy component lands, and the tooling that handles the move.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Legacy component</th>
                    <th className="px-4 py-3 font-normal text-muted">Databricks route</th>
                    <th className="px-4 py-3 font-normal text-muted">Tooling</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Operational databases", "Stay; CDC into bronze or federate", "Lakeflow Connect, Federation"],
                    ["Enterprise data warehouse", "Migrate to Databricks SQL over time", "Lakebridge analyze, convert, reconcile"],
                    ["Hadoop and Hive", "Federate the metastore, then upgrade tables", "Hive metastore federation, UCX"],
                    ["ETL (Informatica, DataStage)", "Keep and land into bronze, or convert", "Lakeflow pipelines, Lakebridge"],
                    ["Schedulers (Control-M, Airflow)", "Keep, calling Databricks jobs, or move", "Jobs API, Lakeflow Jobs"],
                    ["SAS and R models", "Rebuild in Python, track in MLflow", "MLflow, Model Serving"],
                    ["BI tools", "Keep; point at SQL warehouses", "JDBC/ODBC, partner connectors"],
                    ["Catalogue (Collibra etc.)", "Keep; sync metadata with Unity Catalog", "Partner integrations, APIs"],
                    ["Active Directory or Entra ID", "Sync users and groups to the account", "SCIM, single sign-on"],
                  ].map(([legacy, route, tooling]) => (
                    <tr key={legacy} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {legacy}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{route}</td>
                      <td className="px-4 py-3 text-sm text-faint">{tooling}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      ) : null}

      {view === "data" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Delta Lake">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Plain files that behave like database tables: Parquet underneath, with a transaction
              log on top. Iceberg readers get in through UniForm.
            </p>
            <CardGrid
              items={[
                {
                  title: "ACID transactions",
                  body: "A failed job leaves the previous version intact; readers never see half-written data.",
                },
                {
                  title: "Schema control",
                  body: "Bad columns are rejected; planned changes evolve the schema safely.",
                },
                {
                  title: "Time travel",
                  body: "Query or restore a table as it was at an earlier version or time.",
                },
                {
                  title: "Merge and upserts",
                  body: "Apply inserts, updates and deletes, as from a CDC feed.",
                },
                {
                  title: "Change data feed",
                  body: "Downstream jobs read only the rows that changed.",
                },
                {
                  title: "Open format",
                  body: "Parquet files plus a transaction log; Iceberg readers via UniForm.",
                },
              ]}
            />
          </Section>

          <Section eyebrow="Medallion architecture">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              A common naming pattern: prod.sales_bronze, prod.sales_silver, prod.sales_gold.
              Access is granted layer by layer, and most people only ever see gold.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    {["Bronze", "Silver", "Gold"].map((h) => (
                      <th key={h} className="px-4 py-3 font-normal text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Raw, as received", "Cleaned, validated", "Business-ready"],
                    ["Full history kept", "Types and keys fixed", "Aggregates, metrics"],
                    ["Replayable", "Duplicates removed", "Data products"],
                    ["No business logic", "Sources joined", "Feeds BI, Genie, ML"],
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-line">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-sm text-faint">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section eyebrow="Unity Catalog">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              A single place to handle permissions, lineage, audit, discovery, and sharing across
              every workspace you run.
            </p>
            <CardGrid
              items={[
                {
                  title: "Permissions",
                  body: "SQL GRANTs on catalogs, schemas and tables, inherited downwards; groups from the company directory.",
                },
                {
                  title: "Row and column rules",
                  body: "Row filters and column masks hide records or fields by user or group.",
                },
                {
                  title: "Lineage",
                  body: "Tracks which jobs, notebooks and dashboards read and write each table, down to columns.",
                },
                {
                  title: "Audit",
                  body: "System tables record who accessed what, query history and costs.",
                },
                {
                  title: "Discovery",
                  body: "Search, descriptions, tags and classification of sensitive data.",
                },
                {
                  title: "Sharing",
                  body: "Delta Sharing gives other platforms or companies read access without copying.",
                },
              ]}
            />
          </Section>
          <ExampleView />
        </div>
      ) : null}

      {view === "databases" ? <DatabasesView /> : null}
      {view === "genie" ? <GenieView /> : null}

      {view === "demo" ? (
        <div className="flex min-w-0 flex-col">
          <TtsDemo />
        </div>
      ) : null}
      {view === "setup" ? <DatabricksConnectDiagram /> : null}
    </div>
  );
}
