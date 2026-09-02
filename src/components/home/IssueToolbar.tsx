import { ChevronDown } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type {
  IssueFilters,
  IssuePeriod,
  IssueSortField,
  IssueSortOrder,
  IssueStats,
  TabStatus,
} from "../../api";
import { Select } from "../ui/Select";
import {
  hasActiveIssueFilters,
  hasAdvancedIssueFilters,
  ISSUE_PERIOD_OPTIONS,
  ISSUE_SORT_OPTIONS,
  ISSUE_TABS,
  issueSortValue,
} from "./constants";

type Props = {
  status: TabStatus;
  period: IssuePeriod | "";
  stats: IssueStats | null;
  filters: IssueFilters;
  environment: string;
  release: string;
  sort: IssueSortField;
  order: IssueSortOrder;
  q: string;
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onSubmitSearch: (e: FormEvent) => void;
  onPatchParams: (next: Record<string, string | undefined>, resetPage?: boolean) => void;
  onResetFilters: () => void;
};

export function IssueToolbar({
  status,
  period,
  stats,
  filters,
  environment,
  release,
  sort,
  order,
  q,
  searchDraft,
  onSearchDraftChange,
  onSubmitSearch,
  onPatchParams,
  onResetFilters,
}: Props) {
  const sortValue = issueSortValue(sort, order);
  const advancedActive = hasAdvancedIssueFilters({ period, environment, release, sort, order });
  const showReset = hasActiveIssueFilters({ period, environment, release, q, sort, order });
  const [expanded, setExpanded] = useState(advancedActive);

  useEffect(() => {
    if (advancedActive) setExpanded(true);
  }, [advancedActive]);

  return (
    <section className="issue-filters" aria-label="问题筛选">
      <div className="issue-filters-head">
        <h3 className="issue-filters-title">筛选</h3>
        <div className="issue-filters-actions">
          {showReset ? (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onResetFilters}>
              重置
            </button>
          ) : null}
          <button
            type="button"
            className={`btn btn-ghost btn-sm issue-filters-toggle${expanded ? " is-expanded" : ""}`}
            aria-expanded={expanded}
            aria-controls="issue-filters-advanced"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "收起" : "高级筛选"}
            {!expanded && advancedActive ? (
              <span className="issue-filters-badge" aria-label="已启用高级筛选">
                已启用
              </span>
            ) : null}
            <ChevronDown size={14} strokeWidth={2.25} className="issue-filters-chevron" aria-hidden />
          </button>
        </div>
      </div>

      <div className="issue-filters-basic">
        <div className="issue-filter-group issue-filter-group-status">
          <span className="issue-filter-label" id="issue-filter-status-label">
            状态
          </span>
          <div className="tabs" role="tablist" aria-labelledby="issue-filter-status-label">
            {ISSUE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={status === tab.id}
                className={`tab ${status === tab.id ? "is-active" : ""}`}
                onClick={() => onPatchParams({ status: tab.id }, true)}
              >
                {tab.label}
                {stats ? (
                  <span className="count">
                    {tab.id === "open"
                      ? stats.openCount
                      : tab.id === "resolved"
                        ? stats.resolvedCount
                        : stats.ignoredCount}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className="issue-filter-group issue-filter-group-search">
          <label className="issue-filter-label" htmlFor="issue-filter-search">
            搜索
          </label>
          <form className="issue-filter-search" onSubmit={onSubmitSearch}>
            <input
              id="issue-filter-search"
              type="search"
              className="input input-block"
              placeholder="搜索标题、类型、URL 或指纹…"
              value={searchDraft}
              onChange={(e) => onSearchDraftChange(e.target.value)}
            />
            {q ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  onSearchDraftChange("");
                  onPatchParams({ q: undefined }, true);
                }}
              >
                清除
              </button>
            ) : null}
          </form>
        </div>
      </div>

      {expanded ? (
        <div id="issue-filters-advanced" className="issue-filters-advanced">
          <div className="issue-filter-group">
            <label className="issue-filter-label" htmlFor="issue-filter-period">
              时间
            </label>
            <Select
              id="issue-filter-period"
              block
              value={period}
              aria-label="时间范围"
              options={ISSUE_PERIOD_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              onChange={(next) => onPatchParams({ period: next || undefined }, true)}
            />
          </div>

          <div className="issue-filter-group">
            <label className="issue-filter-label" htmlFor="issue-filter-environment">
              环境
            </label>
            <Select
              id="issue-filter-environment"
              block
              value={environment}
              aria-label="环境"
              options={[
                { value: "", label: "全部环境" },
                ...filters.environments.map((env) => ({ value: env, label: env })),
              ]}
              onChange={(next) => onPatchParams({ environment: next || undefined }, true)}
            />
          </div>

          <div className="issue-filter-group">
            <label className="issue-filter-label" htmlFor="issue-filter-release">
              版本
            </label>
            <Select
              id="issue-filter-release"
              block
              value={release}
              aria-label="版本"
              options={[
                { value: "", label: "全部版本" },
                ...filters.releases.map((rel) => ({ value: rel, label: rel })),
              ]}
              onChange={(next) => onPatchParams({ release: next || undefined }, true)}
            />
          </div>

          <div className="issue-filter-group">
            <label className="issue-filter-label" htmlFor="issue-filter-sort">
              排序
            </label>
            <Select
              id="issue-filter-sort"
              block
              value={sortValue}
              aria-label="排序"
              options={ISSUE_SORT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
              onChange={(next) => {
                const [nextSort, nextOrder] = next.split(":") as [IssueSortField, IssueSortOrder];
                onPatchParams({ sort: nextSort, order: nextOrder }, true);
              }}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
