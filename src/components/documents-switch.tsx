"use client";

import { useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "@/components/button";

const views = [
  { id: "summary", label: "Summary" },
  { id: "sources", label: "Sources" },
  { id: "platform", label: "Platform" },
  { id: "documents", label: "Documents" },
  { id: "assistant", label: "Assistant" },
  { id: "demo", label: "Use Cases" },
  { id: "setup", label: "Architecture" },
] as const;

type View = (typeof views)[number]["id"];

function isView(value: string | null): value is View {
  return views.some((item) => item.id === value);
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

const sourceFamilies: {
  title: string;
  stores: string;
  query: string;
  use: string;
}[] = [
  {
    title: "Drives and files",
    stores: "Files, folders, versions, ACLs",
    query: "Indexed search, then open the file",
    use: "Policies, contracts, decks, shared drives",
  },
  {
    title: "Wikis",
    stores: "Pages, spaces, comments",
    query: "Indexed search inside a space",
    use: "Runbooks, handbooks, team knowledge",
  },
  {
    title: "Chat",
    stores: "Channels, threads, files dropped in chat",
    query: "Indexed channels, live for the newest",
    use: "Decisions that never became a document",
  },
  {
    title: "Mail and calendar",
    stores: "Messages, threads, meetings",
    query: "Live retrieval for the signed-in person",
    use: "What was promised, and what is on today",
  },
  {
    title: "Work items",
    stores: "Tickets, cases, status, comments",
    query: "Indexed, filtered by project or queue",
    use: "Incidents, requests, vendor reviews",
  },
  {
    title: "Code",
    stores: "Repositories, files, pull requests",
    query: "A separate code index",
    use: "Where a behavior is implemented",
  },
  {
    title: "CRM and case tools",
    stores: "Accounts, knowledge articles, case notes",
    query: "Indexed articles, tools for a live record",
    use: "What the company told this customer",
  },
  {
    title: "On-prem stores",
    stores: "File shares and internal apps",
    query: "Crawl over a private network",
    use: "Systems that never moved to the cloud",
  },
];

const hoverInfo: Record<string, string> = {
  Assistant:
    "A person asks in plain language. Glean retrieves passages that person may open, and the model answers from those passages. Each claim cites the source document.",
  Agents:
    "An agent runs a repeatable job: gather the clauses, draft the summary, open the ticket. It runs as the person who started it, with that person's permissions, not the author's.",
  Search:
    "One box across the connected apps. Results mix docs, messages, tickets, and mail, ranked for this person, and a click opens the file in the system that stores it.",
  Graph:
    "The Knowledge Graph links content, people, and activity. The Enterprise Graph adds teams, customers, and work items. A personal graph is how this person works.",
  Connectors:
    "One connector per application. It crawls content, the permission map, people and groups, and activity such as edits and shares. A webhook or a daily crawl picks up what changed.",
  ConnectorsProduct:
    "Google Drive, SharePoint, Confluence, Slack, Jira, and the rest each have a connector that knows that application's API. The company turns on the sources it wants in the tenant.",
  SearchProduct:
    "The first place an admin checks a connector. If the right people see the right files here, Assistant and Agents can use the same index.",
  AssistantProduct:
    "Chat over the index. The answer is generated only from passages the signed-in user can open, and the citations link back to those files.",
  AgentsProduct:
    "A published agent is a procedure. Whoever runs it does so with their own identity. If they cannot open a contract, the agent cannot read it either.",
  Actions:
    "Tools talk to a system at request time: look up a ticket, update a status, or ask a warehouse a question. The warehouse tables are not copied into the document index.",
  "Knowledge Graph":
    "Content, people, and activity in one map. Search uses it to prefer the document your team actually maintains over an older file that happens to share the words.",
  "Glean Protect":
    "The security floor. The tenant is isolated, permissions are mirrored from each source, and a document the person cannot open is not a result and not a citation.",
  "Glean Protect+":
    "The add-on that scans connected sources for sensitive content and checks prompts, retrieved text, and tool calls before they proceed.",
  Connector:
    "The job that knows one application's API. It fetches documents, the access list, the people, and the activity, and writes them into this company's tenant.",
  Crawl:
    "The first full read of a source. It captures documents, permissions, and activity as of the moment the crawl started. Later changes arrive by webhook or by the next incremental crawl.",
  Webhook:
    "The source tells Glean that a file changed. Most connectors process that notice in one to five minutes. The crawl does not have to start over.",
  "Incremental crawl":
    "A daily pass that picks up changes the webhooks missed. It runs even while a full crawl is still going.",
  Index:
    "The search copy: terms, embeddings, metadata, and the permission snapshot. Readers hit this for speed. The source file remains the record.",
  "Permission mirroring":
    "The access list comes from the source. At question time Glean checks the signed-in person against that list. A missing grant removes the document from retrieval, from the answer, and from the citations.",
  "Identity resolution":
    "The same person is one identity across Drive, Slack, and the directory. Groups follow, so a SharePoint permission that names a group still holds in search.",
  "Enterprise Graph":
    "Relationships on top of the index: who owns a document, which team, which customer, which ticket. Ranking uses those links, not only similar words.",
  "Personal graph":
    "The slice of the graph about one person: their teams, the files they edit, the work in front of them. Two people asking the same question can rank a different document first.",
  Passage:
    "A piece of a document small enough to retrieve and to cite. The answer quotes or points at passages. It does not cite a file the retrieval step never returned.",
  Citation:
    "A link from a sentence in the answer back to the source document. Opening it returns the person to Drive, SharePoint, or the wiki, which checks access again.",
  "Indexed retrieval":
    "Read the tenant index. Best for policies, wikis, tickets, and other bulk text where a crawl is allowed and a fast answer matters.",
  "Live retrieval":
    "Ask the source during the question. Used for mail, calendar, and other stores where a full copy is unwanted or would be stale. Some sources ask the person to sign in first.",
  "Hybrid retrieval":
    "The index for breadth, a live call for what just changed or what was never crawled. The two sets are merged, then filtered by what this person may see.",
  "Activity signal":
    "Views, edits, and shares, when the source exposes them. A document the team edited yesterday outranks a forgotten copy with the same title.",
  Facet:
    "A filter taken from the source: Jira status, Slack channel, GitHub repository, file type. The connector maps those fields so search can offer them.",
  Tenant:
    "This company's isolated cloud project. Indexed content, permissions, and the graph stay inside it, separate from other customers.",
  "Source of record":
    "The application that stores the file. Glean does not become the place a contract is signed or a policy is published. The source keeps that job.",
};

function DocCube({ x, y, accent = false }: { x: number; y: number; accent?: boolean }) {
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

function DocNode({
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
      <DocCube x={x} y={y} accent={accent} />
      <text x={x} y={l1y} textAnchor="middle" className={cls}>{label}</text>
      {label2 ? <text x={x} y={l1y + 13} textAnchor="middle" className={cls}>{label2}</text> : null}
      {sublabel ? <text x={x} y={l1y + (label2 ? 26 : 13)} textAnchor="middle" className="fill-muted font-mono text-[10px]">{sublabel}</text> : null}
      {detail ? <text x={x} y={l1y + (label2 ? 39 : 26)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{detail}</text> : null}
      {more ? <text x={x} y={l1y + (label2 ? 51 : 38)} textAnchor="middle" className="fill-faint font-mono text-[10px]">{more}</text> : null}
    </g>
  );
}

function DocumentConnectDiagram() {
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
          aria-label="Document platform diagram. Four paths run through permissions, retrieval, and the sources where the files stay."
        >
          <rect x="90" y="152" width="722" height="136" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="324" width="722" height="132" fill="#f4f3f2" stroke="#d6d3d2" />
          <rect x="90" y="492" width="722" height="124" fill="#f4f3f2" stroke="#d6d3d2" />

          <text x="5" y="66" className="fill-foreground font-mono text-[11px] uppercase">ACCESS</text>
          <text x="5" y="81" className="fill-muted font-mono text-[10px]">Users, tools</text>
          <line x1="5" y1="96" x2="82" y2="96" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="187" className="fill-foreground font-mono text-[11px] uppercase">CONTROL</text>
          <text x="5" y="202" className="fill-muted font-mono text-[10px]">Run by</text>
          <text x="5" y="215" className="fill-muted font-mono text-[10px]">Glean</text>
          <line x1="5" y1="276" x2="82" y2="276" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="359" className="fill-foreground font-mono text-[11px] uppercase">COMPUTE</text>
          <text x="5" y="374" className="fill-muted font-mono text-[10px]">In the</text>
          <text x="5" y="387" className="fill-muted font-mono text-[10px]">tenant</text>
          <line x1="5" y1="444" x2="82" y2="444" stroke="#d6d3d2" strokeWidth="0.8" />

          <text x="5" y="526" className="fill-foreground font-mono text-[11px] uppercase">STORAGE</text>
          <text x="5" y="541" className="fill-muted font-mono text-[10px]">Where files</text>
          <text x="5" y="554" className="fill-muted font-mono text-[10px]">are kept</text>
          <line x1="5" y1="604" x2="82" y2="604" stroke="#d6d3d2" strokeWidth="0.8" />

          {c.map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy="128" r="9" fill="#101010" />
              <text x={cx} y="132" textAnchor="middle" fill="white" fontSize="11" className="font-mono">{i + 1}</text>
            </g>
          ))}

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

          {([
            [c[0], "ADMINS", "CONNECTORS"],
            [c[1], "EMPLOYEES", "SEARCH"],
            [c[2], "AGENTS", "ACTIONS"],
            [c[3], "EMBEDDED", "APPS"],
          ] as [number, string, string][]).map(([cx, l1, l2]) => (
            <g key={cx}>
              <text x={cx} y="84" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l1}</text>
              <text x={cx} y="98" textAnchor="middle" fill="#101010" fontSize="11" className="font-mono uppercase">{l2}</text>
            </g>
          ))}
          {([
            {
              id: "admins",
              title: "Admins and connectors",
              info: "They choose which sources are crawled, and which sites stay out.",
              example: "An admin connects SharePoint, skips the archive site, and the first crawl starts.",
            },
            {
              id: "employees",
              title: "Employees and search",
              info: "They search and ask. A click opens the file where it already lives.",
              example: "An employee asks what the travel policy allows and opens the cited page in SharePoint.",
            },
            {
              id: "agents",
              title: "Agents and actions",
              info: "They run a procedure as the person who started it.",
              example: "A diligence agent collects the security pack, the last review, and the open ticket.",
            },
            {
              id: "embedded",
              title: "Embedded apps",
              info: "The case tool shows the same results, inside the system where the work sits.",
              example: "A support agent sees the matching runbook inside the case, and not an article from another queue.",
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
            <line x1={c[0]} y1="138" x2={c[0]} y2={cY - 22} {...pick(["admins", "connectors", "crawl", "permissions"])} />
            <line x1={c[1]} y1="138" x2={c[1]} y2={cY - 22} {...pick(["employees", "search", "retrieval", "permissions"])} />
            <line x1={c[2]} y1="138" x2={c[2]} y2={cY - 22} {...pick(["agents", "agentbox", "model", "permissions"])} />
            <line x1={c[3]} y1="138" x2={c[3]} y2={cY - 22} {...pick(["embedded", "embed", "sources", "permissions"])} />
            <line x1={c[0]} y1="278" x2={c[0]} y2={pY - 22} {...pick(["admins", "connectors", "crawl", "index", "permissions"])} />
            <line x1={c[0]} y1="448" x2={c[0]} y2={sY - 22} {...pick(["admins", "connectors", "crawl", "index", "permissions"])} />
            <line x1={c[1]} y1="278" x2={c[1]} y2={pY - 22} {...pick(["employees", "search", "retrieval", "index", "permissions"])} />
            <line x1={c[1]} y1="448" x2={c[1]} y2="478" {...pick(["employees", "search", "retrieval", "index", "permissions"])} />
            <line x1={c[2]} y1="278" x2={c[2]} y2={pY - 22} {...pick(["agents", "agentbox", "model", "graph", "index", "permissions"])} />
            <line x1={c[2]} y1="448" x2={c[2]} y2={sY - 22} {...pick(["agents", "agentbox", "model", "graph", "permissions"])} />
            <line x1={c[3]} y1="278" x2={c[3]} y2={sY - 22} {...pick(["embedded", "embed", "sources", "index", "permissions"])} />
            <line x1={c[3]} y1="478" x2={c[2]} y2="478" {...pick(["embedded", "embed", "sources", "index", "permissions"])} />
            <line x1={c[2]} y1="478" x2={c[1]} y2="478" {...pick(["agents", "agentbox", "model", "embedded", "embed", "sources", "index", "permissions"])} />
            <line x1={c[1]} y1="478" x2={c[0]} y2="478" {...pick(["employees", "search", "retrieval", "agents", "agentbox", "model", "embedded", "embed", "sources", "index", "permissions"])} />
          </g>

          <DocNode x={gateX} y={cY} accent label="PERMISSIONS" label2="MIRROR"
            detail="source access lists"
            more="checks every request"
            info={"The access list is copied from each source. Search, Assistant, agents, and embedded tiles all ask that list before a document is shown.\n\nIf the person cannot open the file in Drive, SharePoint, or the wiki, it is not a result and not a citation. The author's access does not transfer to the reader."}
            example="A reviewer opens the contract library. The playbook they can see is returned. A folder they cannot open never enters the answer."
            onSelect={() => choose("permissions")}
            {...node} />
          <DocNode x={c[0]} y={cY} label="CONNECTORS" label2="CRAWL"
            detail="crawl and webhook"
            more="writes the index"
            info={"A connector knows one application's API. It fetches documents, the access list, people, and activity, and writes them into this company's tenant.\n\nA webhook updates a changed file in minutes. A daily crawl catches what the webhook missed. Inclusion rules can skip a site, a channel, or a folder."}
            example="The SharePoint connector reads the policy library, skips the archive, and commits those pages into the index."
            onSelect={() => choose("connectors")}
            {...node} />
          <DocNode x={c[1]} y={cY} label="SEARCH" label2="ASSISTANT"
            detail="one box, cited answers"
            more="opens the source"
            info={"Search is the box across the connected apps. Assistant reads the same index and writes an answer from the passages this person can open.\n\nA click on a result or a citation returns to the source, which checks access again. The answer does not file a new document."}
            example={'An employee asks "what does the travel policy allow?" The current page is cited. Opening it returns to SharePoint.'}
            onSelect={() => choose("search")}
            {...node} />
          <DocNode x={c[2]} y={cY} label="AGENTS" label2="ACTIONS"
            detail="procedures"
            more="run as that person"
            info={"An agent runs a repeatable job over documents and tools. It uses the identity of the person who started it, not the person who published the agent.\n\nA tool can read a ticket or ask a warehouse at request time. Warehouse tables are not copied into the document index."}
            example="Vendor diligence gathers the security pack, the last review, and the open ticket, then drafts a note the reviewer can file."
            onSelect={() => choose("agentbox")}
            {...node} />
          <DocNode x={c[3]} y={cY} label="EMBEDDED" label2="TILES"
            detail="inside the case tool"
            more="same permissions"
            info={"ServiceNow, Zendesk, and Salesforce can show search and answers inside the tool where the work already happens.\n\nA document the person cannot open does not appear. The case, the ticket, and the article stay in that system."}
            example="Inside a case, the tile suggests the runbook for a failed batch. An article from another queue is absent."
            onSelect={() => choose("embed")}
            {...node} />

          <DocNode x={c[0]} y={pY} label="CRAWL" label2="PARSE"
            detail="fetch and parse"
            more="content and access"
            info={"The crawl reads titles, body, comments, and common attachments, plus owner, status, and the access list.\n\nThe first crawl captures the source at its start. Later changes arrive by webhook, usually within a few minutes, or by the next daily crawl. An on-prem source is reached over a private network."}
            example="A full crawl of the wiki freezes the runbooks at the start time. An edit an hour later arrives by webhook."
            onSelect={() => choose("crawl")}
            {...node} />
          <DocNode x={c[1]} y={pY} label="INDEX" label2="QUERY"
            detail="words and vectors"
            more="ranked passages"
            info={"Retrieval reads the tenant index, then the graph, and drops anything this person cannot open. Words, embeddings, and activity all rank the result.\n\nMail and calendar can be fetched live, during the question, instead of from the index. The two sets are merged, then filtered again."}
            example="The travel question hits the indexed policy. Today's meetings are fetched live from the calendar."
            onSelect={() => choose("retrieval")}
            {...node} />
          <DocNode x={c[2]} y={pY} label="MODEL" label2="ANSWER"
            detail="cited sentences"
            more="only those passages"
            info={"The model sees the question and the passages that survived the permission check. It does not see the rest of the corpus.\n\nEach claim cites a passage. A fluent sentence with no source is not offered as a company fact. The model does not write the file back."}
            example="The liability cap is taken from the playbook, and one exception from an executed PDF. Each sentence cites its file."
            onSelect={() => choose("model")}
            {...node} />

          <DocNode x={c[0]} y={sY} label="TENANT" label2="INDEX"
            sublabel="shared by 1 and 2"
            detail="the search copy"
            more="text, access, vectors"
            info={"The index is the derived copy in the tenant: terms, embeddings, facets, and the permission snapshot. Connectors write it. Search and Assistant read it.\n\nThe original file is not stored here. The paths meet on this copy, then a click returns to the source."}
            example="The policy page is edited in SharePoint. The index updates from the webhook. Search and Assistant both read that update."
            onSelect={() => choose("index")}
            {...node} />
          <DocNode x={c[2]} y={sY} label="KNOWLEDGE" label2="GRAPH"
            detail="people and activity"
            more="links, not a copy"
            info={"The graph connects content, people, teams, and work items. Ranking uses it to prefer the document a team actually maintains over an older file with the same words.\n\nIt is not a second copy of the file, and it is not the company directory. The directory remains the list of who works here."}
            example="Two people ask the same question. The person on the on-call team sees this week's runbook first."
            onSelect={() => choose("graph")}
            {...node} />
          <DocNode x={c[3]} y={sY} label="SOURCE" label2="SYSTEMS"
            sublabel="the file stays"
            detail="Drive, SharePoint, wiki"
            more="a click returns here"
            info={"The source owns the file, the version history, and the place people edit. Drive, SharePoint, the wiki, chat, and the case tool stay in that role.\n\nOpening a result comes back here, and the source checks access again. Publishing and signature never move into the tenant."}
            example="The signed PDF stays in the contract library. The citation opens that PDF. The tenant does not keep a second signed copy."
            onSelect={() => choose("sources")}
            {...node} />

          <text x="845" y="166" className="fill-muted font-mono text-[11px] uppercase">HOW TO READ IT</text>
          {([
            { y: 192, lines: ["Connectors crawl sources", "and write the index.", "The file stays put."] },
            { y: 260, lines: ["Search reads that index,", "then opens the file", "where it lives."] },
            { y: 328, lines: ["Agents call the model", "on passages this person", "can open. The graph", "ranks them."] },
            { y: 410, lines: ["A tile in the case tool", "uses the same index.", "The case stays put."] },
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

export function DocumentsSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("view");
  const view: View = isView(requested) ? requested : "summary";
  const [hoverTip, setHoverTip] = useState<{ title: string; body: string; x: number; y: number } | null>(null);

  function select(next: View) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "summary") params.delete("view");
    else params.set("view", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function showHover(event: ReactMouseEvent<HTMLElement>, title: string) {
    const body = hoverInfo[title];
    if (!body) return;
    const width = 320;
    const height = 240;
    let x = event.clientX + 14;
    let y = event.clientY + 16;
    if (x + width > window.innerWidth - 8) x = event.clientX - width - 12;
    if (y + height > window.innerHeight - 8) y = event.clientY - height - 12;
    setHoverTip({ title, body, x: Math.max(8, x), y: Math.max(8, y) });
  }

  function Term({ title, label }: { title: string; label?: string }) {
    return (
      <span
        className="cursor-help underline decoration-dotted decoration-line underline-offset-[3px]"
        onMouseEnter={(event) => showHover(event, title)}
        onMouseMove={(event) => showHover(event, title)}
        onMouseLeave={() => setHoverTip(null)}
      >
        {label ?? title}
      </span>
    );
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
              Use Cases <ArrowRight />
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
          <Section eyebrow="Summary">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              One place to ask across the documents the company already keeps. Connectors read each source, the index and the graph make that reading searchable, and every answer is limited to what the signed-in person can open.
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
                  {(
                    [
                      ["Assistant", "Assistant", "Assistant · answers with citations from documents the person can open"],
                      ["Agents", "Agents", "Agents · Actions · a procedure that reads and updates systems as that person"],
                      ["Search", "Search", "Search · one box across apps, with facets from the source"],
                      ["Graph", "Graph", "Knowledge Graph · Enterprise Graph · personal graph"],
                      ["Index", "Index", "Lexical index · embeddings · permission snapshot · activity"],
                      ["Connectors", "Connectors", "Connectors · crawl, webhook, and live retrieval into the tenant"],
                    ] as const
                  ).map(([layer, tip, products]) => (
                    <tr key={layer} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <Term title={tip} label={layer} />
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{products}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-10 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
              Concepts
            </p>
            <p className="mt-3 max-w-2xl text-base leading-snug text-faint">
              The words the rest of this page uses. Hover a name to see an example.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Concept</th>
                    <th className="px-4 py-3 font-normal text-muted">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Connector", "The integration for one application. It fetches documents, the access list, people and groups, and activity, and writes them into this company's tenant."],
                    ["Crawl", "The first full read of a source, as of the moment it started. Documents changed after that moment arrive by webhook or by the next incremental crawl."],
                    ["Webhook", "A notice from the source that a file changed. Most connectors process it in one to five minutes, without starting the full crawl again."],
                    ["Incremental crawl", "A daily pass for changes the webhooks missed. It runs alongside a full crawl, so the index does not wait for the first crawl to finish."],
                    ["Index", "The search copy in the tenant: terms, embeddings, metadata, and the permission snapshot. The file stays in the source."],
                    ["Permission mirroring", "Access is copied from the source and checked again for the signed-in person. If they cannot open the file there, it is not a result and not a citation."],
                    ["Identity resolution", "One person, matched across apps through the company directory. A group grant in SharePoint still applies when that person searches."],
                    ["Knowledge Graph", "The map of content, people, and activity. It is what makes a result personal instead of a bag of similar words."],
                    ["Enterprise Graph", "The relationships around the work: teams, customers, projects, and the documents that belong to them."],
                    ["Personal graph", "How this person works: their team, the files they edit, the tasks in front of them. The same question can rank differently for two people."],
                    ["Passage", "A slice of a document used for retrieval and for the citation. The answer is written from passages, not from the model's memory of the company."],
                    ["Citation", "The link under a sentence. It opens the source document, and the source checks access again."],
                    ["Indexed retrieval", "Answer from the tenant index. The usual path for policies, wikis, tickets, and code."],
                    ["Live retrieval", "Ask the source during the question. Used for mail, calendar, and anything the company does not want sitting in the index."],
                    ["Hybrid retrieval", "Index for the corpus, a live call for what just changed. Both sets are filtered by the person's permissions before the model sees them."],
                    ["Activity signal", "Edits, views, and shares, when the connector can see them. Fresh work outranks a stale file with the same words."],
                    ["Facet", "A filter the source already has: status, channel, repository, file type. Search offers it because the connector mapped the field."],
                    ["Tenant", "The isolated project for this company. The index and the graph stay inside it."],
                    ["Source of record", "The system that stores the file. Publishing, versioning, and signature stay there. Search and answers are a reading of that system."],
                  ].map(([concept, meaning]) => (
                    <tr key={concept} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <Term title={concept} />
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Products">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              What each part of the document platform does, and why an enterprise cares.
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
                  {(
                    [
                      ["Connectors", "ConnectorsProduct", "Crawl content, permissions, people, and activity", "One search box instead of twelve logins"],
                      ["Search", "SearchProduct", "Ranked results across the connected apps", "Finds the file, then opens it where it lives"],
                      ["Assistant", "AssistantProduct", "Answers from passages, with citations", "A policy question names the page it used"],
                      ["Agents", "AgentsProduct", "Repeatable procedures over documents and tools", "A review runs the same way every time"],
                      ["Actions", "Actions", "Live calls into tickets, apps, and warehouses", "Looks up a case without copying the warehouse"],
                      ["Knowledge Graph", "Knowledge Graph", "Links people, content, and activity", "Prefers the document the team maintains"],
                      ["Glean Protect", "Glean Protect", "Isolated tenant and mirrored permissions", "No result the person cannot already open"],
                      ["Glean Protect+", "Glean Protect+", "Sensitive-content scan and request guardrails", "A second check on prompts, passages, and tools"],
                    ] as const
                  ).map(([product, tip, what, why]) => (
                    <tr key={product} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        <Term title={tip} label={product} />
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
              Common document work, and the parts of the platform behind each one.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Use case</th>
                    <th className="px-4 py-3 font-normal text-muted">What gets built</th>
                    <th className="px-4 py-3 font-normal text-muted">Platform pieces</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Policy question", "An answer that cites the current policy, not a draft", "Connectors, index, Assistant, permission mirroring"],
                    ["Contract review", "The clauses a reviewer asked for, from the contract store", "Drive or SharePoint connector, passages, citations"],
                    ["Vendor diligence", "Prior reviews, security docs, and the open ticket", "Connectors, graph, Actions"],
                    ["Onboarding", "The handbook, the team page, and the setup ticket for a new hire", "Identity, Search, personal graph"],
                    ["Support runbook", "The article that matches the case, inside the case tool", "Indexed knowledge, embedded Assistant, permissions"],
                    ["Find an expert", "The person who last maintained the document", "Enterprise Graph, activity"],
                    ["Meeting prep", "Today's meetings plus the docs those meetings depend on", "Live calendar, indexed docs, hybrid retrieval"],
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

      {view === "sources" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Sources">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The families below are the document systems enterprises already run. The query column is how the platform reads each one. The file stays in that system.
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
                  {sourceFamilies.map((family) => (
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
          <Section eyebrow="The question picks the path">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              A document platform does not copy every system the same way. Bulk text is indexed. Personal and fast-moving stores are read at question time. Structured tables in a warehouse are not indexed at all.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Source of record",
                  body: "Drive, SharePoint, Confluence, or the file share owns the file. People edit and publish there. The platform never becomes the place the contract is stored.",
                },
                {
                  label: "Indexed copy",
                  body: "Policies, wikis, tickets, and code are crawled into the tenant index with their permissions. Search and Assistant read that copy so a question does not wait on every source.",
                },
                {
                  label: "Live read",
                  body: "Mail and calendar are fetched for the signed-in person during the question. The company can leave a sensitive slice out of the index and still answer from it.",
                },
                {
                  label: "Tool call",
                  body: "A warehouse or a ticketing API is asked at request time. Glean does not crawl Snowflake or Databricks tables into the document index.",
                },
              ].map((item) => (
                <div key={item.label} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">{item.label}</p>
                  <p className="mt-2 text-sm leading-snug text-faint">{item.body}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section eyebrow="From a file to a result">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              SaaS sources are reached over HTTPS. An on-prem system is reached over a private network. Either way the connector writes into the tenant, and the source keeps the file.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["01", "Connect", "An admin turns on a connector and grants it the read the source allows. Inclusion rules can skip a site, a channel, or a folder."],
                ["02", "Crawl", "The first crawl reads content, permissions, people, and activity as of its start time."],
                ["03", "Parse", "Titles, body, comments, and common attachments become text. Metadata such as owner, modified time, and status comes with them."],
                ["04", "Index", "Terms, embeddings, facets, and the permission snapshot land in the tenant. The Knowledge Graph links the document to people and activity."],
                ["05", "Refresh", "A webhook updates a changed file in minutes. A daily incremental crawl catches what the webhook missed."],
                ["06", "Answer", "Search or Assistant reads the index, drops anything this person cannot open, and sends a click back to the source."],
              ].map(([n, label, body]) => (
                <div key={n} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {n} {label}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{body}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      ) : null}

      {view === "platform" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Clients">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Four ways in, one index underneath, and the same permission check on every one of them.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["01", "Employees", "Search is the box across the apps they already use. A result opens the file in the source."],
                ["02", "Assistant", "A question returns a short answer and the citations. The passages are limited to documents this person can open."],
                ["03", "Agents", "A person starts a procedure. The agent reads and acts as that person, including through an MCP client."],
                ["04", "Embedded tools", "A tile inside ServiceNow, Zendesk, or Salesforce shows the same results. A document they cannot open does not appear."],
              ].map(([n, title, body]) => (
                <div key={n} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">
                    {n} {title}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-faint">{body}</p>
                </div>
              ))}
            </div>
          </Section>
          <Section eyebrow="Five kinds of control">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              These are the checks around the index. None of them grants a document the source would refuse.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Control</th>
                    <th className="px-4 py-3 font-normal text-muted">Used for</th>
                    <th className="px-4 py-3 font-normal text-muted">How it runs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Connectors", "Which sources are in, and which folders are out", "Crawl, webhook, and inclusion rules per application"],
                    ["Permission mirroring", "Who may see a document", "The source ACL is checked for the signed-in person at query time"],
                    ["Identity resolution", "The same person across apps", "Directory groups line up with each source's access list"],
                    ["Glean Protect", "Isolation and least privilege", "The tenant is separate, and agents cannot outrun the user"],
                    ["Glean Protect+", "Sensitive content and model guardrails", "Scans sources and checks the prompt, the passages, and the tool call"],
                  ].map(([control, use, how]) => (
                    <tr key={control} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {control}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{use}</td>
                      <td className="px-4 py-3 text-sm text-faint">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Three kinds of retrieval">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The connector chooses a path per source. A single answer can mix them, and every path still drops documents this person cannot open.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Retrieval</th>
                    <th className="px-4 py-3 font-normal text-muted">Used for</th>
                    <th className="px-4 py-3 font-normal text-muted">How it runs</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Indexed", "Policies, wikis, tickets, code", "Read the tenant index. Low latency across a large corpus."],
                    ["Live", "Mail, calendar, a record that must be current", "Call the source during the question, often after the person signs in to that app."],
                    ["Hybrid", "Indexed breadth plus a fresh slice", "Merge the index with a targeted live fetch, then filter by permission."],
                  ].map(([kind, use, how]) => (
                    <tr key={kind} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {kind}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{use}</td>
                      <td className="px-4 py-3 text-sm text-faint">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="What is stored">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The index is a derived copy inside the tenant. Compute reads it so a question is fast. The bytes of the file stay in the source.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Store</th>
                    <th className="px-4 py-3 font-normal text-muted">Used for</th>
                    <th className="px-4 py-3 font-normal text-muted">How it is kept</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Search index", "Words, embeddings, facets", "Built by the crawl, updated by webhook and incremental crawl"],
                    ["Permission snapshot", "The access list at query time", "Mirrored from each source and refreshed with the document"],
                    ["Graph", "People, teams, activity, work items", "Derived from the same connector data, not a second system of record"],
                    ["Source system", "The file people edit", "Left in place. A click returns there, and that system checks access again."],
                  ].map(([storage, use, how]) => (
                    <tr key={storage} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {storage}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{use}</td>
                      <td className="px-4 py-3 text-sm text-faint">{how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Systems already running">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              The document systems stay. The platform connects to the ones a question needs, and leaves publishing where it is.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Already running</th>
                    <th className="px-4 py-3 font-normal text-muted">What you do</th>
                    <th className="px-4 py-3 font-normal text-muted">What stays</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["SharePoint or Drive", "Connect the sites people still open, and skip the archives no one should search", "The library remains where a policy is published"],
                    ["Confluence or Notion", "Index the spaces that hold runbooks and handbooks", "Authors keep editing the wiki"],
                    ["Slack or Teams", "Index the channels the company allows. Take the newest messages live when freshness matters", "The chat app remains the conversation"],
                    ["Mail and calendar", "Fetch them for the signed-in person at question time", "The mailbox is not a shared corpus"],
                    ["Jira or ServiceNow", "Index tickets and knowledge articles with their permissions", "The queue remains the system of work"],
                    ["Company directory", "Sync people and groups so a source grant matches the person searching", "The directory remains the list of who works here"],
                    ["Warehouse", "Leave the tables. Call them with a tool when a question needs a figure", "Analytics stays on the warehouse"],
                  ].map(([system, action, stays]) => (
                    <tr key={system} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {system}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{action}</td>
                      <td className="px-4 py-3 text-sm text-faint">{stays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Tenant">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              One tenant for the company. Connectors in that tenant. People from the company directory.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Tenant", "An isolated cloud project. Indexed content is encrypted and is not mixed with another customer's index."],
                ["Directory", "Single sign-on and groups. Identity resolution starts here, so a person is one person in every connector."],
                ["Connectors", "One per source the company turns on. Each writes into this tenant and nowhere else."],
              ].map(([label, body]) => (
                <div key={label} className="border border-line bg-surface px-4 py-5">
                  <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-muted uppercase">{label}</p>
                  <p className="mt-2 text-sm leading-snug text-faint">{body}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      ) : null}

      {view === "documents" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Document representation">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              A policy is one document in the source. The title, the text, the owner, the access list, and the passages each have a home. The platform keeps a search copy. It does not keep a second original.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Part</th>
                    <th className="px-4 py-3 font-normal text-muted">The fact</th>
                    <th className="px-4 py-3 font-normal text-muted">Product</th>
                    <th className="px-4 py-3 font-normal text-muted">Where it lives</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["File", "The policy PDF or the wiki page", "Source system", "Drive, SharePoint, or the wiki. People edit it there."],
                    ["Text", "Title, body, comments, attachments", "Connector", "Extracted during the crawl and written to the tenant."],
                    ["Owner", "Who created it, and which team", "Identity resolution, graph", "Matched to the directory, then linked in the graph."],
                    ["Access", "Who may open it", "Permission mirroring", "The source ACL, checked again for the person asking."],
                    ["Activity", "Edits, views, shares", "Connector", "Used in ranking when the source exposes them."],
                    ["Passage", "The slice retrieved for a question", "Index", "Terms and an embedding, pointing back at the file."],
                    ["Link", "The ticket, the customer, the related page", "Enterprise Graph", "A relationship, not a copy of those systems."],
                    ["Citation", "The sentence's source", "Assistant", "A link that opens the file in the source."],
                  ].map(([part, fact, product, where]) => (
                    <tr key={part} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {part}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{fact}</td>
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                        {product}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{where}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          {(
            [
              {
                eyebrow: "A contract",
                intro: "One signed agreement. The clause the reviewer asked for is a passage. The file stays in the contract library.",
                rows: [["Contract", "The signed PDF and the clause on liability", "Drive connector, passages, citations", "Legal searches the clause. Opening it returns to the PDF, which still has its own access list."]],
              },
              {
                eyebrow: "A runbook",
                intro: "One wiki page the on-call team edits. Activity prefers this page over last year's copy.",
                rows: [["Runbook", "The steps for a failed payment batch", "Wiki connector, activity, graph", "The page stays in Confluence. Search ranks the page the team edited this week."]],
              },
              {
                eyebrow: "A ticket",
                intro: "One case, with the article that explains it. The queue remains the system of work.",
                rows: [["Ticket", "The open case and the knowledge article that matches it", "Work-item connector, embedded Assistant", "The case stays in ServiceNow. The tile only shows articles this agent can open."]],
              },
            ] as const
          ).map((table) => (
            <Section key={table.eyebrow} eyebrow={table.eyebrow}>
              <p className="mt-5 max-w-xl text-base leading-snug text-faint">{table.intro}</p>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[48rem] text-left text-sm">
                  <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                    <tr>
                      <th className="px-4 py-3 font-normal text-muted">Part</th>
                      <th className="px-4 py-3 font-normal text-muted">The fact</th>
                      <th className="px-4 py-3 font-normal text-muted">Product</th>
                      <th className="px-4 py-3 font-normal text-muted">Where it lives</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map(([part, fact, product, where]) => (
                      <tr key={part} className="border-t border-line">
                        <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                          {part}
                        </td>
                        <td className="px-4 py-3 text-sm text-faint">{fact}</td>
                        <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase">
                          {product}
                        </td>
                        <td className="px-4 py-3 text-sm text-faint">{where}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          ))}
        </div>
      ) : null}

      {view === "assistant" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Assistant">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              Assistant is where a person asks in plain language and gets an answer from documents the company already trusts. It does not look through files the person cannot open, and it does not invent a clause. It retrieves passages, a model reads those passages, and the citations are the answer's proof.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
              A person can ask “what does the travel policy say about client dinners?” or “what about international travel?” The second question stays on the same policy. Search is the check that the connector worked. Assistant is the reading of what Search would have returned to this person.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
              The question enters as that person. Indexed sources are read from the tenant. Mail or calendar can be fetched live. The permission check runs before a passage reaches the model. The answer does not file a new document. Publishing stays in the source.
            </p>
          </Section>
          <Section eyebrow="How an answer is built">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              The model does not hold a connection to Drive or SharePoint. Retrieval runs first, as the signed-in person, and the model only sees what survived that check.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Step</th>
                    <th className="px-4 py-3 font-normal text-muted">What the platform does</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1. Identify", "Takes the signed-in person and their groups from the directory. The question runs as that identity, not as a service account that can see everything."],
                    ["2. Retrieve", "Searches the index for passages, and adds a live fetch where the source is mail, calendar, or a slice the company chose not to index."],
                    ["3. Check the grant", "Drops any document the mirrored permissions say this person cannot open. A missing grant removes it from the answer and from the citations."],
                    ["4. Rank", "Orders what remains with the words, the embedding, the activity, and the graph. A file the person's team edited outranks an older copy with the same title."],
                    ["5. Read", "Sends the question and those passages to the model. The model does not receive the rest of the corpus."],
                    ["6. Cite", "Attaches each claim to a passage. A sentence with no passage is not offered as a company fact."],
                    ["7. Open", "A click on the citation returns to the source. The source checks access again."],
                    ["8. Act", "If the person started an agent, the same identity is used for tools: update a ticket, or ask a warehouse, only where that person already can."],
                  ].map(([step, body]) => (
                    <tr key={step} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {step}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{body}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="One question, end to end">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              A reviewer asks, “What is our standard liability cap, and which contract used a different one last quarter?” The platform loads the contract library this reviewer can open. Indexed passages come back from the playbook and from the executed PDFs. A contract in a folder they cannot see never enters the set.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-snug text-faint">
              Ranking prefers the playbook the legal team edited this month, then the executed file whose metadata says last quarter. The model writes the cap from the playbook and names the exception from that file. Each sentence cites its passage. The reviewer opens the PDF in the library. Nothing is written back, and the warehouse of payment figures is not part of the corpus.
            </p>
          </Section>
          <Section eyebrow="What the answer refuses">
            <CardGrid
              items={[
                {
                  title: "No closed file",
                  body: "If the person cannot open it in the source, it is not retrieved, not summarized, and not cited. The author's access does not transfer to the reader.",
                },
                {
                  title: "No new record",
                  body: "A question does not file a policy or a contract. Publishing and signature stay in the source. An action that updates a ticket is a tool the person already has, and it is explicit.",
                },
                {
                  title: "No warehouse copy",
                  body: "Tables in Snowflake or Databricks are not crawled into the document index. A figure from those systems, when needed, is a tool call at question time.",
                },
                {
                  title: "No borrowed identity",
                  body: "Assistant and Agents use the signed-in person. An admin who can see every site does not grant that view to everyone who can open chat.",
                },
                {
                  title: "No uncitable claim",
                  body: "Company facts come from passages that survived the permission check. A fluent sentence with no source is not an answer.",
                },
                {
                  title: "No stale grant",
                  body: "Permissions refresh with the document, by webhook or by the incremental crawl. The source still checks again when the person opens the file.",
                },
              ]}
            />
          </Section>
        </div>
      ) : null}

      {view === "demo" ? (
        <div className="grid min-w-0 gap-6 *:min-w-0">
          <Section eyebrow="Use cases">
            <p className="mt-5 max-w-xl text-base leading-snug text-faint">
              Each case is a question over documents that already exist. The source keeps the file. The platform reads it, checks the person, and cites the passage.
            </p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
                  <tr>
                    <th className="px-4 py-3 font-normal text-muted">Use case</th>
                    <th className="px-4 py-3 font-normal text-muted">Who asks</th>
                    <th className="px-4 py-3 font-normal text-muted">What stays in the source</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Policy question", "Any employee", "The published policy, in the library that owns it"],
                    ["Contract review", "Legal or procurement", "The executed PDF and its folder permissions"],
                    ["Vendor diligence", "Third-party risk", "The security pack, the last review, and the open ticket"],
                    ["Onboarding", "A new hire and their manager", "The handbook and the team page"],
                    ["Support runbook", "A support agent, inside the case", "The knowledge article and the case record"],
                    ["Find an expert", "Someone blocked on a system", "The page, and the name of the person who edits it"],
                    ["Meeting prep", "The person about to walk in", "The calendar event, fetched live, and the docs it points at"],
                  ].map(([useCase, who, stays]) => (
                    <tr key={useCase} className="border-t border-line">
                      <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] text-foreground uppercase whitespace-nowrap">
                        {useCase}
                      </td>
                      <td className="px-4 py-3 text-sm text-faint">{who}</td>
                      <td className="px-4 py-3 text-sm text-faint">{stays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section eyebrow="Policy question">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              An employee asks what the company allows. Assistant retrieves the current policy from the indexed library, hides drafts in a folder they cannot open, and cites the page. The handbook is still published in SharePoint.
            </p>
          </Section>
          <Section eyebrow="Contract review">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              A reviewer asks for the liability cap and any recent exception. Passages come from the playbook and from executed files in libraries they can open. The citation opens the PDF. The platform does not store a second signed copy.
            </p>
          </Section>
          <Section eyebrow="Vendor diligence">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              Risk asks what this vendor already provided. The graph ties the security document, the last review, and the open ticket. An action can read the ticket. The questionnaire file stays in the drive where vendor management keeps it.
            </p>
          </Section>
          <Section eyebrow="Support runbook">
            <p className="mt-5 max-w-2xl text-base leading-snug text-faint">
              Inside the case tool, the embedded assistant suggests the article that matches the case. The suggestion uses the agent's own permissions. An article for another queue does not appear. The case stays in ServiceNow.
            </p>
          </Section>
        </div>
      ) : null}

      {view === "setup" ? <DocumentConnectDiagram /> : null}
    </div>
  );
}
