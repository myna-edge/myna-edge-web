import { Link } from "react-router-dom";
import type { IssueStats } from "../../api";

type Props = {
  stats: IssueStats;
};

const ITEMS = [
  { key: "open", label: "未处理", countKey: "openCount" as const, to: "/issues?status=open" },
  {
    key: "events",
    label: "未处理事件",
    countKey: "openEvents" as const,
    to: "/issues?status=open",
  },
  {
    key: "resolved",
    label: "已解决",
    countKey: "resolvedCount" as const,
    to: "/issues?status=resolved",
  },
  {
    key: "ignored",
    label: "已忽略",
    countKey: "ignoredCount" as const,
    to: "/issues?status=ignored",
  },
] as const;

export function OverviewStats({ stats }: Props) {
  return (
    <div className="overview-stats">
      {ITEMS.map((item) => (
        <Link key={item.key} to={item.to} className="overview-stat">
          <span className="overview-stat-label">{item.label}</span>
          <span className="overview-stat-value">{stats[item.countKey]}</span>
          <span className="overview-stat-hint">累计</span>
        </Link>
      ))}
    </div>
  );
}
