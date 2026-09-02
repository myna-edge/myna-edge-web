import type { IssuePeriod } from "../../api";

export const DASHBOARD_DAYS_OPTIONS = [
  { value: 7, label: "近 7 天" },
  { value: 14, label: "近 14 天" },
  { value: 30, label: "近 30 天" },
] as const;

export type DashboardDays = (typeof DASHBOARD_DAYS_OPTIONS)[number]["value"];

export function daysToPeriod(days: number): IssuePeriod | undefined {
  if (days === 7) return "7d";
  if (days === 14) return "14d";
  if (days === 30) return "30d";
  return undefined;
}

function issuesHref(params: Record<string, string | undefined>): string {
  const q = new URLSearchParams();
  q.set("status", "open");
  for (const [key, value] of Object.entries(params)) {
    if (value) q.set(key, value);
  }
  return `/issues?${q.toString()}`;
}

export function breakdownLink(
  kind: "environment" | "release" | "type" | "page",
  label: string,
  days: number,
): string | undefined {
  if (!label || label === "未知") return undefined;
  const period = daysToPeriod(days);
  const base = { period };

  switch (kind) {
    case "environment":
      return issuesHref({ ...base, environment: label });
    case "release":
      return issuesHref({ ...base, release: label });
    case "type":
      return issuesHref({ ...base, q: label });
    case "page":
      return issuesHref({ ...base, q: label });
    default:
      return undefined;
  }
}
