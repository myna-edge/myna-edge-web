import { Skeleton, SkeletonBlock } from "../ui/Skeleton";

function DashCardSkeleton() {
  return (
    <div className="dash-card dash-card-skeleton">
      <Skeleton className="skeleton-line-sm" style={{ width: "5rem" }} />
      <Skeleton className="skeleton-control" style={{ height: "1rem" }} />
      <Skeleton className="skeleton-control" style={{ height: "1rem" }} />
      <Skeleton className="skeleton-control" style={{ height: "1rem" }} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <SkeletonBlock label="加载概览">
      <div className="overview-stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overview-stat overview-stat-skeleton">
            <Skeleton className="skeleton-line-sm" style={{ width: "4rem" }} />
            <Skeleton style={{ width: "3rem", height: "1.5rem" }} />
          </div>
        ))}
      </div>
      <Skeleton className="skeleton-control" style={{ height: "7rem" }} />
      <Skeleton className="skeleton-control" style={{ height: "6.5rem" }} />
      <div className="dashboard-grid">
        <DashCardSkeleton />
        <DashCardSkeleton />
        <DashCardSkeleton />
        <DashCardSkeleton />
      </div>
    </SkeletonBlock>
  );
}
