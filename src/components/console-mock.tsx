export function ConsoleMock() {
  return (
    <div className="flex h-full w-full text-paper">
      <aside className="hidden w-[210px] shrink-0 border-r border-white/10 p-5 md:block">
        <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
          Runs
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex items-center justify-between">
            <span>r-1842</span>
            <span className="font-mono text-[0.65rem] text-accent uppercase">Live</span>
          </li>
          <li className="flex items-center justify-between text-[#a49d9a]">
            <span>r-1801</span>
            <span className="font-mono text-[0.65rem] uppercase">Gated</span>
          </li>
          <li className="flex items-center justify-between text-[#a49d9a]">
            <span>r-1777</span>
            <span className="font-mono text-[0.65rem] uppercase">Shipped</span>
          </li>
        </ul>
        <p className="mt-8 font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
          Budget
        </p>
        <p className="mt-2 text-sm">186 / 200 preferences</p>
        <div className="mt-2 h-1 bg-white/10">
          <div className="h-full w-[93%] bg-paper" />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase">
              Held-out win rate · small-data regime
            </p>
            <p className="mt-2 text-4xl tracking-[-0.05em] sm:text-5xl">71.4%</p>
            <p className="mt-2 text-sm text-[#ccc9c7]">
              +9.2 vs base model · KL 0.04 · reward spec v3
            </p>
          </div>
          <p className="font-mono text-[0.7rem] text-[#a49d9a] uppercase">
            qwen-32b → sdr-07
          </p>
        </div>
        <svg
          viewBox="0 0 640 180"
          className="mt-4 min-h-0 w-full flex-1"
          role="img"
          aria-label="Reward curve climbing on the first two hundred preferences, then flattening"
        >
          <path d="M0 150 H640" stroke="rgba(255,255,255,0.08)" />
          <path d="M0 100 H640" stroke="rgba(255,255,255,0.08)" />
          <path d="M0 50 H640" stroke="rgba(255,255,255,0.08)" />
          <path
            d="M8 158 C 70 156, 90 140, 130 118 S 210 70, 280 58 S 400 42, 500 40 S 600 38, 632 36"
            fill="none"
            stroke="#fafafa"
            strokeWidth="2"
          />
          <path
            d="M8 158 C 70 156, 90 140, 130 118 S 210 70, 280 58 S 400 42, 500 40 S 600 38, 632 36 V 170 H 8 Z"
            fill="rgba(238,96,24,0.18)"
          />
          <circle cx="280" cy="58" r="3.5" fill="#ee6018" />
          <text x="292" y="52" fill="#a49d9a" fontSize="12" fontFamily="ui-monospace, monospace">
            200 prefs
          </text>
        </svg>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Reward spec passed", "Style eval passed", "Safety eval waiting"].map(
            (gate) => (
              <span
                key={gate}
                className="border border-white/15 px-2 py-1 font-mono text-[0.65rem] tracking-[-0.01em] text-[#ccc9c7] uppercase"
              >
                {gate}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
