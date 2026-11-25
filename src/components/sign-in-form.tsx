"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <form className="grid max-w-xs gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm">
        <span className="flex items-center gap-2 font-mono text-[0.75rem] tracking-[-0.015rem] text-accent uppercase">
          <span className="size-1.5 bg-accent" aria-hidden />
          Password
        </span>
        <input
          required
          type="password"
          autoComplete="current-password"
          autoFocus
          placeholder="_"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          className="h-11 border border-line bg-surface px-3 font-mono text-sm text-foreground outline-none focus:border-foreground placeholder:text-faint"
        />
        {error && (
          <span className="font-mono text-[0.65rem] text-accent">
            Incorrect password
          </span>
        )}
      </label>
      <button
        type="submit"
        disabled={loading}
        className="h-[31px] w-max bg-ink px-3.5 font-mono text-[0.8125rem] tracking-[-0.0175rem] text-paper capitalize disabled:opacity-50"
      >
        {loading ? "…" : "Enter"}
      </button>
    </form>
  );
}
