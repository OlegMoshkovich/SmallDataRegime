"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { defaultOpenRouterModel, openRouterModel, openRouterModels } from "@/lib/openrouter-models";
import type { CatalogModel } from "@/lib/openrouter-prices";

type Line = { id: number; role: "you" | "agent" | "note"; text: string };

type Usage = { spend: number; byok: number; limit: number | null; remaining: number | null };

function usd(value: number) {
  return value >= 1 || value === 0 ? `$${value.toFixed(2)}` : `$${value.toFixed(3)}`;
}

function usdPerMillion(value: number) {
  return `$${value.toFixed(value >= 1 ? 2 : 3)}`;
}

export function CodingAgent({ enabled, initialReady = false, headerLeft }: { enabled: boolean; initialReady?: boolean; headerLeft?: React.ReactNode }) {
  const [prompt, setPrompt] = useState("");
  const [key, setKey] = useState("");
  const [ready, setReady] = useState(initialReady);
  const [choice, setChoice] = useState<string>(defaultOpenRouterModel);
  const [custom, setCustom] = useState("");
  const [keyNote, setKeyNote] = useState(initialReady ? "OpenRouter is connected." : "");
  const [saving, setSaving] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState<"key" | "model" | "github">("key");
  const [githubToken, setGithubToken] = useState("");
  const [githubLogin, setGithubLogin] = useState<string | null>(null);
  const [githubRepo, setGithubRepo] = useState("");
  const [repos, setRepos] = useState<string[]>([]);
  const [githubOauth, setGithubOauth] = useState(false);
  const [githubNote, setGithubNote] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [models, setModels] = useState<CatalogModel[]>([]);
  const prices = useMemo(() => Object.fromEntries(models.map((model) => [model.id, model])), [models]);
  const listed = models.length > 0 ? models.map((model) => model.id) : [...openRouterModels];
  const selectedModel = openRouterModel(choice === "custom" ? custom : choice);
  const frame = useRef<HTMLDivElement>(null);
  const thread = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const available = Math.floor(window.innerHeight - top - 24);
      el.style.height = available >= 320 ? `${available}px` : "";
    };
    fit();
    const intro = document.querySelector("[data-agent-intro]");
    const observer = intro ? new ResizeObserver(fit) : null;
    observer?.observe(intro!);
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    const el = thread.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines, busy]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "status" }),
    })
      .then((response) => response.json())
      .then((payload: { ready?: boolean; model?: string; github?: { connected?: boolean; login?: string | null; repo?: string | null; oauth?: boolean } }) => {
        if (cancelled) return;
        setReady(Boolean(payload.ready));
        setGithubOauth(Boolean(payload.github?.oauth));
        setGithubLogin(payload.github?.connected && payload.github.login ? payload.github.login : null);
        setGithubRepo(payload.github?.repo ?? "");
        const next = openRouterModel(payload.model) ?? defaultOpenRouterModel;
        setChoice(next);
        setCustom("");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!githubLogin) {
      setRepos([]);
      return;
    }
    let cancelled = false;
    fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "github-repos" }),
    })
      .then((response) => response.json())
      .then((payload: { repos?: string[]; error?: string }) => {
        if (cancelled) return;
        if (payload.repos) setRepos(payload.repos);
        else if (payload.error) setGithubNote(payload.error);
      })
      .catch(() => {
        if (!cancelled) setGithubNote("GitHub did not list repositories.");
      });
    return () => {
      cancelled = true;
    };
  }, [githubLogin]);

  useEffect(() => {
    if (!enabled || !ready) {
      setUsage(null);
      return;
    }
    let cancelled = false;
    fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "usage" }),
    })
      .then((response) => response.json())
      .then((payload: { usage?: Usage }) => {
        if (!cancelled) setUsage(payload.usage ?? null);
      })
      .catch(() => {
        if (!cancelled) setUsage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, ready]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch("/api/agent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "prices" }),
    })
      .then((response) => response.json())
      .then((payload: { models?: CatalogModel[] }) => {
        if (!cancelled && payload.models?.length) setModels(payload.models);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("github");
    if (result !== "connected" && result !== "error") return;
    setPanel("github");
    if (result === "error") setGithubNote("GitHub did not connect.");
    params.delete("github");
    const next = params.toString();
    window.history.replaceState(null, "", next ? `${window.location.pathname}?${next}` : window.location.pathname);
  }, []);

  async function saveKey(event: React.FormEvent) {
    event.preventDefault();
    const next = key.trim();
    if (!next || saving) return;
    setSaving(true);
    setKeyNote("");
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "key", key: next, model: selectedModel ?? undefined }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string; ready?: boolean } | null;
      if (!response.ok) {
        setKeyNote(payload?.error ?? "The key was not saved.");
        return;
      }
      setKey("");
      setReady(Boolean(payload?.ready));
      setKeyNote("OpenRouter is connected.");
    } catch {
      setKeyNote("The key was not saved.");
    } finally {
      setSaving(false);
    }
  }

  async function connectGitHub(event: React.FormEvent) {
    event.preventDefault();
    if (connecting) return;
    setConnecting(true);
    setGithubNote("");
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "github", token: githubToken.trim() }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        github?: { connected?: boolean; login?: string | null };
      } | null;
      if (!response.ok) {
        setGithubNote(payload?.error ?? "GitHub did not connect.");
        return;
      }
      setGithubToken("");
      setGithubLogin(payload?.github?.login ?? null);
      setGithubNote(payload?.github?.login ? `Signed in as ${payload.github.login}.` : "");
    } catch {
      setGithubNote("GitHub did not connect.");
    } finally {
      setConnecting(false);
    }
  }

  async function disconnectGitHub() {
    setConnecting(true);
    setGithubNote("");
    try {
      await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "github", token: "" }),
      });
      setGithubLogin(null);
      setGithubRepo("");
      setRepos([]);
    } catch {
      setGithubNote("GitHub stayed connected.");
    } finally {
      setConnecting(false);
    }
  }

  async function chooseRepo(fullName: string) {
    if (!fullName) return;
    setGithubRepo(fullName);
    setGithubNote("");
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "github-repo", repo: fullName }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) setGithubNote(payload?.error ?? "Choose a repository.");
    } catch {
      setGithubNote("Choose a repository.");
    }
  }

  async function chooseModel(next: string) {
    const id = openRouterModel(next);
    if (!id) return;
    try {
      await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "model", model: id }),
      });
    } catch {
      setKeyNote("The model was not saved.");
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text || busy) return;
    setPrompt("");
    setBusy(true);
    const user: Line = { id: Date.now(), role: "you", text };
    const reply: Line = { id: Date.now() + 1, role: "agent", text: "" };
    setLines((current) => [...current, user, reply]);

    const write = (next: string, role: Line["role"] = "agent") => {
      setLines((current) => {
        const copy = [...current];
        const last = copy[copy.length - 1];
        if (last && last.role === "agent" && role === "agent") {
          copy[copy.length - 1] = { ...last, text: last.text + next };
          return copy;
        }
        copy.push({ id: Date.now() + copy.length, role, text: next });
        return copy;
      });
    };

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, model: selectedModel }),
      });
      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        write(payload?.error ?? "The agent did not answer.", "note");
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          if (!part) continue;
          const item = JSON.parse(part) as { kind?: string; delta?: string; name?: string; text?: string };
          if (item.kind === "text" && item.delta) write(item.delta);
          if (item.kind === "tool" && item.name) write(item.name, "note");
          if (item.kind === "status" && item.text) write(item.text, "note");
          if (item.kind === "error" && item.text) write(item.text, "note");
        }
      }
    } catch {
      write("The connection to the agent dropped.", "note");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {headerLeft}
        <div
          className="flex w-full flex-wrap gap-2 lg:ml-auto lg:w-auto lg:gap-0 lg:border lg:border-line"
          role="group"
          aria-label="Agent settings"
        >
          {(
            [
              ["key", "Key"],
              ["model", "Model"],
              ["github", "GitHub"],
            ] as const
          ).map(([id, label], index) => (
            <button
              key={id}
              type="button"
              aria-pressed={panel === id}
              onClick={() => setPanel(id)}
              className={`h-[31px] px-3.5 font-mono text-[0.75rem] tracking-[-0.015rem] uppercase max-lg:border max-lg:border-line ${
                index > 0 ? "lg:border-l lg:border-line" : ""
              } ${panel === id ? "bg-foreground text-background" : "bg-surface text-muted"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={frame} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
      <div className="flex min-h-0 flex-col border border-line bg-surface">
      <div ref={thread} className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto p-4">
        {lines.length === 0 ? (
          <p className="text-sm text-muted">
            {ready
              ? "Ask it to draft a file in the workspace."
              : "Add an OpenRouter API key to turn the agent on."}
          </p>
        ) : (
          lines.map((line) => (
            <p
              key={line.id}
              className={
                line.role === "note"
                  ? "font-mono text-xs tracking-[-0.01em] text-muted"
                  : line.role === "you"
                    ? "text-sm"
                    : "whitespace-pre-wrap text-sm"
              }
            >
              {line.role === "you" ? "You. " : line.role === "note" ? "" : "Agent. "}
              {line.text || (busy && line.role === "agent" ? "…" : "")}
            </p>
          ))
        )}
      </div>
      <form onSubmit={submit} className="flex shrink-0 items-end gap-3 border-t border-line p-4">
        <label className="grid min-w-0 flex-1 gap-2">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">Prompt</span>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={!enabled || !ready || !selectedModel || busy}
            rows={3}
            placeholder="Write a short note in the workspace about the current change."
            className="w-full resize-none border border-line bg-background px-3 py-2 text-sm outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={!enabled || !ready || !selectedModel || busy || prompt.trim().length === 0}
          className="h-[31px] border border-transparent bg-ink px-3.5 font-mono text-[0.8125rem] capitalize text-paper disabled:opacity-40"
        >
          Send
        </button>
      </form>
      </div>
      <div className="grid content-start gap-4">
        <div className="grid">
        <form
          onSubmit={saveKey}
          inert={panel !== "key"}
          className={`col-start-1 row-start-1 grid content-start gap-3 border border-line bg-surface p-4 ${panel === "key" ? "" : "invisible"}`}
        >
          <label className="grid gap-2">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">OpenRouter API key</span>
            <input
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              disabled={!enabled || saving}
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-or-…"
              className="w-full border border-line bg-background px-3 py-2 text-sm outline-none"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!enabled || saving || key.trim().length === 0}
              className="h-[31px] border border-transparent bg-ink px-3.5 font-mono text-[0.8125rem] capitalize text-paper disabled:opacity-40"
            >
              {ready ? "Replace" : "Save"}
            </button>
            {keyNote ? <p className="text-sm text-muted">{keyNote}</p> : null}
          </div>
        </form>
        <div
          inert={panel !== "model"}
          className={`col-start-1 row-start-1 grid content-start gap-3 border border-line bg-surface p-4 ${panel === "model" ? "" : "invisible"}`}
        >
          <label className="grid gap-2">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">Model</span>
            <span className="relative block">
              <select
                value={choice}
                onChange={(event) => {
                  const next = event.target.value;
                  setChoice(next);
                  if (next !== "custom") void chooseModel(next);
                }}
                disabled={!enabled || busy}
                className="w-full appearance-none border border-line bg-background py-2 pr-10 pl-3 text-sm outline-none"
              >
                {(selectedModel && !listed.includes(selectedModel) ? [selectedModel, ...listed] : listed).map((id) => (
                  <option key={id} value={id}>
                    {prices[id] ? `${id} · ${usdPerMillion(prices[id].input)}` : id}
                  </option>
                ))}
                <option value="custom">Other OpenRouter model</option>
              </select>
              <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[0.65rem] leading-none">
                ▾
              </span>
            </span>
          </label>
          {choice === "custom" ? (
            <label className="grid gap-2">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">OpenRouter model id</span>
              <input
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                onBlur={(event) => {
                  const id = openRouterModel(event.currentTarget.value);
                  if (id) void chooseModel(id);
                }}
                disabled={!enabled || busy}
                spellCheck={false}
                placeholder="provider/model"
                className="w-full border border-line bg-background px-3 py-2 text-sm outline-none"
              />
            </label>
          ) : null}
          {choice === "custom" && custom.trim() && !selectedModel ? (
            <p className="text-sm text-muted">Use a provider/model id, like openai/gpt-4.1.</p>
          ) : null}
          {selectedModel && prices[selectedModel] ? (
            <p className="text-sm text-muted">
              Input {usdPerMillion(prices[selectedModel].input)} / M · Output {usdPerMillion(prices[selectedModel].output)} / M
            </p>
          ) : null}
        </div>
        <form
          onSubmit={connectGitHub}
          inert={panel !== "github"}
          className={`col-start-1 row-start-1 grid content-start gap-3 border border-line bg-surface p-4 ${panel === "github" ? "" : "invisible"}`}
        >
          <div className="grid gap-2">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">GitHub account</span>
            {githubLogin ? (
              <p className="text-sm">Signed in as {githubLogin}.</p>
            ) : githubOauth ? (
              <a
                href="/api/agent/github"
                className="inline-flex h-[31px] w-fit items-center border border-transparent bg-ink px-3.5 font-mono text-[0.8125rem] capitalize text-paper"
              >
                Sign in
              </a>
            ) : (
              <input
                type="password"
                value={githubToken}
                onChange={(event) => setGithubToken(event.target.value)}
                disabled={!enabled || connecting}
                autoComplete="off"
                spellCheck={false}
                placeholder="ghp_…"
                className="w-full border border-line bg-background px-3 py-2 text-sm outline-none"
              />
            )}
          </div>
          {githubLogin ? (
            <label className="grid gap-2">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">Repository</span>
              <span className="relative block">
                <select
                  value={githubRepo}
                  onChange={(event) => void chooseRepo(event.target.value)}
                  disabled={!enabled || connecting || repos.length === 0}
                  className="w-full appearance-none border border-line bg-background py-2 pr-10 pl-3 text-sm outline-none"
                >
                  <option value="">{repos.length === 0 ? "Loading repositories" : "Choose a repository"}</option>
                  {(githubRepo && !repos.includes(githubRepo) ? [githubRepo, ...repos] : repos).map((fullName) => (
                    <option key={fullName} value={fullName}>
                      {fullName}
                    </option>
                  ))}
                </select>
                <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[0.65rem] leading-none">
                  ▾
                </span>
              </span>
            </label>
          ) : null}
          <div className="flex items-center gap-3">
            {githubLogin ? (
              <button
                type="button"
                onClick={() => void disconnectGitHub()}
                disabled={!enabled || connecting}
                className="inline-flex h-[31px] shrink-0 items-center whitespace-nowrap border border-transparent bg-ink px-3.5 font-mono text-[0.8125rem] capitalize text-paper disabled:opacity-40"
              >
                Sign out
              </button>
            ) : githubOauth ? null : (
              <button
                type="submit"
                disabled={!enabled || connecting || githubToken.trim().length === 0}
                className="inline-flex h-[31px] shrink-0 items-center whitespace-nowrap border border-transparent bg-ink px-3.5 font-mono text-[0.8125rem] capitalize text-paper disabled:opacity-40"
              >
                Sign in
              </button>
            )}
            <p className="text-sm text-muted">
              {githubNote ||
                (githubLogin
                  ? githubRepo || "Choose a repository."
                  : githubOauth
                    ? "Sign in with GitHub, then choose a repository."
                    : "Paste a token to sign in, then choose a repository.")}
            </p>
          </div>
        </form>
        </div>
        {usage ? (
          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border border-line bg-surface p-4 text-sm">
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">OpenRouter spend</dt>
            <dd className="font-mono">{usd(usage.spend)}</dd>
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">BYOK</dt>
            <dd className="font-mono">{usd(usage.byok)}</dd>
            {usage.remaining != null && usage.limit != null ? (
              <>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">Remaining</dt>
                <dd className="font-mono">
                  {usd(usage.remaining)} of {usd(usage.limit)}
                </dd>
              </>
            ) : null}
          </dl>
        ) : null}
      </div>
      </div>
    </div>
  );
}
