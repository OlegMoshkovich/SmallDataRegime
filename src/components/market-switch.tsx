"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const views = [
  { id: "databricks", label: "Databricks" },
  { id: "glean", label: "Glean" },
  { id: "baseten", label: "Baseten" },
  { id: "cognition", label: "Cognition" },
] as const;

type View = (typeof views)[number]["id"];

function isView(value: string | null): value is View {
  return views.some((item) => item.id === value);
}

const cases: Record<
  View,
  {
    name: string;
    href: string;
    lede: string;
    rows: [string, string, string][];
    close: string;
  }
> = {
  databricks: {
    name: "Databricks",
    href: "https://www.databricks.com",
    lede: "is the market case for the data module. It is the system a company buys when tables, pipelines, and the question asked of them have to live in one governed place.",
    rows: [
      ["Lakehouse", "Delta tables on object storage, read by SQL and by Spark", "The warehouse and the lake are the same store"],
      ["Unity Catalog", "One catalog for tables, files, models, and who may open them", "A query runs only on what that person can already read"],
      ["SQL warehouse", "The engine that answers a question over those tables", "Text-to-SQL has a named place to run"],
      ["Workflows", "Jobs, notebooks, and pipelines on a schedule", "A number is produced the same way every night"],
      ["Genie", "A space that turns a question into SQL against the catalog", "The answer is a query, not a guess"],
    ],
    close: "The data module is this job on the enterprise’s machines. The catalog, the warehouse, and the text-to-SQL path stay inside the company.",
  },
  glean: {
    name: "Glean",
    href: "https://www.glean.com",
    lede: "is the market case for the documents module. It is the system a company buys when people search across the apps they already use, and only see what they can open.",
    rows: [
      ["Connectors", "Crawl content, permissions, people, and activity from each app", "The file stays in the source"],
      ["Index", "A tenant-isolated copy for search: terms, embeddings, and the access list", "A result the person cannot open is not returned"],
      ["Search", "One box across the connected apps", "The click opens the file where it lives"],
      ["Assistant", "An answer from passages, with a citation", "The citation is a document that person can open"],
      ["Agents", "A procedure that reads and updates systems as the signed-in person", "Tools use that person’s permissions"],
    ],
    close: "The documents module is this job on the enterprise’s machines. Search and the assistant read an index the company holds, and the file stays put.",
  },
  baseten: {
    name: "Baseten",
    href: "https://www.baseten.co",
    lede: "is the market case for the inference module. It is the system a company buys when a model has to answer production traffic without the company running the GPU fleet.",
    rows: [
      ["Deployment", "A model packaged once and served as its own endpoint", "Weights, runtime, and scale are one unit"],
      ["API", "An OpenAI-compatible call for chat, embeddings, and custom models", "Applications do not learn a new client"],
      ["GPUs", "The hardware is chosen per model and scaled with the queue", "Interactive traffic is not stuck behind a batch job"],
      ["Truss", "The open package that describes the model, the image, and the resources", "The same bundle can move to machines the company owns"],
      ["Chains", "Several models in one request, still behind one endpoint", "A rerank or a guard stays next to the answer"],
    ],
    close: "The inference module is this job on the enterprise’s GPUs. The model proxy is the only door, and the weights stay on those machines.",
  },
  cognition: {
    name: "Cognition",
    href: "https://cognition.ai",
    lede: "is the market case for the coding module. Devin is the agent a company points at a repository when the task is a change, not a chat.",
    rows: [
      ["Task", "A written job: fix, feature, or investigation", "The agent starts from the task, not from a blank editor"],
      ["Workspace", "A sandbox with the repo, a shell, and a browser", "The work happens off the person’s laptop"],
      ["Plan", "An ordered set of steps the agent follows and can revise", "A person can see what it is about to do"],
      ["Tools", "Read, edit, test, and run, inside that sandbox", "The agent does not get the person’s whole machine"],
      ["Result", "A branch and a pull request a person reviews", "Nothing merges without that review"],
    ],
    close: "The coding module is this job on the enterprise’s machines. The agent edits a workspace the company owns, and a person accepts the change.",
  },
};

export function MarketSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("view");
  const view: View = isView(requested) ? requested : "databricks";
  const current = cases[view];

  function select(next: View) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "databricks") params.delete("view");
    else params.set("view", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div
          className="ml-auto flex w-fit max-w-full flex-wrap justify-end gap-2 lg:gap-0 lg:border lg:border-line"
          role="group"
          aria-label="Market case"
        >
          {views.map((item, index) => {
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
      <section className="w-full border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
        <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
          <span className="size-1.5 bg-accent" aria-hidden />
          Market case
        </p>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-faint">
          <a href={current.href} target="_blank" rel="noreferrer" className="text-foreground underline">
            {current.name}
          </a>{" "}
          {current.lede}
        </p>
        <div className="mt-8 overflow-x-auto border border-line">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
              <tr>
                <th className="px-4 py-3 font-normal text-muted">Piece</th>
                <th className="px-4 py-3 font-normal text-muted">What it is</th>
                <th className="px-4 py-3 font-normal text-muted">The job</th>
              </tr>
            </thead>
            <tbody>
              {current.rows.map(([piece, what, job]) => (
                <tr key={piece} className="border-t border-line">
                  <td className="px-4 py-3 font-mono text-[0.75rem] tracking-[-0.015rem] whitespace-nowrap uppercase">
                    {piece}
                  </td>
                  <td className="px-4 py-3 text-sm text-faint">{what}</td>
                  <td className="px-4 py-3 text-sm text-faint">{job}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-faint">{current.close}</p>
      </section>
    </div>
  );
}
