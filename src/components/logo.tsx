"use client";

import { useEffect, useState } from "react";

const cells = [0, 1, 2].flatMap((row) =>
  [0, 1, 2].map((column) => ({
    x: 7.5 + column * 8,
    y: 7.5 + row * 8,
  })),
);

function pickOutlined() {
  const outlined = cells.map(() => Math.random() < 0.55);
  if (!outlined.some(Boolean)) {
    outlined[Math.floor(Math.random() * outlined.length)] = true;
  }
  return outlined;
}

export function Mark({
  className = "size-8",
  outlined,
  shuffle = false,
}: {
  className?: string;
  outlined?: boolean[] | null;
  shuffle?: boolean;
}) {
  const controlled = outlined !== undefined;
  const [local, setLocal] = useState<boolean[] | null>(null);
  const [rest, setRest] = useState<boolean[] | null>(null);
  const open = controlled ? outlined : local;

  useEffect(() => {
    if (controlled || !shuffle) return;
    const next = pickOutlined();
    setRest(next);
    setLocal(next);
  }, [controlled, shuffle]);

  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      aria-hidden="true"
      onMouseEnter={
        controlled
          ? undefined
          : () => {
              setLocal(pickOutlined());
            }
      }
      onMouseLeave={controlled ? undefined : () => setLocal(shuffle ? rest : null)}
    >
      {cells.map((cell, index) => {
        return (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x}
            y={cell.y}
            width="5"
            height="5"
            fill="#ffffff"
            stroke="none"
            strokeWidth={0}
          />
        );
      })}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[0.95rem] font-medium tracking-[-0.045em] whitespace-nowrap text-foreground ${className}`}>
      MI_research_lab
    </span>
  );
}
