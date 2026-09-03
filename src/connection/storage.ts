export type ConnectionDraft = {
  apiBase: string;
  /** Shared API secret (`MYNA_SECRET`). */
  secret: string;
};

const STORAGE_KEY = "myna-connection";

export function connectionDefaults(): ConnectionDraft {
  return {
    apiBase: (import.meta.env.VITE_API_BASE as string | undefined)?.trim().replace(/\/$/, "") || "",
    secret: (import.meta.env.VITE_MYNA_SECRET as string | undefined)?.trim() || "",
  };
}

export function readStoredConnection(): ConnectionDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConnectionDraft>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      apiBase: typeof parsed.apiBase === "string" ? parsed.apiBase : "",
      secret: typeof parsed.secret === "string" ? parsed.secret : "",
    };
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
