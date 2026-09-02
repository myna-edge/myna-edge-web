import { Link, useParams } from "react-router-dom";
import { DetailTabPanel } from "../components/issue/DetailTabs";
import { IssueAside } from "../components/issue/IssueAside";
import { IssueHeader } from "../components/issue/IssueHeader";
import { IssueDetailSkeleton } from "../components/issue/IssueDetailSkeleton";
import { IssueToolbar } from "../components/issue/IssueToolbar";
import { IssueActions } from "../components/issue/IssueActions";
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
    hasContext,
    hasClient,
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

      <div className="issue-actions-mobile">
        <IssueActions {...actionProps} inline />
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-workspace">
            <IssueHeader issue={issue} selectedEvent={selectedEvent} />

            {selectedEvent ? (
              <IssueToolbar
                events={events}
                selectedIndex={selectedIndex}
                selectedEvent={selectedEvent}
                selectedEventId={selectedEventId!}
                tab={tab}
                displayStack={displayStack}
                hasClient={hasClient}
                hasContext={hasContext}
                onSelectEvent={selectEvent}
                onOlder={selectOlder}
                onNewer={selectNewer}
                onTabChange={setTab}
              />
            ) : null}

            <DetailTabPanel
              tab={tab}
              displayStack={displayStack}
              hasClient={hasClient}
              hasContext={hasContext}
              selectedEvent={selectedEvent}
              copied={copied}
              onCopy={onCopy}
            />
          </div>
        </div>

        <IssueAside
          issue={issue}
          userCount={userCount}
          pending={pending}
          error={error}
          copied={copied}
          onCopy={onCopy}
          {...actionProps}
        />
      </div>
    </div>
  );
}
