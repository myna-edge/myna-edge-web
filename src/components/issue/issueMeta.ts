import type { EventRow, Issue } from "../../api";
import { formatAbsolute, formatRelativeTime } from "../../api";

export type MetaRow = {
  label: string;
  value: string;
  mono?: boolean;
  href?: string;
  copy?: { key: string; text: string };
};

export function extraEntries(extra: Record<string, unknown> | null | undefined) {
  if (!extra) return [];
  return Object.entries(extra).filter(([, value]) => value !== undefined);
}

export function formatExtraValue(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function occurrenceRows(event: EventRow): MetaRow[] {
  const rows: MetaRow[] = [
    {
      label: "时间",
      value: `${formatAbsolute(event.created_at)}（${formatRelativeTime(event.created_at)}）`,
    },
  ];
  if (event.message.trim()) {
    rows.push({ label: "消息", value: event.message });
  }
  rows.push({
    label: "事件 ID",
    value: String(event.id),
    mono: true,
    copy: { key: "event-id", text: String(event.id) },
  });
  return rows;
}

export function issueRows(issue: Issue, userCount = 0): MetaRow[] {
  const rows: MetaRow[] = [
    { label: "编号", value: String(issue.id), mono: true },
    { label: "次数", value: String(issue.count) },
  ];
  if (userCount > 0) rows.push({ label: "用户", value: String(userCount) });
  rows.push(
    { label: "首次", value: formatAbsolute(issue.first_seen) },
    { label: "最近", value: formatAbsolute(issue.last_seen) },
  );
  if (issue.environment) rows.push({ label: "环境", value: issue.environment });
  if (issue.release) rows.push({ label: "版本", value: issue.release, mono: true });
  if (issue.url) rows.push({ label: "页面", value: issue.url, mono: true, href: issue.url });
  rows.push({
    label: "指纹",
    value: issue.fingerprint,
    mono: true,
    copy: { key: "fingerprint", text: issue.fingerprint },
  });
  return rows;
}

export function statusBadgeClass(status: string): string {
  if (status === "open") return "badge-warn";
  if (status === "resolved") return "badge-ok";
  return "badge-muted";
}
