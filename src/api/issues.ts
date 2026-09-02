import { apiBase } from "./client";
import type { EventRow, Issue, IssueListParams, IssueListResponse } from "./types";

export async function fetchIssues(params: IssueListParams = {}): Promise<IssueListResponse> {
  const q = new URLSearchParams();
  q.set("status", params.status || "open");
  if (params.environment) q.set("environment", params.environment);
  if (params.release) q.set("release", params.release);
  if (params.q) q.set("q", params.q);
  if (params.period) q.set("period", params.period);
  if (params.sort) q.set("sort", params.sort);
  if (params.order) q.set("order", params.order);
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  const res = await fetch(`${apiBase()}/api/issues?${q}`);
  if (!res.ok) throw new Error(`GET /api/issues → ${res.status}`);
  return res.json();
}

export async function fetchIssue(id: number): Promise<{ issue: Issue; events: EventRow[] }> {
  const res = await fetch(`${apiBase()}/api/issues/${id}`);
  if (!res.ok) throw new Error(`GET /api/issues/${id} → ${res.status}`);
  return res.json();
}

export async function updateIssueStatus(
  id: number,
  status: "resolved" | "ignored" | "open",
): Promise<void> {
  const res = await fetch(`${apiBase()}/api/issues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `PATCH → ${res.status}`);
  }
}

export async function resolveIssue(id: number): Promise<void> {
  return updateIssueStatus(id, "resolved");
}

export async function ignoreIssue(id: number): Promise<void> {
  return updateIssueStatus(id, "ignored");
}

export async function reopenIssue(id: number): Promise<void> {
  return updateIssueStatus(id, "open");
}
