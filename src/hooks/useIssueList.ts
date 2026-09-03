import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchIssues, type TabStatus } from "../api";
import { ISSUE_TABS, PAGE_SIZE, parseIssuePeriod, parseIssueSort } from "../components/home/constants";
import { queryKeys } from "../query/client";

export function useIssueList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = (searchParams.get("status") as TabStatus) || "open";
  const environment = searchParams.get("environment") || "";
  const release = searchParams.get("release") || "";
  const q = searchParams.get("q") || "";
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const period = parseIssuePeriod(searchParams.get("period"));
  const { sort, order } = parseIssueSort(
    searchParams.get("sort") && searchParams.get("order")
      ? `${searchParams.get("sort")}:${searchParams.get("order")}`
      : null,
  );

  const [searchDraft, setSearchDraft] = useState(q);

  useEffect(() => {
    if (!ISSUE_TABS.some((t) => t.id === status)) {
      setSearchParams({ status: "open" }, { replace: true });
    }
  }, [status, setSearchParams]);

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  const filters = {
    status: ISSUE_TABS.some((t) => t.id === status) ? status : "open",
    environment: environment || undefined,
    release: release || undefined,
    q: q || undefined,
    period: period || undefined,
    sort,
    order,
    page,
    limit: PAGE_SIZE,
  };

  const query = useQuery({
    queryKey: queryKeys.issues(filters),
    queryFn: () => fetchIssues(filters),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const data = query.data;
  const total = data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  useEffect(() => {
    if (page > totalPages && total > 0) {
      patchParams({ page: String(totalPages) });
    }
  }, [page, totalPages, total]);

  function patchParams(next: Record<string, string | undefined>, resetPage = false) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(next)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    if (resetPage) params.delete("page");
    if (!params.get("status")) params.set("status", "open");
    setSearchParams(params);
  }

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    patchParams({ q: searchDraft.trim() || undefined }, true);
  }

  function resetFilters() {
    setSearchDraft("");
    patchParams(
      {
        period: undefined,
        environment: undefined,
        release: undefined,
        q: undefined,
        sort: undefined,
        order: undefined,
      },
      true,
    );
  }

  return {
    status,
    environment,
    release,
    period,
    sort,
    order,
    q,
    page,
    issues: data?.issues ?? [],
    stats: data?.stats ?? null,
    filters: data?.filters ?? { environments: [], releases: [] },
    total,
    totalPages,
    searchDraft,
    setSearchDraft,
    error: query.error ? (query.error instanceof Error ? query.error.message : "加载失败") : null,
    loading: query.isPending,
    patchParams,
    submitSearch,
    resetFilters,
  };
}
