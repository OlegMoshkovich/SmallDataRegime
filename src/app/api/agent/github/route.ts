import { agentEnabled } from "@/lib/coding-agent-config";
import { beginGitHubOAuth, githubAuthorizeUrl, githubOAuthReady } from "@/lib/github-account";

export async function GET(request: Request) {
  if (!agentEnabled()) {
    return Response.json({ error: "The coding agent is off." }, { status: 403 });
  }
  if (!githubOAuthReady()) {
    return Response.json({ error: "Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to connect with GitHub." }, { status: 400 });
  }
  const origin = new URL(request.url).origin;
  return Response.redirect(githubAuthorizeUrl(origin, beginGitHubOAuth()));
}
