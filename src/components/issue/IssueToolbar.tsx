import type { DetailTab } from "./DetailTabs";
import { visibleDetailTabs } from "./DetailTabs";

type Props = {
  tab: DetailTab;
  displayStack: string | null;
  hasPage: boolean;
  hasEnvironment: boolean;
  hasContext: boolean;
  onTabChange: (tab: DetailTab) => void;
};

/** Tabs-only strip; event switching lives in IssueMetaBar. */
export function IssueToolbar({
  tab,
  displayStack,
  hasPage,
  hasEnvironment,
  hasContext,
  onTabChange,
}: Props) {
  const tabs = visibleDetailTabs(displayStack, hasPage, hasEnvironment, hasContext);
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
