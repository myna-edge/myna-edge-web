import { Skeleton, SkeletonBlock, SkeletonCheck, SkeletonField } from "../ui/Skeleton";

export function WebhookFormSkeleton() {
  return (
    <SkeletonBlock className="card webhook-form" label="加载告警配置">
      <SkeletonCheck width="10rem" />
      <SkeletonField hint />
      <SkeletonField />
      <SkeletonField hint />
      <div className="form-fieldset">
        <Skeleton className="skeleton-label" />
        <SkeletonCheck width="16rem" />
        <SkeletonCheck width="18rem" />
      </div>
      <div className="form-actions">
        <Skeleton className="skeleton-btn" />
        <Skeleton className="skeleton-btn" />
      </div>
    </SkeletonBlock>
  );
}
