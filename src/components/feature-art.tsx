function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col bg-[#101010] p-5 text-[#f4f1ef]">
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
      {children}
    </p>
  );
}

export function FeatureArt({ slug }: { slug: string }) {
  if (slug === "yield") {
    const rows = [
      ["Task writer", 86],
      ["Support judge", 64],
      ["Tool use", 41],
      ["Tone pair", 18],
    ];
    return (
      <Frame>
        <Label>Lift per preference</Label>
        <ul className="mt-6 space-y-4">
          {rows.map(([name, value]) => (
            <li key={name}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{name}</span>
                <span className="font-mono text-xs text-[#a49d9a]">{value}%</span>
              </div>
              <div className="h-1.5 bg-white/10">
                <div className="h-full bg-[#fafafa]" style={{ width: `${value}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-6 text-sm text-[#ccc9c7]">
          12 of 200 pairs carry most of the gain.
        </p>
      </Frame>
    );
  }

  if (slug === "machines") {
    return (
      <Frame>
        <Label>Lab machine · on prem</Label>
        <div className="mt-8 flex flex-1 items-center justify-center">
          <div className="relative size-36 border border-white/20">
            <div className="absolute inset-3 border border-white/15" />
            <div className="absolute inset-[22px] bg-[#ee6018]" />
            <span className="absolute -bottom-7 left-0 font-mono text-[0.65rem] text-[#a49d9a] uppercase">
              Weights stay local
            </span>
          </div>
        </div>
      </Frame>
    );
  }

  if (slug === "readiness") {
    return (
      <Frame>
        <Label>Readiness · level 3</Label>
        <p className="mt-4 text-5xl tracking-[-0.05em]">72</p>
        <ul className="mt-6 space-y-2 text-sm text-[#ccc9c7]">
          <li className="flex justify-between">
            <span>Reward spec</span>
            <span>Written</span>
          </li>
          <li className="flex justify-between">
            <span>Held-out set</span>
            <span>40 traces</span>
          </li>
          <li className="flex justify-between">
            <span>Base gap</span>
            <span>Closeable</span>
          </li>
        </ul>
      </Frame>
    );
  }

  if (slug === "control") {
    return (
      <Frame>
        <Label>Run r-1842</Label>
        <ol className="mt-5 space-y-3 font-mono text-[0.72rem] leading-relaxed text-[#d6d3d2]">
          <li>00:12 collect 14 new rankings</li>
          <li>00:18 fit reward on 186 pairs</li>
          <li>00:41 policy step · KL 0.04</li>
          <li className="text-accent">00:44 waiting on safety eval</li>
        </ol>
      </Frame>
    );
  }

  if (slug === "loops") {
    const steps = ["Collect", "Rank", "Train", "Gate"];
    return (
      <Frame>
        <Label>Shared context</Label>
        <ol className="mt-8 space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="grid size-7 place-items-center border border-white/20 font-mono text-[0.65rem]">
                0{index + 1}
              </span>
              <span>{step}</span>
              {index < steps.length - 1 ? (
                <span className="ml-auto text-[#a49d9a]">↓</span>
              ) : (
                <span className="ml-auto font-mono text-[0.65rem] text-accent uppercase">
                  Hold
                </span>
              )}
            </li>
          ))}
        </ol>
      </Frame>
    );
  }

  if (slug === "routing") {
    const routes = [
      ["Policy", "32B", "Quality"],
      ["Reward", "8B", "Cost"],
      ["Judge", "Reasoning", "Held-out"],
    ];
    return (
      <Frame>
        <Label>Route by stage</Label>
        <ul className="mt-6 space-y-3">
          {routes.map(([stage, model, why]) => (
            <li
              key={stage}
              className="grid grid-cols-3 border border-white/10 px-3 py-3 text-sm"
            >
              <span>{stage}</span>
              <span className="text-[#ccc9c7]">{model}</span>
              <span className="text-right font-mono text-[0.65rem] text-[#a49d9a] uppercase">
                {why}
              </span>
            </li>
          ))}
        </ul>
      </Frame>
    );
  }

  if (slug === "review") {
    return (
      <Frame>
        <Label>Preference · pending</Label>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="border border-white/15 p-3">
            <p className="font-mono text-[0.65rem] text-[#a49d9a] uppercase">Chosen</p>
            <p className="mt-2">Cite the source, then answer in two sentences.</p>
          </div>
          <div className="border border-white/10 p-3 text-[#a49d9a]">
            <p className="font-mono text-[0.65rem] uppercase">Rejected</p>
            <p className="mt-2">Here is a long answer with no citation.</p>
          </div>
        </div>
      </Frame>
    );
  }

  return (
    <Frame>
      <Label>Spec wiki · reward v3</Label>
      <p className="mt-4 text-2xl leading-tight tracking-[-0.04em]">
        Prefer cited answers over fluent ones.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[#ccc9c7]">
        Held-out: citation present, no invented source, under 80 words.
      </p>
      <p className="mt-auto pt-6 font-mono text-[0.65rem] text-[#a49d9a] uppercase">
        Updated with r-1801
      </p>
    </Frame>
  );
}
