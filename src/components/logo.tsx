"use client";

import { useState } from "react";

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
}: {
  className?: string;
  outlined?: boolean[] | null;
}) {
  const controlled = outlined !== undefined;
  const [local, setLocal] = useState<boolean[] | null>(null);
  const open = controlled ? outlined : local;

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
      onMouseLeave={controlled ? undefined : () => setLocal(null)}
    >
      <rect
        x="0.75"
        y="0.75"
        width="34.5"
        height="34.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      {cells.map((cell, index) => {
        const hollow = Boolean(open?.[index]);
        return (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x}
            y={cell.y}
            width="5"
            height="5"
            fill={hollow ? "#ffffff" : "currentColor"}
            stroke={hollow ? "currentColor" : "none"}
            strokeWidth={hollow ? 0.9 : 0}
            style={{ transition: "fill 140ms linear" }}
          />
        );
      })}
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  const [outlined, setOutlined] = useState<boolean[] | null>(null);

  return (
    <span
      className={`inline-flex items-center gap-2.5 text-foreground ${className}`}
      onMouseEnter={() => setOutlined(pickOutlined())}
      onMouseLeave={() => setOutlined(null)}
    >
      <Mark className="size-7" outlined={outlined} />
      <span className="text-[0.95rem] font-medium tracking-[-0.045em] whitespace-nowrap">
        SmallDataRegime.ai
      </span>
    </span>
  );
}
