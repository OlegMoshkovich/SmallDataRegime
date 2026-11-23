const rows = [
  {
    model: "Qwen3-30B-A3B, FP8",
    role: "Chat, retrieval answers, router classifier",
    memory: "~31 GB",
    gpu: "1× 48 GB L40S or 1× 80 GB H100",
  },
  {
    model: "DeepSeek-R1-Distill-Qwen-32B, FP8",
    role: "Compliance reasoning",
    memory: "~33 GB",
    gpu: "1× 80 GB H100 or A100",
  },
  {
    model: "BGE-M3",
    role: "Embeddings",
    memory: "~2 GB",
    gpu: "Shared GPU or CPU",
  },
  {
    model: "bge-reranker-v2-m3",
    role: "Reranking",
    memory: "~2 GB",
    gpu: "Shared GPU",
  },
];

const notes = [
  { title: "Context", body: "32,768 tokens; prefix caching on" },
  { title: "GPU memory", body: "0.90 utilisation; pinned GPUs" },
  { title: "Offline", body: "Mirrored weights; HF_HUB_OFFLINE=1" },
  { title: "Priority", body: "Interactive first; batch off-hours" },
];

export function ModelsPanel() {
  return (
    <section className="border border-line bg-surface px-4 py-8 lg:px-8 lg:py-10">
      <p className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
        <span className="size-1.5 bg-accent" aria-hidden />
        Models
      </p>
      <h2 className="mt-3 max-w-3xl text-[2rem] leading-[1.08] tracking-[-0.04em] lg:text-[2.75rem]">
        Served on the local GPUs.
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-faint">
        We post-train and fine-tune open-weights models by applying our small-data regime. A short
        stack of demonstrations and preferences becomes a policy.
        We plan the run, apply the update, and validate it against the evals you wrote. The weights
        stay on a lab machine and serve on these local GPUs.
      </p>

      <div className="mt-10 overflow-x-auto border border-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-[#f4f3f2] font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
            <tr>
              <th className="px-4 py-3 font-normal">Model</th>
              <th className="px-4 py-3 font-normal">Role</th>
              <th className="px-4 py-3 font-normal">Memory</th>
              <th className="px-4 py-3 font-normal">Minimum GPU</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.model} className="border-t border-line align-top">
                <th className="px-4 py-3 text-left font-normal">{row.model}</th>
                <td className="px-4 py-3 text-faint">{row.role}</td>
                <td className="px-4 py-3 text-faint whitespace-nowrap">{row.memory}</td>
                <td className="px-4 py-3 text-faint">{row.gpu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((item) => (
          <div key={item.title} className="border border-line px-4 py-3">
            <p className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">{item.title}</p>
            <p className="mt-2 text-sm leading-snug">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
