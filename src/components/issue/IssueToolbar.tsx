import type { DetailTab } from "./DetailTabs";
import { visibleDetailTabs } from "./DetailTabs";

type Props = {
  tab: DetailTab;
  displayStack: string | null;
  hasClient: boolean;
  hasExtra: boolean;
  onTabChange: (tab: DetailTab) => void;
};

/** Tabs-only strip; event switching lives in IssueEventStrip. */
export function IssueToolbar({
  tab,
  displayStack,
  hasClient,
  hasExtra,
  onTabChange,
}: Props) {
  const tabs = visibleDetailTabs(displayStack, hasClient, hasExtra);
  if (tabs.length === 0) return null;

  return (
    <div className="issue-toolbar">
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
    </div>
  );
}
