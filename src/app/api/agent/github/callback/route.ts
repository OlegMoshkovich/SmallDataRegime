import { agentEnabled } from "@/lib/coding-agent-config";
import { exchangeGitHubCode, takeGitHubOAuth } from "@/lib/github-account";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const back = (result: "connected" | "error") => Response.redirect(new URL(`/coder?github=${result}`, url.origin));
  if (!agentEnabled()) return back("error");
  const code = url.searchParams.get("code") ?? "";
  const oauthState = url.searchParams.get("state") ?? "";
  if (!code || !takeGitHubOAuth(oauthState)) return back("error");
  try {
    await exchangeGitHubCode(url.origin, code);
    return back("connected");
  } catch {
    return back("error");
  }
}
