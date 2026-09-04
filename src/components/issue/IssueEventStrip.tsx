import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatAbsolute, formatRelativeTime } from "../../api";
import type { EventRow } from "../../api";

type Props = {
  events: EventRow[];
  selectedIndex: number;
  onSelectEvent: (eventId: number) => void;
  onOlder: () => void;
  onNewer: () => void;
};

/**
 * Occurrences as a time strip: every report is a visible tick (oldest left),
 * so the collection is never hidden behind a control. Chevrons step by one.
 */
export function IssueEventStrip({
  events,
  selectedIndex,
  onSelectEvent,
  onOlder,
  onNewer,
}: Props) {
  const total = events.length;
  if (!total) return null;

  const selected = events[selectedIndex] ?? events[0];

  if (total === 1) {
    return (
      <section className="issue-strip is-solo" aria-label="上报记录">
        <span className="issue-strip-label">上报</span>
        <span className="issue-strip-when">{formatRelativeTime(selected.created_at)}</span>
        <span className="issue-strip-abs muted">{formatAbsolute(selected.created_at)}</span>
      </section>
    );
  }

  // Oldest first so the strip reads left-to-right as time moving forward.
  const ordered = [...events].reverse();

  return (
    <section className="issue-strip" aria-label="上报记录">
      <span className="issue-strip-label">上报</span>

      <div className="issue-strip-track" role="listbox" aria-label="选择上报">
        {ordered.map((event, i) => {
          const ordinal = i + 1;
          const isSelected = event.id === selected.id;
          return (
            <button
              key={event.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`issue-strip-tick${isSelected ? " is-selected" : ""}`}
              title={`第 ${ordinal} 次 · ${formatAbsolute(event.created_at)}`}
              onClick={() => onSelectEvent(event.id)}
            >
              <span className="sr-only">
                第 {ordinal} 次 · {formatAbsolute(event.created_at)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="issue-strip-readout">
        <span className="issue-strip-count">
          第 {total - selectedIndex} / {total} 次
        </span>
        <span className="issue-strip-abs muted">{formatAbsolute(selected.created_at)}</span>
      </p>

      <div className="issue-strip-step">
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          disabled={selectedIndex >= total - 1}
          onClick={onOlder}
          aria-label="更早的上报"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-icon"
          disabled={selectedIndex <= 0}
          onClick={onNewer}
          aria-label="更晚的上报"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
