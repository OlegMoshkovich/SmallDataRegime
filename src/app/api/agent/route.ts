import { agentEnabled } from "@/lib/coding-agent-config";
import { currentOpenRouterModel, openRouterReady, openRouterUsage, runCodingAgent, setOpenRouterKey, setOpenRouterModel } from "@/lib/coding-agent";
import { connectGitHubToken, disconnectGitHub, githubStatus, listGitHubRepos, setGitHubRepo } from "@/lib/github-account";
import { openRouterModel } from "@/lib/openrouter-models";
import { openRouterCatalog } from "@/lib/openrouter-prices";

export async function POST(request: Request) {
  if (!agentEnabled()) {
    return Response.json({ error: "The coding agent is off." }, { status: 403 });
  }

  let text = "";
  let action = "";
  let key = "";
  let model = "";
  let token = "";
  let repo = "";
  try {
    const body = (await request.json()) as {
      text?: unknown;
      action?: unknown;
      key?: unknown;
      model?: unknown;
      token?: unknown;
      repo?: unknown;
    };
    text = typeof body.text === "string" ? body.text.trim() : "";
    action = typeof body.action === "string" ? body.action : "";
    key = typeof body.key === "string" ? body.key.trim() : "";
    model = openRouterModel(body.model) ?? "";
    token = typeof body.token === "string" ? body.token.trim() : "";
    repo = typeof body.repo === "string" ? body.repo.trim() : "";
  } catch {
    return Response.json({ error: "Send a prompt as JSON." }, { status: 400 });
  }

  if (action === "status") {
    return Response.json({ ready: openRouterReady(), model: currentOpenRouterModel(), github: githubStatus() });
  }

  if (action === "prices") {
    return Response.json({ models: await openRouterCatalog() });
  }

  if (action === "usage") {
    const usage = await openRouterUsage();
    if (!usage) return Response.json({ error: "OpenRouter usage is unavailable." }, { status: 400 });
    return Response.json({ usage });
  }

  if (action === "github-repos") {
    try {
      return Response.json({ repos: await listGitHubRepos() });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "GitHub did not list repositories." },
        { status: 400 },
      );
    }
  }

  if (action === "github-repo") {
    try {
      return Response.json({ github: setGitHubRepo(repo) });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Choose a repository." },
        { status: 400 },
      );
    }
  }

  if (action === "github") {
    if (!token) return Response.json({ github: disconnectGitHub() });
    try {
      return Response.json({ github: await connectGitHubToken(token) });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "GitHub did not connect." },
        { status: 400 },
      );
    }
  }

  if (action === "model") {
    if (!model) return Response.json({ error: "Choose an OpenRouter model id, like openai/gpt-4.1." }, { status: 400 });
    return Response.json({ ready: openRouterReady(), model: setOpenRouterModel(model) });
  }

  if (action === "key") {
    if (!key) {
      setOpenRouterKey("");
      return Response.json({ ready: openRouterReady(), model: currentOpenRouterModel() });
    }
    if (key.length < 20) {
      return Response.json({ error: "Paste an OpenRouter API key." }, { status: 400 });
    }
    setOpenRouterKey(key);
    return Response.json({ ready: true, model: model ? setOpenRouterModel(model) : currentOpenRouterModel() });
  }

  if (!text || text.length > 4000) {
    return Response.json({ error: "Write a prompt under 4,000 characters." }, { status: 400 });
  }

  if (!openRouterReady()) {
    return Response.json({ error: "Add an OpenRouter API key and connect GitHub to turn the agent on." }, { status: 403 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: unknown) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };
      try {
        for await (const event of await runCodingAgent(text, request.signal, model ? setOpenRouterModel(model) : currentOpenRouterModel())) send(event);
      } catch (error) {
        send({
          kind: "error",
          text: error instanceof Error ? error.message : "The agent could not start.",
        });
        send({ kind: "done" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
