import { Skeleton } from "../ui/Skeleton";

export function IssueDetailSkeleton() {
  return (
    <div className="issue-detail skeleton-busy" aria-busy="true">
      <span className="sr-only">加载问题详情</span>
      <Skeleton className="skeleton-line-sm" style={{ width: "8rem" }} />

      <div className="skeleton-workspace">
        <div className="skeleton-issue-header">
          <Skeleton className="skeleton-issue-title" />
          <Skeleton className="skeleton-line-sm" style={{ width: "55%" }} />
          <Skeleton className="skeleton-line-sm" style={{ width: "40%" }} />
        </div>
        <div className="skeleton-toolbar">
          <Skeleton className="skeleton-line-sm" style={{ width: "10rem" }} />
          <Skeleton className="skeleton-line-sm" style={{ width: "14rem" }} />
        </div>
        <div className="skeleton-workspace-body">
          <Skeleton className="skeleton-control" style={{ height: "8rem" }} />
        </div>
      </div>
    </div>
  );
}
