import { Link } from "react-router-dom";
import { formatRelativeTime, statusLabel, truncate, type Issue, type TabStatus } from "../../api";

type Props = {
  issues: Issue[];
};

export function IssueList({ issues }: Props) {
  if (issues.length === 0) return null;

  return (
    <ul className="issue-list">
      {issues.map((issue) => (
        <li key={issue.id}>
          <Link to={`/issues/${issue.id}`} className="issue-row">
            <div className="issue-row-main">
              <div className="issue-row-title">{truncate(issue.title, 120)}</div>
              <div className="issue-row-meta">
                <span className="badge badge-type">{issue.type}</span>
                {issue.environment ? <span>{issue.environment}</span> : null}
                {issue.release ? <span>{issue.release}</span> : null}
              </div>
            </div>
            <div className="issue-row-side">
              <div className="issue-row-count">×{issue.count}</div>
              <div className="issue-row-time">{formatRelativeTime(issue.last_seen)}</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function IssueListEmpty({ status, q }: { status: TabStatus; q: string }) {
  return (
    <div className="empty">
      {q ? (
        <>没有匹配「{q}」的问题</>
      ) : status === "open" ? (
        <>
          暂无未处理问题 · <Link to="/guide">查看接入指南</Link>
        </>
      ) : (
        <>没有「{statusLabel(status)}」的问题</>
      )}
    </div>
  );
}
