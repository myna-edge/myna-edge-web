import type { IssuePeriod, IssueSortField, IssueSortOrder, TabStatus } from "../../api";

export const ISSUE_TABS: { id: TabStatus; label: string }[] = [
  { id: "open", label: "未处理" },
  { id: "resolved", label: "已解决" },
  { id: "ignored", label: "已忽略" },
];

export const ISSUE_PERIOD_OPTIONS: { value: IssuePeriod | ""; label: string }[] = [
  { value: "", label: "全部" },
  { value: "today", label: "今日" },
  { value: "yesterday", label: "昨日" },
  { value: "3d", label: "近 3 天" },
  { value: "7d", label: "近 7 天" },
  { value: "14d", label: "近 14 天" },
  { value: "30d", label: "近 30 天" },
];

export function parseIssuePeriod(value: string | null | undefined): IssuePeriod | "" {
  if (value && ISSUE_PERIOD_OPTIONS.some((opt) => opt.value === value)) {
    return value as IssuePeriod | "";
  }
  return "";
}

export const ISSUE_SORT_OPTIONS: {
  value: `${IssueSortField}:${IssueSortOrder}`;
  label: string;
}[] = [
  { value: "last_seen:desc", label: "最近出现" },
  { value: "last_seen:asc", label: "最早出现" },
  { value: "count:desc", label: "次数最多" },
  { value: "count:asc", label: "次数最少" },
  { value: "first_seen:desc", label: "最近首次出现" },
  { value: "first_seen:asc", label: "最早首次出现" },
  { value: "title:asc", label: "标题 A→Z" },
  { value: "title:desc", label: "标题 Z→A" },
];

export const DEFAULT_ISSUE_SORT: `${IssueSortField}:${IssueSortOrder}` = "last_seen:desc";

export function parseIssueSort(value: string | null | undefined): {
  sort: IssueSortField;
  order: IssueSortOrder;
} {
  const match = ISSUE_SORT_OPTIONS.find((opt) => opt.value === value);
  if (match) {
    const [sort, order] = match.value.split(":") as [IssueSortField, IssueSortOrder];
    return { sort, order };
  }
  const [sort, order] = DEFAULT_ISSUE_SORT.split(":") as [IssueSortField, IssueSortOrder];
  return { sort, order };
}

export function issueSortValue(sort: IssueSortField, order: IssueSortOrder): string {
  return `${sort}:${order}`;
}

export function hasActiveIssueFilters(params: {
  period: IssuePeriod | "";
  environment: string;
  release: string;
  q: string;
  sort: IssueSortField;
  order: IssueSortOrder;
}): boolean {
  return Boolean(params.q) || hasAdvancedIssueFilters(params);
}

export function hasAdvancedIssueFilters(params: {
  period: IssuePeriod | "";
  environment: string;
  release: string;
  sort: IssueSortField;
  order: IssueSortOrder;
}): boolean {
  const defaults = parseIssueSort(null);
  return Boolean(
    params.period ||
      params.environment ||
      params.release ||
      params.sort !== defaults.sort ||
      params.order !== defaults.order,
  );
}

export const PAGE_SIZE = 20;
