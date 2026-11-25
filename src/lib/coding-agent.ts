import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { homedir } from "node:os";
import { defaultOpenRouterModel, openRouterModel } from "@/lib/openrouter-models";

export type AgentEvent =
  | { kind: "text"; delta: string }
  | { kind: "tool"; name: string }
  | { kind: "status"; text: string }
  | { kind: "error"; text: string }
  | { kind: "done" };

type Pending = {
  push: (event: AgentEvent) => void;
  fail: (text: string) => void;
};

type Worker = {
  child: ChildProcess;
  pending: Map<string, Pending>;
};

const globalWorker = globalThis as { codingAgent?: Worker; openRouterKey?: string; openRouterModel?: string };

function envOpenRouterKey() {
  const fromProcess = process.env.OPENROUTER_API_KEY?.trim();
  if (fromProcess) return fromProcess;
  const file = path.join(process.cwd(), ".env");
  if (!existsSync(file)) return undefined;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1 || trimmed.slice(0, eq).trim() !== "OPENROUTER_API_KEY") continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    return value || undefined;
  }
  return undefined;
}

function activeOpenRouterKey() {
  return globalWorker.openRouterKey || envOpenRouterKey();
}

export function openRouterReady() {
  return Boolean(activeOpenRouterKey());
}

export function currentOpenRouterModel() {
  return globalWorker.openRouterModel || defaultOpenRouterModel;
}

export function setOpenRouterModel(model: string) {
  const next = openRouterModel(model);
  if (!next) return currentOpenRouterModel();
  globalWorker.openRouterModel = next;
  return next;
}

export type OpenRouterUsage = {
  spend: number;
  byok: number;
  limit: number | null;
  remaining: number | null;
};

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function openRouterUsage(): Promise<OpenRouterUsage | null> {
  const key = activeOpenRouterKey();
  if (!key) return null;
  const response = await fetch("https://openrouter.ai/api/v1/key", {
    headers: { authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  const body = (await response.json()) as {
    data?: { usage?: unknown; byok_usage?: unknown; limit?: unknown; limit_remaining?: unknown };
  };
  const spend = finiteNumber(body.data?.usage);
  const byok = finiteNumber(body.data?.byok_usage);
  if (spend === null || byok === null) return null;
  return {
    spend,
    byok,
    limit: finiteNumber(body.data?.limit),
    remaining: finiteNumber(body.data?.limit_remaining),
  };
}

export function setOpenRouterKey(key: string) {
  const next = key.trim();
  globalWorker.openRouterKey = next || undefined;
  const existing = globalWorker.codingAgent;
  globalWorker.codingAgent = undefined;
  if (existing && existing.child.exitCode === null) existing.child.kill();
}

function bunBin() {
  const local = path.join(homedir(), ".bun", "bin", "bun");
  return existsSync(local) ? local : "bun";
}

function startWorker() {
  const existing = globalWorker.codingAgent;
  if (existing && existing.child.exitCode === null && !existing.child.killed) return existing;

  const key = activeOpenRouterKey();
  const child = spawn(bunBin(), ["scripts/opencode-agent.ts"], {
    cwd: process.cwd(),
    stdio: ["pipe", "pipe", "inherit"],
    env: {
      ...process.env,
      XDG_STATE_HOME: path.join(process.cwd(), "agent-workspace", ".state"),
      ...(key ? { OPENROUTER_API_KEY: key } : {}),
    },
  });
  const worker: Worker = { child, pending: new Map() };
  let buffer = "";

  const failAll = (text: string) => {
    for (const pending of worker.pending.values()) pending.fail(text);
    worker.pending.clear();
  };

  child.stdout?.setEncoding("utf8");
  child.stdout?.on("data", (chunk: string) => {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line) continue;
      let message: { id?: string; event?: AgentEvent };
      try {
        message = JSON.parse(line) as { id?: string; event?: AgentEvent };
      } catch {
        continue;
      }
      if (!message.id || !message.event) continue;
      const pending = worker.pending.get(message.id);
      if (!pending) continue;
      pending.push(message.event);
      if (message.event.kind === "done") worker.pending.delete(message.id);
    }
  });
  child.on("error", () => failAll("Bun is not available, so the coding agent cannot start."));
  child.on("exit", () => failAll("The coding agent stopped."));
  globalWorker.codingAgent = worker;
  return worker;
}

export async function* runCodingAgent(text: string, signal: AbortSignal, model = currentOpenRouterModel()): AsyncGenerator<AgentEvent> {
  if (!openRouterReady()) {
    yield { kind: "error", text: "Add an OpenRouter API key and connect GitHub to turn the agent on." };
    yield { kind: "done" };
    return;
  }
  const worker = startWorker();
  const id = randomUUID();
  const queue: AgentEvent[] = [];
  let finished = false;
  let wake: (() => void) | undefined;

  const poke = () => {
    wake?.();
    wake = undefined;
  };

  worker.pending.set(id, {
    push: (event) => {
      queue.push(event);
      if (event.kind === "done") finished = true;
      poke();
    },
    fail: (text) => {
      queue.push({ kind: "error", text }, { kind: "done" });
      finished = true;
      poke();
    },
  });

  const abort = () => {
    worker.pending.delete(id);
    finished = true;
    poke();
  };
  signal.addEventListener("abort", abort, { once: true });

  const written = worker.child.stdin?.write(`${JSON.stringify({ id, text, model })}\n`) ?? false;
  if (!written) {
    yield { kind: "error", text: "The coding agent could not take the prompt." };
    yield { kind: "done" };
    return;
  }

  try {
    while (!finished || queue.length > 0) {
      if (queue.length === 0) await new Promise<void>((resolve) => { wake = resolve });
      while (queue.length > 0) yield queue.shift()!;
      if (signal.aborted) break;
    }
  } finally {
    signal.removeEventListener("abort", abort);
    worker.pending.delete(id);
  }
}
