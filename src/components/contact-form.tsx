"use client";

import { useState } from "react";

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Work email", type: "email" },
  { name: "org", label: "Lab or company", type: "text" },
] as const;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border border-line bg-surface p-6">
        <p className="font-mono text-[0.75rem] tracking-[-0.015rem] text-muted uppercase">
          Request noted
        </p>
        <p className="mt-3 max-w-md text-base leading-snug">
          This preview stores nothing. Someone from the lab follows up about the
          workflow, the team, and what a first run has to prove.
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid max-w-lg gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      {fields.map((field) => (
        <label key={field.name} className="grid gap-2 text-sm">
          <span className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
            {field.label}
          </span>
          <input
            required
            name={field.name}
            type={field.type}
            className="h-11 border border-line bg-surface px-3 outline-none focus:border-foreground"
          />
        </label>
      ))}
      <label className="grid gap-2 text-sm">
        <span className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
          What should we scope
        </span>
        <textarea
          required
          name="task"
          rows={5}
          className="border border-line bg-surface px-3 py-3 outline-none focus:border-foreground"
          placeholder="The workflow, who owns it, and what a first run has to prove."
        />
      </label>
      <button
        type="submit"
        className="mt-2 h-[31px] w-max bg-ink px-3.5 font-mono text-[0.8125rem] tracking-[-0.0175rem] text-paper uppercase"
      >
        Talk to us
      </button>
    </form>
  );
}
