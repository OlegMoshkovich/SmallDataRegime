"use client";

import { useState } from "react";
import { command } from "@/lib/site";

export function CommandBar() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative flex w-full max-w-[40rem] items-center gap-3 overflow-hidden bg-ink px-3 py-2 text-left text-paper">
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[0.75rem] leading-snug whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="text-accent select-none">{"> "}</span>
        {command}
        <span className="cursor-blink ml-0.5 inline-block h-3.5 w-1.5 translate-y-[2px] bg-current" />
      </code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 font-mono text-[0.65rem] tracking-[-0.01em] text-[#a49d9a] uppercase hover:text-paper"
        aria-label="Copy train command"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
