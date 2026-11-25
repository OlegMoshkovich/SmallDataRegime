"use client";

import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { TtsDemo } from "@/components/tts-demo";

const views = [
  { id: "summary", label: "Summary" },
  { id: "platform", label: "Platform" },
  { id: "data", label: "Data" },
  { id: "databases", label: "Databases" },
  { id: "bank", label: "Workflows" },
  { id: "legacy", label: "Legacy" },
  { id: "implement", label: "Implement" },
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
  x, y, accent = false, label, label2, sublabel, detail, info, onShow, onHide, onPress,
}: {
  x: number; y: number; accent?: boolean; label: string; label2?: string; sublabel?: string;
  detail?: string; info?: string;
  onShow?: (e: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
  onHide?: () => void;
  onPress?: (e: ReactMouseEvent<SVGGElement>, title: string, body: string) => void;
}) {
  const cls = `font-mono text-[11px] tracking-tight uppercase ${accent ? "fill-accent" : "fill-foreground"}`;
  const l1y = label2 ? y + 16 : y + 22;
  const nodeLabel = label2 ? `${label} ${label2}` : label;
  const handlers = info && onShow && onHide && onPress ? {
    className: "cursor-help",
    onMouseEnter: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info),
    onMouseMove: (e: ReactMouseEvent<SVGGElement>) => onShow(e, nodeLabel, info),
    onMouseLeave: onHide,
    onClick: (e: ReactMouseEvent<SVGGElement>) => onPress(e, nodeLabel, info),
  } : {};
  return (
    <g {...handlers}>
      <rect x={x - 66} y={y - 26} width={132} height={label2 ? (detail ? 86 : 68) : (detail ? 72 : 56)} fill="transparent" />
      <DbCube x={x} y={y} accent={accent} />
      <text x={x} y={l1y} textAnchor="middle" className={cls}>{label}</text>
      {label2 ? <text x={x} y={l1y + 13} textAnchor="middle" className={cls}>{label2}</text> : null}
      {sublabel ? <text x={x} y={l1y + (label2 ? 26 : 13)} textAnchor="middle" className="fill-muted font-mono text-[10px]">{sublabel}</text> : null}
      {detail ? <text x={x} y={l1y + (label2 ? 39 : 26)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{detail}</text> : null}
    </g>
  );
}

