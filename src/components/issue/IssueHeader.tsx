import { statusLabel } from "../../api";
import type { EventRow, Issue } from "../../api";
import { eventTags, statusBadgeClass } from "./issueMeta";
import { TagList } from "./TagList";

type Props = {
  issue: Issue;
  selectedEvent: EventRow | null;
};

export function IssueHeader({ issue, selectedEvent }: Props) {
  const showEventMessage =
    selectedEvent != null && selectedEvent.message.trim() !== issue.title.trim();

  return (
    <header className="issue-header">
      <div className="issue-header-main">
        <div className="issue-header-title-row">
          <h1 className="issue-title">
            <span className="issue-title-type">{issue.type}: </span>
            {issue.title}
          </h1>
          <span className={`badge badge-status ${statusBadgeClass(issue.status)}`}>
            {statusLabel(issue.status)}
          </span>
        </div>
        {showEventMessage ? (
          <p className="issue-event-line">{selectedEvent.message}</p>
        ) : null}
        {selectedEvent ? <TagList tags={eventTags(selectedEvent)} /> : null}
      </div>
    </header>
  );
}
