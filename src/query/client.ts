import { QueryClient } from "@tanstack/react-query";
import { apiBase } from "../api/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

/** Include API origin in keys so connection switches don't reuse stale caches. */
export function apiScope(): string {
  return apiBase() || "local";
}

export const queryKeys = {
  overview: (days: number) => ["overview", apiScope(), days] as const,
  issues: (filters: Record<string, unknown>) => ["issues", apiScope(), filters] as const,
  issue: (id: number) => ["issue", apiScope(), id] as const,
};