function DatabricksConnectDiagram() {
  const dash = "5 4";
  const ucX = 148;
  const c = [300, 448, 596, 744];
  const cY = 202;
  const pY = 358;
  const sY = 508;

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

  const node = { onShow: showTip, onHide: hideTip, onPress: pressTip };

  return (
    <section ref={sectionRef} className="relative border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        How it connects
      </p>
      <div className="mt-6 max-w-full min-w-0 overflow-x-auto">
        <svg
          viewBox="0 0 1120 580"
          className="block h-auto w-full min-w-[48rem]"
          role="img"
          aria-label="Databricks platform connection diagram showing four access flows through control, compute, and storage layers, governed by Unity Catalog."
        >
          {/* Layer backgrounds */}
          <rect x="90" y="152" width="722" height="120" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="308" width="722" height="116" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="460" width="722" height="108" fill="#f4f3f2" stroke="#d6d3d2" />

          {/* Left side labels */}
          <text x="5" y="66" className="fill-foreground font-mono text-[11px] uppercase">ACCESS</text>
          <text x="5" y="81" className="fill-muted font-mono text-[10px]">Users, tools</text>
          <line x1="5" y1="96" x2="82" y2="96" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="187" className="fill-foreground font-mono text-[11px] uppercase">CONTROL</text>
          <text x="5" y="202" className="fill-muted font-mono text-[10px]">Run by</text>
          <text x="5" y="215" className="fill-muted font-mono text-[10px]">Databricks</text>
          <line x1="5" y1="262" x2="82" y2="262" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="343" className="fill-foreground font-mono text-[11px] uppercase">COMPUTE</text>
          <text x="5" y="358" className="fill-muted font-mono text-[10px]">Your cloud or</text>
          <text x="5" y="371" className="fill-muted font-mono text-[10px]">serverless</text>
          <line x1="5" y1="412" x2="82" y2="412" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="494" className="fill-foreground font-mono text-[11px] uppercase">STORAGE</text>
          <text x="5" y="509" className="fill-muted font-mono text-[10px]">Your cloud</text>
          <text x="5" y="522" className="fill-muted font-mono text-[10px]">storage</text>
          <line x1="5" y1="558" x2="82" y2="558" stroke="#d6d3d2" strokeWidth="0.8" />

          {/* Unity Catalog orange connections */}
          <path d={`M${ucX + 12},${cY - 10} H${c[3] + 10}`} fill="none" stroke="#FF5C00" strokeWidth="1.2" strokeDasharray={dash} />
          <path d={`M${ucX},${cY + 4} V574`} fill="none" stroke="#FF5C00" strokeWidth="1.2" strokeDasharray={dash} />
          <path d={`M${ucX},281 l6,9 l-6,9 l-6,-9 Z`} fill="#FF5C00" />
          <path d={`M${ucX},442 l6,9 l-6,9 l-6,-9 Z`} fill="#FF5C00" />

          {/* Access → control band-top: arrows stop at band top y=152 */}
          {c.map((cx, i) => (
            <g key={cx}>
              {/* labels are at y=79 and y=92 — split line to skip them */}
              <line x1={cx} y1="66" x2={cx} y2="74" stroke="#101010" strokeWidth="1.2" fill="none" />
              <line x1={cx} y1="98" x2={cx} y2="108" stroke="#101010" strokeWidth="1.2" fill="none" />
              <circle cx={cx} cy="118" r="9" fill="#101010" />
              <text x={cx} y="122" textAnchor="middle" fill="white" className="font-mono text-[11px]">{i + 1}</text>
              <line x1={cx} y1="128" x2={cx} y2="146" stroke="#101010" strokeWidth="1.2" fill="none" />
              <path d={`M${cx - 3.5},146 l3.5,6 l3.5,-6`} fill="none" stroke="#101010" strokeWidth="1.2" />
            </g>
          ))}

          {/* Control → compute: gap y=272 to y=308 */}
          {c.map((cx) => (
            <g key={cx}>
              <line x1={cx} y1="278" x2={cx} y2="302" stroke="#101010" strokeWidth="1.2" fill="none" />
              <path d={`M${cx - 3.5},302 l3.5,6 l3.5,-6`} fill="none" stroke="#101010" strokeWidth="1.2" />
            </g>
          ))}

          {/* Compute → storage: gap y=424 to y=460 */}
          {[c[0], c[2], c[3]].map((cx) => (
            <g key={cx}>
              <line x1={cx} y1="430" x2={cx} y2="454" stroke="#101010" strokeWidth="1.2" fill="none" />
              <path d={`M${cx - 3.5},454 l3.5,6 l3.5,-6`} fill="none" stroke="#101010" strokeWidth="1.2" />
            </g>
          ))}
          <path d={`M${c[1]},424 L${c[0]},460`} fill="none" stroke="#101010" strokeWidth="1.2" strokeDasharray={dash} />

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
              <text x={cx} y="79" textAnchor="middle" className="fill-foreground font-mono text-[11px] uppercase">{l1}</text>
              <text x={cx} y="92" textAnchor="middle" className="fill-foreground font-mono text-[11px] uppercase">{l2}</text>
            </g>
          ))}

          {/* Control layer nodes */}
          <DbNode x={ucX} y={cY} accent label="UNITY" label2="CATALOG"
            detail="permission fabric"
            info="Unity Catalog is the single governance layer. Every table, model, file and function is registered here. Access policies, lineage, and audit logs all flow through it regardless of which service runs the query."
            {...node} />
          <DbNode x={c[0]} y={cY} label="NOTEBOOKS" label2="JOBS"
            detail="code and pipelines"
            info="Interactive notebooks for exploration and development. Jobs schedules them as production pipelines on Spark clusters. Data engineers write bronze-to-silver transformations here."
            {...node} />
          <DbNode x={c[1]} y={cY} label="GENIE" label2="AI/BI"
            detail="natural language BI"
            info="Genie lets analysts ask plain-language questions and get answers from Delta Tables without writing SQL. The AI/BI dashboard layer turns metric views into self-service reports."
            {...node} />
          <DbNode x={c[2]} y={cY} label="AGENTS" label2="AI GATEWAY"
            detail="agent and model routing"
            info="Agents AI is a framework for building, evaluating, and deploying agentic workflows on enterprise data. AI Gateway sits in front of model serving to enforce rate limits, cost controls, and audit logging on every model call."
            {...node} />
          <DbNode x={c[3]} y={cY} label="DATABRICKS" label2="APPS"
            detail="hosted web apps"
            info="Databricks Apps lets teams deploy internal web applications (Python, React) directly on the Databricks platform. They inherit Unity Catalog permissions and can query warehouses or call models without extra infrastructure."
            {...node} />

          {/* Compute layer nodes */}
          <DbNode x={c[0]} y={pY} label="SPARK" label2="CLUSTERS"
            detail="distributed processing"
            info="Apache Spark clusters run notebooks and jobs at scale. Auto-scaling pools keep idle time low. All reads and writes go through Delta Lake, so ACID guarantees hold even when hundreds of tasks run in parallel."
            {...node} />
          <DbNode x={c[1]} y={pY} label="SQL" label2="WAREHOUSE"
            detail="serverless SQL engine"
            info="Databricks SQL Warehouse is an optimised, serverless query engine for BI workloads. It auto-scales to zero when idle. Genie, dashboards, and direct JDBC/ODBC connections all hit the warehouse, which reads Delta Tables in object storage."
            {...node} />
          <DbNode x={c[2]} y={pY} label="MODEL" label2="SERVING"
            detail="real-time inference"
            info="Model Serving hosts MLflow-registered models behind a REST endpoint. It auto-scales to handle burst traffic and can serve foundation models from the Foundation Model APIs alongside custom fine-tuned models."
            {...node} />
          <DbNode x={c[3]} y={pY} label="LAKEBASE" label2="POSTGRES"
            detail="managed Postgres"
            info="Lakebase is a managed Postgres that keeps operational data in sync with Delta Lake. Apps write live transactional data to Postgres; Lakebase streams those changes into bronze tables so batch and real-time pipelines share one truth."
            {...node} />

          {/* Storage layer nodes */}
          <DbNode x={c[0]} y={sY} label="DELTA TABLES" sublabel="shared by 1 and 2"
            detail="ACID object storage"
            info="Delta Lake adds transactions, schema enforcement, and time-travel on top of Parquet files in cloud object storage. Spark writes them; the SQL Warehouse reads them. Both user groups query the same physical data."
            {...node} />
          <DbNode x={c[2]} y={sY} label="MODELS" sublabel="MLflow, docs"
            detail="model and file registry"
            info="The MLflow Model Registry stores versioned model artifacts (weights, signatures, conda envs). Feature tables and vector indexes also live here. Model Serving loads directly from this registry."
            {...node} />
          <DbNode x={c[3]} y={sY} label="SYNCED" sublabel="to Delta"
            detail="Postgres CDC to Delta"
            info="Changes from Lakebase Postgres are streamed into Delta Tables via CDC. Business apps get low-latency Postgres reads while analytics pipelines and AI features consume the same data as Delta without ETL delay."
            {...node} />

          {/* Right legend */}
          <text x="845" y="166" className="fill-muted font-mono text-[11px] uppercase">HOW TO READ IT</text>
          {([
            { y: 192, lines: ["Engineers' notebooks and", "jobs run on Spark, which", "writes Delta tables."] },
            { y: 232, lines: ["Genie and dashboards send", "SQL to the warehouse,", "which reads the same tables."] },
            { y: 320, lines: ["Agents call models through", "AI Gateway; serving loads", "MLflow models and searches", "documents."] },
            { y: 400, lines: ["Apps keep live data in", "Lakebase, synced to Delta."] },
          ] as { y: number; lines: string[] }[]).map((item, i) => (
            <g key={item.y}>
              <circle cx="855" cy={item.y} r="9" fill="#101010" />
              <text x="855" y={item.y + 4} textAnchor="middle" fill="white" className="font-mono text-[11px]">{i + 1}</text>
              {item.lines.map((line, j) => (
                <text key={j} x="870" y={item.y + (j * 14) + 4} className="fill-faint font-mono text-[11px]">{line}</text>
              ))}
            </g>
          ))}
          <line x1="845" y1="468" x2="863" y2="468" stroke="#FF5C00" strokeWidth="1.5" />
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
          <p className="mt-1 text-sm leading-snug text-faint">{tip.body}</p>
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
    body: "The bytes live as files, usually Parquet, in object storage (S3, ADLS, GCS). A table format — Delta, Iceberg, or Hudi — adds a log that says which files currently form the table, so readers get transactions, schema changes, and time travel. A catalog maps the name prod.payments.transactions to those files and holds permissions. Spark, Trino, a warehouse, or Python can read the same table. Raw files can sit beside tables: the reader supplies the schema later (schema-on-read). This is the shared history under analytics and models, and a poor place to authorize a payment.",
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
          A database keeps data, finds it by a known access pattern, and lets many programs share
          it. Enterprises run several, because each reader asks a different question of the same
          fact.
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
          Storage is the layout that makes one kind of read cheap. Retrieval is the path from a
          question back to those bytes. A point read uses an index and returns one record. A scan
          reads a column or a set of files and aggregates.
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
          The families below cover the types enterprises actually run. The query column is the
          access style each one is built around.
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
          A one-line query, then the layout and the job. Products named here are the ones large
          organizations run today.
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
          These words describe layout, freshness, and who owns the bytes. They apply across
          families.
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
          After a commit, who can see the write, and how soon. The product decides which of these
          contracts a screen is allowed to depend on.
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
          A customer account is written once and then copied into the shape each reader needs. When
          copies disagree, the system of record wins and the copy is rebuilt.
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
          Enterprise data also lives in systems that are shared infrastructure around the databases.
          Pipelines move bytes between them.
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
          Match the store to the question, the freshness, and the write rate. Most estates use
          several rows of this table at once.
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

