import { Skeleton, SkeletonBlock } from "../ui/Skeleton";

function IssueRowSkeleton() {
  return (
    <div className="skeleton-row">
      <div className="skeleton-row-main">
        <Skeleton style={{ width: "72%" }} />
        <Skeleton className="skeleton-line-sm" style={{ width: "40%" }} />
      </div>
      <div style={{ display: "grid", gap: "0.375rem", justifyItems: "end" }}>
        <Skeleton className="skeleton-line-sm" style={{ width: "2.5rem" }} />
        <Skeleton className="skeleton-line-sm" style={{ width: "3.5rem" }} />
      </div>
    </div>
  );
}

export function IssueListSkeleton() {
  return (
    <SkeletonBlock className="panel issue-results" label="加载问题列表">
      <IssueRowSkeleton />
      <IssueRowSkeleton />
      <IssueRowSkeleton />
      <IssueRowSkeleton />
      <IssueRowSkeleton />
    </SkeletonBlock>
  );
}
