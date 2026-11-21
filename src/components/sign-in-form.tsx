"use client";

import { useState } from "react";

export function SignInForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="max-w-md border border-line bg-surface p-6 text-base leading-snug">
        This preview has no account service. Use Contact to request a lab, or
        return when sign-in is connected.
      </p>
    );
  }

  return (
    <form
      className="grid max-w-md gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <label className="grid gap-2 text-sm">
        <span className="font-mono text-[0.75rem] tracking-[-0.015rem] uppercase">
          Work email
        </span>
        <input
          required
          type="email"
          className="h-11 border border-line bg-surface px-3 outline-none focus:border-foreground"
        />
      </label>
      <button
        type="submit"
        className="h-[31px] w-max bg-ink px-3.5 font-mono text-[0.8125rem] tracking-[-0.0175rem] text-paper uppercase"
      >
        Continue
      </button>
    </form>
  );
}
