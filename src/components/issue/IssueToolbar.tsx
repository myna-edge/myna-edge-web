import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatRelativeTime } from "../../api";
import type { EventRow } from "../../api";
import type { DetailTab } from "./DetailTabs";
import { visibleDetailTabs } from "./DetailTabs";

type Props = {
  events: EventRow[];
  selectedIndex: number;
  selectedEvent: EventRow;
  selectedEventId: number;
  tab: DetailTab;
  displayStack: string | null;
  hasClient: boolean;
  hasContext: boolean;
  onSelectEvent: (eventId: number) => void;
  onOlder: () => void;
  onNewer: () => void;
  onTabChange: (tab: DetailTab) => void;
};

export function IssueToolbar({
  events,
  selectedIndex,
  selectedEvent,
  selectedEventId,
  tab,
  displayStack,
  hasClient,
  hasContext,
  onSelectEvent,
  onOlder,
  onNewer,
  onTabChange,
}: Props) {
  const tabs = visibleDetailTabs(displayStack, hasClient, hasContext);
  const multi = events.length > 1;
  const compact = !multi && tabs.length > 0;

  return (
    <div className={`issue-toolbar${compact ? " issue-toolbar--compact" : ""}`}>
      <div className="issue-toolbar-events">
        {multi ? (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              disabled={selectedIndex >= events.length - 1}
              onClick={onOlder}
              aria-label="更早的上报"
            >
              <ChevronLeft size={16} />
            </button>
            <label className="issue-event-select-wrap">
              <span className="sr-only">选择上报记录</span>
              <select
                className="issue-event-select"
                value={selectedEventId}
                onChange={(e) => onSelectEvent(Number(e.target.value))}
              >
                {events.map((event, index) => (
                  <option key={event.id} value={event.id}>
                    #{index + 1} · {formatRelativeTime(event.created_at)}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-icon"
              disabled={selectedIndex <= 0}
              onClick={onNewer}
              aria-label="更晚的上报"
            >
              <ChevronRight size={16} />
            </button>
          </>
        ) : (
          <span className="issue-toolbar-event-solo muted">
            {formatRelativeTime(selectedEvent.created_at)}
          </span>
        )}
      </div>

      {tabs.length > 0 ? (
        <div className="issue-toolbar-tabs" role="tablist" aria-label="详情分区">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`issue-toolbar-tab${tab === item.id ? " is-active" : ""}`}
              onClick={() => onTabChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
