import { StackTraceView } from "./StackTraceView";
import { ClientPanel } from "./ClientPanel";
import type { EventRow } from "../../api";
import { extraEntries, formatExtraValue, occurrenceRows } from "./issueMeta";
import { clientSections } from "./clientMeta";
import { MetaTable } from "./MetaTable";

/** Primary detail tabs — stack / client snapshot / extra payload. */
export type DetailTab = "stack" | "client" | "extra";

type TabDef = { id: DetailTab; label: string };

export function visibleDetailTabs(
  displayStack: string | null,
  hasClient: boolean,
  hasExtra: boolean,
): TabDef[] {
  const tabs: TabDef[] = [];
  if (displayStack) tabs.push({ id: "stack", label: "堆栈" });
  if (hasClient) tabs.push({ id: "client", label: "客户端" });
  if (hasExtra) tabs.push({ id: "extra", label: "附加数据" });
  return tabs;
}

export function pickDefaultDetailTab(
  displayStack: string | null,
  hasClient: boolean,
  hasExtra: boolean,
): DetailTab {
  if (displayStack) return "stack";
  if (hasClient) return "client";
  if (hasExtra) return "extra";
  return "stack";
}

type Props = {
  tab: DetailTab;
  displayStack: string | null;
  hasClient: boolean;
  hasExtra: boolean;
  selectedEvent: EventRow | null;
  copied: string | null;
  onCopy: (label: string, text: string) => void;
};

export function DetailTabPanel({
  tab,
  displayStack,
  hasClient,
  hasExtra,
  selectedEvent,
  copied,
  onCopy,
}: Props) {
  const tabs = visibleDetailTabs(displayStack, hasClient, hasExtra);

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
        <ClientPanel
          sections={clientSections(selectedEvent)}
          emptyText="本条事件没有客户端信息。"
          copied={copied}
          onCopy={onCopy}
        />
      ) : null}

      {tab === "extra" && hasExtra ? (
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
