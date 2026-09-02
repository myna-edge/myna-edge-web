export type HealthResponse = {
  ok: boolean;
  storage: string;
  ingestAuth: boolean;
  adminAuth: boolean;
  webhook: boolean;
};

export type WebhookFormat = "auto" | "feishu" | "wecom" | "slack" | "generic";

export type WebhookConfig = {
  enabled: boolean;
  url: string;
  format: WebhookFormat;
  consoleUrl: string;
  notifyNew: boolean;
  notifyReopened: boolean;
};

export type Issue = {
  id: number;
  fingerprint: string;
  title: string;
  type: string;
  count: number;
  status: string;
  first_seen: string;
  last_seen: string;
  release: string | null;
  environment: string | null;
  url: string | null;
};

export type { ClientContext, ClientStorageSnapshot } from "./client-context.js";

export type EventRow = {
  id: number;
  issue_id: number;
  message: string;
  type: string;
  stack: string | null;
  url: string | null;
  user_agent: string | null;
  release: string | null;
  environment: string | null;
  user_id: string | null;
  extra: Record<string, unknown> | null;
  client: import("./client-context.js").ClientContext | null;
  client_ip: string | null;
  created_at: string;
};

export type IssueStats = {
  openCount: number;
  resolvedCount: number;
  ignoredCount: number;
  openEvents: number;
};

export type IssueFilters = {
  environments: string[];
  releases: string[];
};

export type EventTrendPoint = {
  day: string;
  count: number;
};

export type IssueSortField = "last_seen" | "first_seen" | "count" | "title";
export type IssueSortOrder = "asc" | "desc";
export type IssuePeriod = "today" | "yesterday" | "3d" | "7d" | "14d" | "30d";

export type IssueListParams = {
  status?: "open" | "resolved" | "ignored";
  environment?: string;
  release?: string;
  q?: string;
  period?: IssuePeriod;
  sort?: IssueSortField;
  order?: IssueSortOrder;
  page?: number;
  limit?: number;
};

export type IssueListResponse = {
  issues: Issue[];
  stats: IssueStats;
  filters: IssueFilters;
  total: number;
  page: number;
  limit: number;
};

export type OverviewBreakdownItem = {
  label: string;
  count: number;
};

export type OverviewTopIssue = {
  id: number;
  title: string;
  type: string;
  count: number;
};

export type OverviewResponse = {
  stats: IssueStats;
  trend: EventTrendPoint[];
  days: number;
  byEnvironment: OverviewBreakdownItem[];
  byRelease: OverviewBreakdownItem[];
  byType: OverviewBreakdownItem[];
  byPage: OverviewBreakdownItem[];
  topIssues: OverviewTopIssue[];
  newIssueTrend: EventTrendPoint[];
  newIssueCount: number;
};

export type TabStatus = "open" | "resolved" | "ignored";
