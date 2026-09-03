import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredConnection,
  connectionDefaults,
  effectiveConnection,
  hasConnectionOverride,
  readStoredConnection,
  writeStoredConnection,
  type ConnectionDraft,
} from "./storage";

type ConnectionContextValue = {
  draft: ConnectionDraft;
  effective: ConnectionDraft;
  overridden: boolean;
  save: (next: ConnectionDraft) => void;
  reset: () => void;
};

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

function initialDraft(): ConnectionDraft {
  return readStoredConnection() ?? connectionDefaults();
}

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<ConnectionDraft>(() => initialDraft());
  const [effective, setEffective] = useState<ConnectionDraft>(() => effectiveConnection());
  const [overridden, setOverridden] = useState(() => hasConnectionOverride());

  const save = useCallback((next: ConnectionDraft) => {
    const normalized: ConnectionDraft = {
      apiBase: next.apiBase.trim().replace(/\/$/, ""),
      secret: next.secret.trim(),
    };
    try {
      writeStoredConnection(normalized);
    } catch {
      /* private mode */
    }
    setDraft(normalized);
    setEffective({
      apiBase: normalized.apiBase || connectionDefaults().apiBase,
      secret: normalized.secret,
    });
    setOverridden(true);
  }, []);

  const reset = useCallback(() => {
    clearStoredConnection();
    const defaults = connectionDefaults();
    setDraft(defaults);
    setEffective(defaults);
    setOverridden(false);
  }, []);

  const value = useMemo(
    () => ({ draft, effective, overridden, save, reset }),
    [draft, effective, overridden, save, reset],
  );

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
}

export function useConnection(): ConnectionContextValue {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnection must be used within ConnectionProvider");
  return ctx;
}
