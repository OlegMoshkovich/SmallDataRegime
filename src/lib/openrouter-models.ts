export const openRouterModels = [
  "openai/gpt-4.1",
  "openai/gpt-4.1-mini",
  "openai/gpt-5.6-sol",
  "openai/gpt-5.3-codex",
  "anthropic/claude-sonnet-5.5",
  "anthropic/claude-haiku-5.5",
  "google/gemini-3.8-flash",
  "deepseek/deepseek-v4-flash",
  "qwen/qwen3-coder-next",
] as const;

export const defaultOpenRouterModel = openRouterModels[0];

const modelPattern = /^[A-Za-z0-9][A-Za-z0-9._~-]*\/[A-Za-z0-9][A-Za-z0-9._~:/-]{0,100}$/;

export function openRouterModel(value: unknown) {
  const id = typeof value === "string" ? value.trim() : "";
  return modelPattern.test(id) ? id : null;
}
