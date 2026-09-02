import type { Issue } from "../../api";

type Props = {
  issue: Issue;
  pending: boolean;
  error: string | null;
  inline?: boolean;
  aside?: boolean;
  onResolve: () => void;
  onIgnore: () => void;
  onReopen: () => void;
};

export function IssueActions({
  issue,
  pending,
  error,
  inline = false,
  aside = false,
  onResolve,
  onIgnore,
  onReopen,
}: Props) {
  const isOpen = issue.status === "open";
  const className = [
    "issue-actions",
    inline ? "issue-actions--inline" : "",
    aside ? "issue-actions--aside" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (aside) {
    return (
      <div className={className}>
        {isOpen ? (
          <>
            <button type="button" className="btn btn-accent btn-sm" disabled={pending} onClick={onResolve}>
              {pending ? "处理中…" : "标为已解决"}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={onIgnore}>
              忽略
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={onReopen}>
            {pending ? "处理中…" : "重新打开"}
          </button>
        )}
        {error ? <p className="issue-action-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className={className}>
      {isOpen ? (
        <>
          <button type="button" className="btn btn-accent btn-sm" disabled={pending} onClick={onResolve}>
            {pending ? "处理中…" : "标为已解决"}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={onIgnore}>
            忽略
          </button>
        </>
      ) : (
        <button type="button" className="btn btn-ghost btn-sm" disabled={pending} onClick={onReopen}>
          {pending ? "处理中…" : "重新打开"}
        </button>
      )}
      {error ? <p className="issue-action-error">{error}</p> : null}
    </div>
  );
}
