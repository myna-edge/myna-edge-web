import { useEffect, useState } from "react";
import { fetchOverview } from "../api";
import type { DashboardDays } from "../components/dashboard/constants";

export function useDashboard(days: DashboardDays) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchOverview>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const overview = await fetchOverview(days);
        if (cancelled) return;
        setData(overview);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "加载失败");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  return {
    stats: data?.stats ?? null,
    trend: data?.trend ?? [],
    days: data?.days ?? days,
    byEnvironment: data?.byEnvironment ?? [],
    byRelease: data?.byRelease ?? [],
    byType: data?.byType ?? [],
    byPage: data?.byPage ?? [],
    topIssues: data?.topIssues ?? [],
    newIssueTrend: data?.newIssueTrend ?? [],
    newIssueCount: data?.newIssueCount ?? 0,
    error,
    loading,
  };
}