export function TtsSwitch() {
  const [view, setView] = useState<View>("summary");

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div
          className="ml-auto flex w-fit max-w-full flex-wrap justify-end gap-2 lg:gap-0 lg:border lg:border-line"
          role="group"
          aria-label="View"
        >
          {views.map((item, index) => {
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

      {view === "summary" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Data Ecosystem : 6 layers">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              One cloud platform for data storage, pipelines, analytics, machine learning and AI
              agents, all governed by Unity Catalog. Every layer shares one catalog. Unity Catalog
              governs permissions, lineage, and discovery across all of them.
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
                        {layer}
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
              What each product does and why an enterprise cares.
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
                    ["Delta Lake, Iceberg", "Open table formats on cloud storage", "Open formats limit lock-in"],
                    ["Unity Catalog", "Permissions, lineage, row and column masks", "Proves to auditors who saw what"],
                    ["Lakeflow", "Ingest and transform data, also no-code", "Feeds from core systems, cards, payments"],
                    ["Lakebase", "Managed Postgres for apps and agents", "App state next to analytical data"],
                    ["Databricks SQL", "Warehouse queries and dashboards", "Regulatory and management reporting"],
                    ["Genie", "Turns plain questions into SQL", '"What is our NPS?" without SQL'],
                    ["MLflow, Model Serving", "Train, track and serve models", "Fraud, credit scoring, churn"],
                    ["AI Gateway", "Permissions, limits, guardrails, usage logs", "Governed access to LLMs"],
                    ["Vector Search", "Search over embedded documents", "Policy and procedure assistants"],
                    ["Agent Bricks", "Build and evaluate agents on data", "Compliance reviews, case write-ups"],
                  ].map(([product, what, why]) => (
                    <tr key={product} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {product}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{what}</td>
                      <td className="px-4 py-3 text-sm text-faint">{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      ) : null}

      {view === "platform" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="How it connects">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Four flows share the same Delta tables and are all checked by Unity Catalog.
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
              One account per company, one Unity Catalog metastore per region, one or more
              workspaces per environment or team.
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
              Storage and compute are separate: every kind of compute reads the same tables, so you
              size and pay for each workload on its own.
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
              Copy the data in, or query it where it sits. On-prem databases need a network path
              from the cloud: VPN or a private line.
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
        </div>
      ) : null}

      {view === "data" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Delta Lake">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Files that behave like database tables. Parquet files plus a transaction log;
              Iceberg readers via UniForm.
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
              Access is granted per layer; most users only see gold.
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
              One governance layer for permissions, lineage, audit, discovery, and sharing across
              every workspace.
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
        </div>
      ) : null}

      {view === "databases" ? <DatabasesView /> : null}

      {view === "bank" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Seven enterprise workloads">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Common use cases at enterprises and the Databricks products each one uses.
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
                    [
                      "Fraud and AML",
                      "Real-time scoring of card and transfer events; alert triage",
                      "Lakeflow streaming, MLflow, Model Serving",
                    ],
                    [
                      "Credit risk",
                      "Scorecards, IFRS 9 expected loss, stress tests",
                      "Delta, MLflow, lineage for model audit",
                    ],
                    [
                      "Customer 360",
                      "One profile across products and channels; next-best-offer",
                      "Lakeflow, Unity Catalog, Lakebase",
                    ],
                    [
                      "Regulatory reporting",
                      "Repeatable pipelines, lineage from source to report",
                      "Lakeflow, Databricks SQL, lineage",
                    ],
                    [
                      "Questions on data",
                      "NPS, churn, branch sales in plain language",
                      "Metric views, Genie",
                    ],
                    [
                      "Documents",
                      "Vendor due diligence, policy Q&A, contract review",
                      "Vector Search, Agent Bricks",
                    ],
                    [
                      "Payments data",
                      "Merchant analytics, risk, insight products",
                      "Delta Sharing, Databricks SQL",
                    ],
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

        </div>
      ) : null}

      {view === "legacy" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Three ways to start">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Most companies use all three in sequence: coexist first, land priority data, then
              migrate system by system.
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
              Where each legacy component goes and what tooling handles the transition.
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

      {view === "implement" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Foundation">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Set up before any data moves. Each item is a prerequisite for the phases that follow.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border border-line bg-surface px-4 py-5">
                <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                  Network and security
                </p>
                <ul className="mt-3 grid gap-2">
                  {[
                    "Workspaces in your own cloud network",
                    "Private connectivity, no public endpoints",
                    "Network path to on-prem sources (VPN or private line)",
                    "Customer-managed encryption keys",
                    "IP access lists and egress rules",
                  ].map((item) => (
                    <li key={item} className="text-sm leading-snug text-faint">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-line bg-surface px-4 py-5">
                <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                  Platform and operations
                </p>
                <ul className="mt-3 grid gap-2">
                  {[
                    "Unity Catalog metastore and catalog design",
                    "Users and groups synced from the directory",
                    "Cluster and budget policies per team",
                    "Monitoring with system tables",
                    "Infrastructure as code: Terraform, bundles",
                  ].map((item) => (
                    <li key={item} className="text-sm leading-snug text-faint">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section eyebrow="Roadmap">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Connect first, migrate later. Each phase has a clear exit test; legacy systems keep
              running until phase 4 proves the replacement.
            </p>
            <div className="mt-8 overflow-x-auto">
              <div className="flex min-w-[48rem] gap-0">
                {[
                  {
                    phase: "Phase 0",
                    label: "Foundation",
                    items: ["Landing zone", "Identity and catalog design", "First workspace"],
                    exit: "Security sign-off",
                  },
                  {
                    phase: "Phase 1",
                    label: "Connect",
                    items: ["Federate 2–3 systems", "CDC for priority tables", "Bronze and silver"],
                    exit: "Data in sync daily",
                  },
                  {
                    phase: "Phase 2",
                    label: "First use case",
                    items: ["Gold tables for one domain", "Dashboard and Genie space", "Users trained"],
                    exit: "Business sign-off",
                  },
                  {
                    phase: "Phase 3",
                    label: "Migrate",
                    items: ["Assess legacy EDW and ETL", "Convert and reconcile", "Parallel run"],
                    exit: "Results match",
                  },
                  {
                    phase: "Phase 4",
                    label: "Scale and retire",
                    items: ["More domains, ML and agents", "Switch off legacy jobs", "Cost reviews"],
                    exit: "Legacy retired",
                  },
                ].map((phase, index, list) => (
                  <div
                    key={phase.phase}
                    className={`flex-1 border border-line bg-surface px-4 py-5 ${
                      index < list.length - 1 ? "border-r-0" : ""
                    }`}
                  >
                    <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                      {phase.phase}
                    </p>
                    <p className="mt-1 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                      {phase.label}
                    </p>
                    <ul className="mt-3 grid gap-1">
                      {phase.items.map((item) => (
                        <li key={item} className="text-sm leading-snug text-faint">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 font-mono text-[0.65rem] tracking-[-0.01em] text-accent uppercase">
                      Exit: {phase.exit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section eyebrow="Migration steps">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Moving a legacy warehouse step by step. Orange steps are covered by Lakebridge,
              Databricks' free migration toolkit.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  n: "01",
                  label: "Analyze",
                  body: "Inventory SQL, ETL jobs and dependencies; score complexity.",
                  accent: true,
                },
                {
                  n: "02",
                  label: "Convert",
                  body: "Translate SQL and ETL to Databricks SQL and pipelines.",
                  accent: true,
                },
                {
                  n: "03",
                  label: "Move data",
                  body: "Bulk load history, then keep in sync with CDC.",
                  accent: false,
                },
                {
                  n: "04",
                  label: "Reconcile",
                  body: "Compare row counts and values between old and new.",
                  accent: true,
                },
                {
                  n: "05",
                  label: "Parallel run",
                  body: "Run both for a period; fix differences.",
                  accent: false,
                },
                {
                  n: "06",
                  label: "Cut over",
                  body: "Point BI and consumers at Databricks; retire old jobs.",
                  accent: false,
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className={`border bg-surface px-4 py-5 ${
                    step.accent ? "border-accent" : "border-line"
                  }`}
                >
                  <p
                    className={`font-mono text-[0.65rem] tracking-[-0.01em] uppercase ${
                      step.accent ? "text-accent" : "text-muted"
                    }`}
                  >
                    {step.n} {step.label}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{step.body}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section eyebrow="Common mistakes">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Mistakes that slow or derail migrations.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Copying everything first",
                  body: "Start with the data a real use case needs; federate the rest.",
                },
                {
                  title: "Lift and shift of Hadoop",
                  body: "Re-design into medallion layers instead of copying old folder structures.",
                },
                {
                  title: "No catalog design",
                  body: "Decide catalogs, schemas, owners and naming before the first table.",
                },
                {
                  title: "Uncontrolled compute",
                  body: "Without cluster and budget policies, costs grow quietly.",
                },
                {
                  title: "Skipping reconciliation",
                  body: "Users lose trust if numbers differ from the old reports.",
                },
                {
                  title: "Ignoring residency",
                  body: "Check where data and control-plane metadata may legally live first.",
                },
              ].map((item) => (
                <div key={item.title} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-foreground uppercase">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      ) : null}

      {view === "demo" ? (
        <div className="flex min-w-0 flex-col">
          <TtsDemo />
        </div>
      ) : null}
      {view === "setup" ? <DatabricksConnectDiagram /> : null}
    </div>
  );
}
