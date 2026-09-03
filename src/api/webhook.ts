import { adminHeaders, apiBase, readError } from "./client";
import type { HealthResponse, WebhookConfig } from "./types";

export async function fetchHealth(overrideBase?: string): Promise<HealthResponse> {
  const res = await fetch(`${apiBase(overrideBase)}/api/health`);
  if (!res.ok) throw new Error(`GET /api/health → ${res.status}`);
  return res.json();
}

export async function fetchWebhookConfig(): Promise<WebhookConfig> {
  const res = await fetch(`${apiBase()}/api/settings/webhook`);
  if (!res.ok) throw new Error(await readError(res));
  const body = (await res.json()) as { config: WebhookConfig };
  return body.config;
}

export async function saveWebhookConfig(config: WebhookConfig): Promise<WebhookConfig> {
  const res = await fetch(`${apiBase()}/api/settings/webhook`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...adminHeaders() },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(await readError(res));
  const body = (await res.json()) as { config: WebhookConfig };
  return body.config;
}

export async function testWebhookConfig(): Promise<void> {
  const res = await fetch(`${apiBase()}/api/settings/webhook/test`, {
    method: "POST",
    headers: adminHeaders(),
  });
  if (!res.ok) throw new Error(await readError(res));
}
