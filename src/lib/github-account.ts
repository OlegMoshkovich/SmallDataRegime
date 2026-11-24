import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type GitHubAccount = { token: string; login: string; repo?: string };

const repoName = /^[\w.-]+\/[\w.-]+$/;

function githubHeaders(token: string) {
  return {
    authorization: `Bearer ${token}`,
    accept: "application/vnd.github+json",
    "user-agent": "small-data-regime",
    "x-github-api-version": "2022-11-28",
  };
}

const state = globalThis as {
  githubAccount?: GitHubAccount;
  githubOAuthStates?: Map<string, number>;
};

function oauthStates() {
  state.githubOAuthStates ??= new Map();
  return state.githubOAuthStates;
}

function envValue(name: string) {
  const fromProcess = process.env[name]?.trim();
  if (fromProcess) return fromProcess;
  const file = path.join(process.cwd(), ".env");
  if (!existsSync(file)) return undefined;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1 || trimmed.slice(0, eq).trim() !== name) continue;
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

function githubClientId() {
  return envValue("GITHUB_CLIENT_ID");
}

function githubClientSecret() {
  return envValue("GITHUB_CLIENT_SECRET");
}

export function githubOAuthReady() {
  return Boolean(githubClientId() && githubClientSecret());
}

export function githubStatus() {
  return {
    connected: Boolean(state.githubAccount),
    login: state.githubAccount?.login ?? null,
    repo: state.githubAccount?.repo ?? null,
    oauth: githubOAuthReady(),
  };
}

export function disconnectGitHub() {
  state.githubAccount = undefined;
  return githubStatus();
}

export async function connectGitHubToken(token: string) {
  const trimmed = token.trim();
  if (trimmed.length < 20) throw new Error("Paste a GitHub token.");
  const response = await fetch("https://api.github.com/user", {
    headers: githubHeaders(trimmed),
  });
  if (!response.ok) throw new Error("GitHub did not accept that token.");
  const body = (await response.json()) as { login?: unknown };
  if (typeof body.login !== "string" || !body.login) throw new Error("GitHub did not accept that token.");
  state.githubAccount = { token: trimmed, login: body.login };
  return githubStatus();
}

export function setGitHubRepo(fullName: string) {
  if (!state.githubAccount) throw new Error("Sign in to GitHub first.");
  if (!repoName.test(fullName)) throw new Error("Choose a repository.");
  state.githubAccount.repo = fullName;
  return githubStatus();
}

function nextPage(link: string | null) {
  if (!link) return null;
  for (const part of link.split(",")) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
}

export async function listGitHubRepos() {
  const token = state.githubAccount?.token;
  if (!token) throw new Error("Sign in to GitHub first.");
  const repos: string[] = [];
  let url: string | null =
    "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member";
  for (let page = 0; page < 3 && url; page += 1) {
    const response = await fetch(url, { headers: githubHeaders(token) });
    if (!response.ok) throw new Error("GitHub did not list repositories.");
    const body = (await response.json()) as Array<{ full_name?: unknown }>;
    for (const repo of body) {
      if (typeof repo.full_name === "string") repos.push(repo.full_name);
    }
    url = nextPage(response.headers.get("link"));
  }
  return repos;
}

export function beginGitHubOAuth() {
  const value = randomUUID();
  oauthStates().set(value, Date.now() + 10 * 60 * 1000);
  return value;
}

export function takeGitHubOAuth(value: string) {
  const expires = oauthStates().get(value);
  oauthStates().delete(value);
  return typeof expires === "number" && expires > Date.now();
}

export function githubAuthorizeUrl(origin: string, oauthState: string) {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", githubClientId() ?? "");
  url.searchParams.set("redirect_uri", `${origin}/api/agent/github/callback`);
  url.searchParams.set("scope", "read:user repo");
  url.searchParams.set("state", oauthState);
  return url.toString();
}

export async function exchangeGitHubCode(origin: string, code: string) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      client_id: githubClientId(),
      client_secret: githubClientSecret(),
      code,
      redirect_uri: `${origin}/api/agent/github/callback`,
    }),
  });
  const body = (await response.json()) as { access_token?: unknown };
  if (typeof body.access_token !== "string") throw new Error("GitHub did not connect.");
  return connectGitHubToken(body.access_token);
}
