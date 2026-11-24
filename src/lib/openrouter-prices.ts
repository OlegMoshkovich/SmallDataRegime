export type ModelPrice = { input: number; output: number };

export type CatalogModel = ModelPrice & { id: string };

const cache = globalThis as { openRouterCatalog?: { at: number; models: CatalogModel[] } };

function perMillion(value: unknown) {
  const number = typeof value === "string" || typeof value === "number" ? Number(value) : Number.NaN;
  if (!Number.isFinite(number)) return null;
  return Math.round(number * 1_000_000 * 1e6) / 1e6;
}

export async function openRouterCatalog() {
  const cached = cache.openRouterCatalog;
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.models;
  const response = await fetch("https://openrouter.ai/api/v1/models?output_modalities=all", { cache: "no-store" });
  if (!response.ok) return cached?.models ?? [];
  const body = (await response.json()) as {
    data?: Array<{ id?: unknown; created?: unknown; pricing?: { prompt?: unknown; completion?: unknown } }>;
  };
  const models = (body.data ?? [])
    .flatMap((model) => {
      if (typeof model.id !== "string") return [];
      const input = perMillion(model.pricing?.prompt);
      const output = perMillion(model.pricing?.completion);
      if (input === null || output === null) return [];
      return [{ id: model.id, input, output, created: typeof model.created === "number" ? model.created : 0 }];
    })
    .sort((a, b) => b.created - a.created || a.id.localeCompare(b.id))
    .map(({ id, input, output }) => ({ id, input, output }));
  cache.openRouterCatalog = { at: Date.now(), models };
  return models;
}
