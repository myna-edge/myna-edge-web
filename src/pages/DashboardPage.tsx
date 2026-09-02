import { useState } from "react";
import { BreakdownChart } from "../components/dashboard/BreakdownChart";
import { breakdownLink } from "../components/dashboard/constants";
import { DashboardRangePicker } from "../components/dashboard/DashboardRangePicker";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { EventTrendChart } from "../components/dashboard/EventTrendChart";
import { OverviewStats } from "../components/dashboard/OverviewStats";
import { TopIssuesPanel } from "../components/dashboard/TopIssuesPanel";
import type { DashboardDays } from "../components/dashboard/constants";
import { PageIntro } from "../components/layout/PageIntro";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardPage() {
  const [days, setDays] = useState<DashboardDays>(7);
  const {
    stats,
    trend,
    byEnvironment,
    byRelease,
    byType,
    byPage,
    topIssues,
    newIssueTrend,
    newIssueCount,
    error,
    loading,
  } = useDashboard(days);

  const rangeHint = `近 ${days} 天`;
  const link = (kind: "environment" | "release" | "type" | "page") => (item: { label: string }) =>
    breakdownLink(kind, item.label, days);

  return (
    <div className="page dashboard-page">
      <PageIntro title="概览" desc="查看错误趋势、分布与高频问题。" />

      <DashboardRangePicker value={days} onChange={setDays} />

      {loading ? <DashboardSkeleton /> : null}

      {error ? (
        <p className="flash-error">
          {error}
          {import.meta.env.DEV ? (
            <>
              <br />
              <span className="muted">请确认 API 已启动（npm run dev:api）</span>
            </>
          ) : null}
        </p>
      ) : null}

      {!loading && !error && stats ? (
        <>
          <OverviewStats stats={stats} />

          <section className="dashboard-section" aria-labelledby="dashboard-trend">
            <h2 id="dashboard-trend" className="home-section-title">
              趋势
            </h2>
            <div className="dashboard-trends">
              <EventTrendChart points={trend} days={days} title="事件数" />
              <EventTrendChart
                points={newIssueTrend}
                days={days}
                title="新增问题"
                unit="个"
              />
            </div>
            {newIssueCount > 0 ? (
              <p className="dashboard-note muted">
                近 {days} 天共新增 <strong>{newIssueCount}</strong> 个问题
              </p>
            ) : null}
          </section>

          <section className="dashboard-section" aria-labelledby="dashboard-breakdown">
            <h2 id="dashboard-breakdown" className="home-section-title">
              分布
            </h2>
            <div className="dashboard-grid">
              <BreakdownChart
                title="环境"
                subtitle={rangeHint}
                items={byEnvironment}
                itemLink={link("environment")}
              />
              <BreakdownChart
                title="版本"
                subtitle={rangeHint}
                items={byRelease}
                itemLink={link("release")}
              />
              <BreakdownChart
                title="错误类型"
                subtitle={rangeHint}
                items={byType}
                itemLink={link("type")}
              />
              <BreakdownChart
                title="页面"
                subtitle={rangeHint}
                items={byPage}
                itemLink={link("page")}
              />
            </div>
            <TopIssuesPanel issues={topIssues} />
          </section>
        </>
      ) : null}
    </div>
  );
}
