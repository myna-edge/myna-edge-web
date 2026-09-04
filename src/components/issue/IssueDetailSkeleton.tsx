import { Skeleton } from "../ui/Skeleton";

export function IssueDetailSkeleton() {
  return (
    <div className="issue-detail skeleton-busy" aria-busy="true">
      <span className="sr-only">加载问题详情</span>
      <Skeleton className="skeleton-line-sm" style={{ width: "8rem" }} />

      <div className="issue-sheet">
        <div className="skeleton-issue-lines issue-header">
          <Skeleton className="skeleton-issue-title" />
          <Skeleton className="skeleton-line-sm" style={{ width: "55%" }} />
          <Skeleton className="skeleton-line-sm" style={{ width: "40%" }} />
        </div>

        <div className="issue-strip">
          <Skeleton className="skeleton-line-sm" style={{ width: "100%" }} />
        </div>
        <div className="issue-sheet-body">
          <Skeleton className="skeleton-line-sm" style={{ width: "14rem", marginBottom: "0.75rem" }} />
          <Skeleton className="skeleton-control" style={{ height: "10rem" }} />
        </div>
      </div>
    </div>
  );
}
