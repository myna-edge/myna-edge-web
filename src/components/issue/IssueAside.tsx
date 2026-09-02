import { formatRelativeTime } from "../../api";
import type { Issue } from "../../api";
import { IssueActions } from "./IssueActions";

type Props = {
  issue: Issue;
  userCount: number;
  pending: boolean;
  error: string | null;
  copied: string | null;
  onCopy: (label: string, text: string) => void;
  onResolve: () => void;
  onIgnore: () => void;
  onReopen: () => void;
};

export function IssueAside({
  issue,
  userCount,
  pending,
  error,
  copied,
  onCopy,
  onResolve,
  onIgnore,
  onReopen,
}: Props) {
  const meta = [issue.environment, issue.release].filter(Boolean).join(" · ");

  return (
    <aside className="issue-aside">
      <section className="issue-aside-panel">
        <div className="issue-aside-block">
          <h2 className="issue-aside-heading">概况</h2>
          <dl className="issue-aside-stats">
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
          </dl>

          {meta ? <p className="issue-aside-meta muted">{meta}</p> : null}
          {issue.status !== "open" ? (
            <p className="issue-aside-hint muted">
              {issue.status === "ignored" ? "再次上报不会回到未处理" : "再次上报将自动重新打开"}
            </p>
          ) : null}
        </div>

        <div className="issue-aside-block issue-aside-block--actions">
          <div className="issue-aside-actions">
            <IssueActions
              issue={issue}
              pending={pending}
              error={error}
              aside
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
        </div>
      </section>
    </aside>
  );
}
