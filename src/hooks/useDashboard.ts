import { useQuery } from "@tanstack/react-query";
import { fetchOverview } from "../api";
import type { DashboardDays } from "../components/dashboard/constants";
import { queryKeys } from "../query/client";

export function useDashboard(days: DashboardDays) {
  const query = useQuery({
    queryKey: queryKeys.overview(days),
    queryFn: () => fetchOverview(days),
  });

  const data = query.data;

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
    error: query.error ? (query.error instanceof Error ? query.error.message : "加载失败") : null,
    /** True only when there is no cached data yet. */
    loading: query.isPending,
  };
}
