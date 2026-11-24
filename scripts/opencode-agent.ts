import { createInterface } from "node:readline";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { OpenCode } from "@opencode/sdk";

type AgentEvent =
  | { kind: "text"; delta: string }
  | { kind: "tool"; name: string }
  | { kind: "status"; text: string }
  | { kind: "error"; text: string }
  | { kind: "done" };

const workspace = path.resolve(process.cwd(), "agent-workspace");

let hostPromise: Promise<Awaited<ReturnType<typeof OpenCode.create>>> | null = null;

function host() {
  hostPromise ??= OpenCode.create().catch((error: unknown) => {
    hostPromise = null;
    throw error;
  });
  return hostPromise;
}

function send(id: string, event: AgentEvent) {
  process.stdout.write(`${JSON.stringify({ id, event })}\n`);
}

function modelId(value: unknown) {
  const id = typeof value === "string" ? value.trim() : "";
  return /^[A-Za-z0-9][A-Za-z0-9._~-]*\/[A-Za-z0-9][A-Za-z0-9._~:/-]{0,100}$/.test(id) ? id : "openai/gpt-4.1";
}

async function run(id: string, text: string, model: string) {
  await mkdir(workspace, { recursive: true });
  const opencode = await host();
  const session = await opencode.sessions.create({
    title: "Coding agent",
    agent: "build",
    location: { directory: workspace },
    model: process.env.OPENROUTER_API_KEY ? { providerID: "openrouter", id: model } : undefined,
    permissions: [
      { action: "edit", resource: "*", effect: "allow" },
      { action: "shell", resource: "*", effect: "deny" },
    ],
  });

  let started = false;
  const subscription = (async () => {
    for await (const event of opencode.events.subscribe()) {
      if (!("data" in event) || !event.data || typeof event.data !== "object") continue;
      const data = event.data as {
        sessionID?: string;
        delta?: string;
        name?: string;
        id?: string;
        action?: string;
      };
      if (data.sessionID && data.sessionID !== session.id) continue;

      if (event.type === "permission.asked" && data.id) {
        await opencode.permission.reply({
          sessionID: session.id,
          requestID: data.id,
          decision: data.action === "shell" ? "reject" : "once",
        });
        send(id, {
          kind: "status",
          text: data.action === "shell" ? "Shell refused." : `Allowed ${data.action ?? "a step"}.`,
        });
        continue;
      }

      if (
        event.type === "session.execution.started" ||
        event.type === "session.text.delta" ||
        event.type === "session.tool.input.started"
      ) {
        started = true;
      }
      if (event.type === "session.text.delta" && data.delta) send(id, { kind: "text", delta: data.delta });
      if (event.type === "session.tool.input.started" && data.name) send(id, { kind: "tool", name: data.name });
      if (event.type === "session.tool.failed") send(id, { kind: "status", text: "A tool failed." });
      if (event.type === "session.execution.failed") {
        const error = event.data as { error?: { message?: string } };
        send(id, { kind: "error", text: error.error?.message || "The run failed." });
        return;
      }
      if ((event.type === "session.execution.succeeded" || event.type === "session.idle") && started) return;
    }
  })();

  await opencode.sessions.prompt({ sessionID: session.id, text });
  await subscription;
  send(id, { kind: "done" });
}

let chain = Promise.resolve();

const lines = createInterface({ input: process.stdin });
lines.on("line", (line) => {
  chain = chain.then(async () => {
    let id = "";
    try {
      const message = JSON.parse(line) as { id?: unknown; text?: unknown; model?: unknown };
      id = typeof message.id === "string" ? message.id : "";
      const text = typeof message.text === "string" ? message.text : "";
      if (!id || !text) return;
      await run(id, text, modelId(message.model));
    } catch (error) {
      if (id) {
        send(id, { kind: "error", text: error instanceof Error ? error.message : "The agent could not start." });
        send(id, { kind: "done" });
      } else {
        console.error(error);
      }
    }
  });
});
