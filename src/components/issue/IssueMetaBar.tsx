import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatRelativeTime } from "../../api";
import type { EventRow, Issue } from "../../api";
import { IssueActions } from "./IssueActions";

type Props = {
  issue: Issue;
  userCount: number;
  events: EventRow[];
  selectedIndex: number;
  selectedEvent: EventRow | null;
  selectedEventId: number | null;
  pending: boolean;
  error: string | null;
  copied: string | null;
  onCopy: (label: string, text: string) => void;
  onSelectEvent: (eventId: number) => void;
  onOlder: () => void;
  onNewer: () => void;
  onResolve: () => void;
  onIgnore: () => void;
  onReopen: () => void;
};

/** Compact full-width meta + event switcher + actions. */
export function IssueMetaBar({
  issue,
  userCount,
  events,
  selectedIndex,
  selectedEvent,
  selectedEventId,
  pending,
  error,
  copied,
  onCopy,
  onSelectEvent,
  onOlder,
  onNewer,
  onResolve,
  onIgnore,
  onReopen,
}: Props) {
  const meta = [issue.environment, issue.release].filter(Boolean).join(" · ");
  const multi = events.length > 1;

  return (
    <section className="issue-meta-bar" aria-label="问题概况">
      <dl className="issue-meta-stats">
        <div>
          <dt>次数</dt>
          <dd>{issue.count}</dd>
        </div>
        {userCount > 0 ? (
          <div>
            <dt>用户</dt>
            <dd>{userCount}</dd>
          </div>
        ) : null}
        <div>
          <dt>最近</dt>
          <dd>{formatRelativeTime(issue.last_seen)}</dd>
        </div>
        {meta ? (
          <div className="issue-meta-env">
            <dt className="sr-only">环境</dt>
            <dd className="muted">{meta}</dd>
          </div>
        ) : null}
      </dl>

      {selectedEvent ? (
        <div className="issue-meta-events">
          {multi ? (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                disabled={selectedIndex >= events.length - 1}
                onClick={onOlder}
                aria-label="更早的上报"
              >
                <ChevronLeft size={16} />
              </button>
              <label className="issue-event-select-wrap">
                <span className="sr-only">选择上报记录</span>
                <select
                  className="issue-event-select"
                  value={selectedEventId ?? undefined}
                  onChange={(e) => onSelectEvent(Number(e.target.value))}
                >
                  {events.map((event, index) => (
                    <option key={event.id} value={event.id}>
                      #{index + 1}/{events.length} · {formatRelativeTime(event.created_at)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                disabled={selectedIndex <= 0}
                onClick={onNewer}
                aria-label="更晚的上报"
              >
                <ChevronRight size={16} />
              </button>
            </>
          ) : (
            <span className="issue-meta-event-solo muted">
              {formatRelativeTime(selectedEvent.created_at)}
            </span>
          )}
        </div>
      ) : null}

      {issue.status !== "open" ? (
        <p className="issue-meta-hint muted">
          {issue.status === "ignored" ? "再次上报不会回到未处理" : "再次上报将自动重新打开"}
        </p>
      ) : null}

      <div className="issue-meta-actions">
        <IssueActions
          issue={issue}
          pending={pending}
          error={error}
          inline
          onResolve={onResolve}
          onIgnore={onIgnore}
          onReopen={onReopen}
        />
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => onCopy("fingerprint", issue.fingerprint)}
        >
          {copied === "fingerprint" ? "已复制" : "指纹"}
        </button>
      </div>
    </section>
  );
}
