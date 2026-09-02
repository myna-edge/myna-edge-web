import { Link, useParams } from "react-router-dom";
import { DetailTabPanel } from "../components/issue/DetailTabs";
import { IssueHeader } from "../components/issue/IssueHeader";
import { IssueMetaBar } from "../components/issue/IssueMetaBar";
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
    selectedEventId,
    selectedIndex,
    selectedEvent,
    displayStack,
    hasPage,
    hasEnvironment,
    hasContext,
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

  const actionProps = {
    issue,
    pending,
    error,
    onResolve,
    onIgnore,
    onReopen,
  };

  return (
    <div className="issue-detail">
      <IssueBreadcrumb id={issue.id} />

      <div className="detail-workspace">
        <div className="issue-hero">
          <IssueHeader issue={issue} selectedEvent={selectedEvent} />
          <IssueMetaBar
            userCount={userCount}
            events={events}
            selectedIndex={selectedIndex}
            selectedEvent={selectedEvent}
            selectedEventId={selectedEventId}
            copied={copied}
            onCopy={onCopy}
            onSelectEvent={selectEvent}
            onOlder={selectOlder}
            onNewer={selectNewer}
            {...actionProps}
          />
        </div>

        <IssueToolbar
          tab={tab}
          displayStack={displayStack}
          hasPage={hasPage}
          hasEnvironment={hasEnvironment}
          hasContext={hasContext}
          onTabChange={setTab}
        />

        <DetailTabPanel
          tab={tab}
          displayStack={displayStack}
          hasPage={hasPage}
          hasEnvironment={hasEnvironment}
          hasContext={hasContext}
          selectedEvent={selectedEvent}
          copied={copied}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
}
