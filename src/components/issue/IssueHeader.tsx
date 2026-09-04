import { formatRelativeTime, statusLabel, truncate } from "../../api";
import type { EventRow, Issue } from "../../api";
import { statusBadgeClass } from "./issueMeta";

type Props = {
  issue: Issue;
  selectedEvent: EventRow | null;
  userCount: number;
};

/** Identity block: what broke, where, and a single line of scope. */
export function IssueHeader({ issue, selectedEvent, userCount }: Props) {
  const showEventMessage =
    selectedEvent != null && selectedEvent.message.trim() !== issue.title.trim();

  const scope = [
    `${issue.count} 次`,
    userCount > 0 ? `${userCount} 用户` : null,
    `最近 ${formatRelativeTime(issue.last_seen)}`,
    issue.environment,
    issue.release,
  ].filter(Boolean) as string[];

  return (
    <header className="issue-header">
      <h1 className="issue-title">
        <span className="issue-title-type">{issue.type}: </span>
        {issue.title}
      </h1>

      {issue.url ? (
        <a className="issue-url mono" href={issue.url} target="_blank" rel="noreferrer">
          {truncate(issue.url, 120)}
        </a>
      ) : null}

      {showEventMessage ? <p className="issue-event-line">{selectedEvent.message}</p> : null}

      <p className="issue-scope">
        <span className={`badge badge-status ${statusBadgeClass(issue.status)}`}>
          {statusLabel(issue.status)}
        </span>
        <span className="issue-scope-bits">
          {scope.map((bit) => (
            <span key={bit}>{bit}</span>
          ))}
        </span>
      </p>

      {issue.status !== "open" ? (
        <p className="issue-scope-hint muted">
          {issue.status === "ignored" ? "再次上报不会回到未处理" : "再次上报将自动重新打开"}
        </p>
      ) : null}
    </header>
  );
}
