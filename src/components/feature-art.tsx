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
            <div className="absolute inset-[22px] bg-[#de5c36]" />
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

  return null;
}
