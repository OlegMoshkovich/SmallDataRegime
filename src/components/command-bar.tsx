"use client";

import { useEffect, useState } from "react";
import { command } from "@/lib/site";

export function CommandBar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(command.length);
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index >= command.length) window.clearInterval(timer);
    }, 42);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative flex w-full max-w-[40rem] items-center overflow-hidden bg-ink px-3 py-2 text-left text-paper">
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[0.75rem] leading-snug whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="text-accent select-none">{"> "}</span>
        {command.slice(0, count)}
        <span className="cursor-blink ml-0.5 inline-block h-3.5 w-1.5 translate-y-[2px] bg-current" />
      </code>
    </div>
  );
}
