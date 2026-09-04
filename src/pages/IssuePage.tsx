import { Link, useParams } from "react-router-dom";
import { DetailTabPanel } from "../components/issue/DetailTabs";
import { IssueActions } from "../components/issue/IssueActions";
import { IssueEventStrip } from "../components/issue/IssueEventStrip";
import { IssueHeader } from "../components/issue/IssueHeader";
import { IssueDetailSkeleton } from "../components/issue/IssueDetailSkeleton";
import { IssueToolbar } from "../components/issue/IssueToolbar";
import { IssueBreadcrumb } from "../components/layout/PageIntro";
import { useIssueDetail } from "../hooks/useIssueDetail";

export function IssuePage() {
  const { id: raw } = useParams();
  const id = Number(raw);
  const {
    issue,
    events,
    error,
    pending,
    loading,
    selectedIndex,
    selectedEvent,
    displayStack,
    hasClient,
    hasExtra,
    userCount,
    tab,
    setTab,
    copied,
    onCopy,
    selectEvent,
    selectOlder,
    selectNewer,
    onResolve,
    onIgnore,
    onReopen,
  } = useIssueDetail(id);

  if (loading) {
    return <IssueDetailSkeleton />;
  }

  if (error && !issue) {
    return (
      <div className="page">
        <Link to="/issues" className="back-link">
          ← 问题列表
        </Link>
        <p className="flash-error">{error}</p>
      </div>
    );
  }

  if (!issue) return null;

  return (
    <div className="issue-detail">
      <div className="issue-topbar">
        <IssueBreadcrumb id={issue.id} />
        <div className="issue-topbar-actions">
          <IssueActions
            issue={issue}
            pending={pending}
            error={error}
            inline
            onResolve={onResolve}
            onIgnore={onIgnore}
            onReopen={onReopen}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onCopy("fingerprint", issue.fingerprint)}
          >
            {copied === "fingerprint" ? "已复制" : "指纹"}
          </button>
        </div>
      </div>

      <div className="issue-sheet">
        <IssueHeader issue={issue} selectedEvent={selectedEvent} userCount={userCount} />

        <IssueEventStrip
          events={events}
          selectedIndex={selectedIndex}
          onSelectEvent={selectEvent}
          onOlder={selectOlder}
          onNewer={selectNewer}
        />

        <IssueToolbar
          tab={tab}
          displayStack={displayStack}
          hasClient={hasClient}
          hasExtra={hasExtra}
          onTabChange={setTab}
        />

        <DetailTabPanel
          tab={tab}
          displayStack={displayStack}
          hasClient={hasClient}
          hasExtra={hasExtra}
          selectedEvent={selectedEvent}
          copied={copied}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
}
