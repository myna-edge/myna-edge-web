import { effectiveConnection, hasConnectionOverride } from "../connection/storage";

function envApiBase(): string {
  const raw = (import.meta.env.VITE_API_BASE as string | undefined)?.trim();
  if (!raw) {
    if (import.meta.env.PROD) {
      throw new Error(
        "VITE_API_BASE 未配置。请在 Cloudflare Pages 的 Environment variables（或本地 .env.production）中填入 API Worker 地址后重新构建",
      );
    }
    return "";
  }
  return raw.replace(/\/$/, "");
}

/** Resolve API origin. Optional `override` is for unsaved draft testing. */
export function apiBase(override?: string): string {
  if (override !== undefined) {
    const trimmed = override.trim().replace(/\/$/, "");
    if (trimmed) return trimmed;
    return envApiBase();
  }
  const effective = effectiveConnection().apiBase.trim().replace(/\/$/, "");
  if (effective) return effective;
  return envApiBase();
}

export function ingestDsn(overrideBase?: string): string {
  const base = apiBase(overrideBase);
  if (base) return `${base}/api/ingest`;
  if (import.meta.env.DEV) return "http://127.0.0.1:43127/api/ingest";
  return "/api/ingest";
}

export function apiDisplayBase(overrideBase?: string): string {
  const base = apiBase(overrideBase);
  if (base) return base;
  if (import.meta.env.DEV) return "http://127.0.0.1:43127（代理 → :8787）";
  return "（开发代理）";
}

/** Panel write auth + guide snippet token (one shared secret in settings). */
export function adminToken(): string {
  if (hasConnectionOverride()) return effectiveConnection().secret.trim();
  return (import.meta.env.VITE_MYNA_ADMIN_TOKEN as string | undefined)?.trim() || "";
}

export function ingestToken(): string {
  if (hasConnectionOverride()) return effectiveConnection().secret.trim();
  return (import.meta.env.VITE_MYNA_INGEST_TOKEN as string | undefined)?.trim() || "";
}

export function adminHeaders(): HeadersInit {
  const token = adminToken();
  if (!token) return {};
  return { "X-Myna-Admin-Token": token };
}

export async function readError(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error || `请求失败 (${res.status})`;
}
