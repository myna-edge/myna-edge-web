import { IssueList, IssueListEmpty } from "../components/home/IssueList";
import { IssueListSkeleton } from "../components/home/IssueListSkeleton";
import { IssuePagination } from "../components/home/IssuePagination";
import { IssueToolbar } from "../components/home/IssueToolbar";
import { PageIntro } from "../components/layout/PageIntro";
import { useIssueList } from "../hooks/useIssueList";

export function IssuesPage() {
  const {
    status,
    period,
    environment,
    release,
    sort,
    order,
    q,
    page,
    issues,
    stats,
    filters,
    total,
    totalPages,
    searchDraft,
    setSearchDraft,
    error,
    loading,
    patchParams,
    submitSearch,
    resetFilters,
  } = useIssueList();

  return (
    <div className="page issues-page">
      <PageIntro title="问题" desc="浏览、筛选并处理问题。" />

      <div className="issue-workspace">
        <IssueToolbar
          status={status}
          period={period}
          stats={stats}
          filters={filters}
          environment={environment}
          release={release}
          sort={sort}
          order={order}
          q={q}
          searchDraft={searchDraft}
          onSearchDraftChange={setSearchDraft}
          onSubmitSearch={submitSearch}
          onPatchParams={patchParams}
          onResetFilters={resetFilters}
        />

        {loading ? (
          <IssueListSkeleton />
        ) : (
          <div className="panel issue-results">
            {error ? (
              <p className="empty flash-error">
                {error}
                {import.meta.env.DEV ? (
                  <>
                    <br />
                    <span className="muted">请确认 API 已启动（npm run dev:api）</span>
                  </>
                ) : null}
              </p>
            ) : null}

            {!error && issues.length === 0 ? <IssueListEmpty status={status} q={q} /> : null}

            {!error ? <IssueList issues={issues} /> : null}

            {!error ? (
              <IssuePagination
                total={total}
                page={page}
                totalPages={totalPages}
                onPageChange={(next) => patchParams({ page: String(next) })}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
