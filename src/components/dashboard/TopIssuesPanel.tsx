import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { truncate, type OverviewTopIssue } from "../../api";

type Props = {
  issues: OverviewTopIssue[];
};

export function TopIssuesPanel({ issues }: Props) {
  const max = Math.max(...issues.map((issue) => issue.count), 1);

  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <div className="dash-card-head-main">
          <h3 className="dash-card-title">高频未处理问题</h3>
          <span className="dash-card-subtitle">按出现次数 · Top 5</span>
        </div>
        <Link to="/issues" className="dash-card-link">
          查看全部
          <ChevronRight size={14} strokeWidth={2.25} aria-hidden />
        </Link>
      </div>
      {issues.length === 0 ? (
        <p className="dash-card-empty muted">暂无未处理问题</p>
      ) : (
        <ul className="top-issue-list">
          {issues.map((issue) => (
            <li key={issue.id}>
              <Link to={`/issues/${issue.id}`} className="top-issue-row">
                <span className="top-issue-main">
                  <span className="top-issue-title">{truncate(issue.title, 80)}</span>
                  <span className="badge badge-type">{issue.type}</span>
                </span>
                <span className="top-issue-track" aria-hidden>
                  <span
                    className="top-issue-bar"
                    style={{
                      width: `${Math.max((issue.count / max) * 100, issue.count > 0 ? 6 : 0)}%`,
                    }}
                  />
                </span>
                <span className="top-issue-count">×{issue.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
