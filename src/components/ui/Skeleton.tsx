import type { CSSProperties, ReactNode } from "react";

type SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <span
      className={["skeleton", className].filter(Boolean).join(" ")}
      style={style}
      aria-hidden
    />
  );
}

export function SkeletonField({ hint = false }: { hint?: boolean }) {
  return (
    <div className="skeleton-field">
      <Skeleton className="skeleton-label" />
      <Skeleton className="skeleton-control" />
      {hint ? <Skeleton className="skeleton-hint" /> : null}
    </div>
  );
}

export function SkeletonCheck({ width }: { width?: string }) {
  return (
    <div className="skeleton-check">
      <Skeleton className="skeleton-box" />
      <Skeleton className="skeleton-check-label" style={width ? { maxWidth: width } : undefined} />
    </div>
  );
}

export function SkeletonBlock({
  className,
  children,
  label = "加载中",
}: {
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className={["skeleton-busy", className].filter(Boolean).join(" ")} aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
