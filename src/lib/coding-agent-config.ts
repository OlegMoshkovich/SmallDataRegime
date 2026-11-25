import path from "node:path";

export function agentEnabled() {
  return true;
}

export function agentWorkspace() {
  return path.resolve(process.cwd(), "agent-workspace");
}
