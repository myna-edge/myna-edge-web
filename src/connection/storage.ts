export type ConnectionDraft = {
  apiBase: string;
  /** Shared API secret for panel auth + guide snippet prefill. */
  secret: string;
};

const STORAGE_KEY = "myna-connection";

export function connectionDefaults(): ConnectionDraft {
  const admin = (import.meta.env.VITE_MYNA_ADMIN_TOKEN as string | undefined)?.trim() || "";
  const ingest = (import.meta.env.VITE_MYNA_INGEST_TOKEN as string | undefined)?.trim() || "";
  return {
    apiBase: (import.meta.env.VITE_API_BASE as string | undefined)?.trim().replace(/\/$/, "") || "",
    secret: admin || ingest,
  };
}

function normalizeDraft(raw: Partial<ConnectionDraft> & {
  adminToken?: string;
  ingestToken?: string;
}): ConnectionDraft {
  const secretFromLegacy =
    (typeof raw.adminToken === "string" && raw.adminToken) ||
    (typeof raw.ingestToken === "string" && raw.ingestToken) ||
    "";
  return {
    apiBase: typeof raw.apiBase === "string" ? raw.apiBase : "",
    secret: typeof raw.secret === "string" ? raw.secret : secretFromLegacy,
  };
}

export function readStoredConnection(): ConnectionDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConnectionDraft> & {
      adminToken?: string;
      ingestToken?: string;
    };
    if (!parsed || typeof parsed !== "object") return null;
    return normalizeDraft(parsed);
  } catch {
    return null;
  }
}

export function writeStoredConnection(draft: ConnectionDraft): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      apiBase: draft.apiBase.trim().replace(/\/$/, ""),
      secret: draft.secret.trim(),
    }),
  );
}

export function clearStoredConnection(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

/** Effective values used by API client. When no override, equals build-time defaults. */
export function effectiveConnection(): ConnectionDraft {
  const defaults = connectionDefaults();
  const stored = readStoredConnection();
  if (!stored) return defaults;
  return {
    apiBase: stored.apiBase.trim() || defaults.apiBase,
    secret: stored.secret,
  };
}

export function hasConnectionOverride(): boolean {
  return readStoredConnection() !== null;
}
