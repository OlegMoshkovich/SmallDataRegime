import path from "node:path";

export function agentEnabled() {
  if (process.env.OPENCODE_AGENT === "0") return false;
  return process.env.NODE_ENV === "development" || process.env.OPENCODE_AGENT === "1";
}

export function agentWorkspace() {
  return path.resolve(process.cwd(), "agent-workspace");
}
