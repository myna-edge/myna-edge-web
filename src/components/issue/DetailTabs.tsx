import { StackTraceView } from "./StackTraceView";
import { ClientPanel } from "./ClientPanel";
import type { EventRow } from "../../api";
import { extraEntries, formatExtraValue, occurrenceRows } from "./issueMeta";
import { MetaTable } from "./MetaTable";

export type DetailTab = "stack" | "client" | "context";

type TabDef = { id: DetailTab; label: string };

export function visibleDetailTabs(
  displayStack: string | null,
  hasClient: boolean,
  hasContext: boolean,
): TabDef[] {
  const tabs: TabDef[] = [];
  if (displayStack) tabs.push({ id: "stack", label: "堆栈" });
  if (hasClient) tabs.push({ id: "client", label: "客户端" });
  if (hasContext) tabs.push({ id: "context", label: "上下文" });
  return tabs;
}

type Props = {
  tab: DetailTab;
  displayStack: string | null;
  hasClient: boolean;
  hasContext: boolean;
  selectedEvent: EventRow | null;
  copied: string | null;
  onCopy: (label: string, text: string) => void;
};

export function DetailTabPanel({
  tab,
  displayStack,
  hasClient,
  hasContext,
  selectedEvent,
  copied,
  onCopy,
}: Props) {
  const tabs = visibleDetailTabs(displayStack, hasClient, hasContext);

  if (!selectedEvent) {
    return (
      <div className="detail-tab-panel">
        <p className="muted">暂无上报内容。</p>
      </div>
    );
  }

  if (tabs.length === 0) {
    return (
      <div className="detail-tab-panel">
        <MetaTable rows={occurrenceRows(selectedEvent)} copied={copied} onCopy={onCopy} />
      </div>
    );
  }

  return (
    <div className="detail-tab-panel">
      {tab === "stack" && displayStack ? (
        <StackTraceView
          stack={displayStack}
          copied={copied === "stack"}
          onCopy={() => onCopy("stack", displayStack)}
        />
      ) : null}

      {tab === "client" && hasClient ? (
        <ClientPanel event={selectedEvent} copied={copied} onCopy={onCopy} />
      ) : null}

      {tab === "context" && hasContext ? (
        <section className="detail-section">
          <div className="detail-section-head">
            <h2>附加数据</h2>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onCopy("extra", JSON.stringify(selectedEvent.extra, null, 2))}
            >
              {copied === "extra" ? "已复制" : "复制 JSON"}
            </button>
          </div>
          <dl className="extra-grid">
            {extraEntries(selectedEvent.extra).map(([key, value]) => (
              <div key={key} className="extra-item">
                <dt className="mono">{key}</dt>
                <dd className="mono">{formatExtraValue(value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  );
}
