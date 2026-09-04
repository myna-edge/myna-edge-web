import { useEffect, useState } from "react";
import type { ClientSection } from "./clientMeta";
import { MetaTable } from "./MetaTable";

type Props = {
  sections: ClientSection[];
  emptyText?: string;
  /** Kept for callers; multi-section panels use exclusive section switching. */
  collapsible?: boolean;
  copied: string | null;
  onCopy: (label: string, text: string) => void;
};

/**
 * Exclusive section switching. Storage-like sections with `panes` get a
 * Chrome Application-style left rail for Local / Session / Cookies / IndexedDB.
 */
export function ClientPanel({
  sections,
  emptyText = "暂无信息。",
  copied,
  onCopy,
}: Props) {
  const showTitles = sections.length > 1 || sections[0]?.title !== "页面";
  const canNavigate = showTitles && sections.length > 1;
  const sectionKey = sections.map((s) => s.title).join("|");
  const [activeTitle, setActiveTitle] = useState(sections[0]?.title ?? "");
  const [activePaneTitle, setActivePaneTitle] = useState("");

  useEffect(() => {
    const titles = sectionKey ? sectionKey.split("|") : [];
    setActiveTitle((prev) => (prev && titles.includes(prev) ? prev : titles[0] ?? ""));
  }, [sectionKey]);

  const activeSection =
    sections.find((section) => section.title === activeTitle) ?? sections[0];
  const panes = activeSection?.panes ?? [];
  const paneKey = panes.map((pane) => pane.title).join("|");

  useEffect(() => {
    const titles = paneKey ? paneKey.split("|") : [];
    setActivePaneTitle((prev) => (prev && titles.includes(prev) ? prev : titles[0] ?? ""));
  }, [paneKey, activeTitle]);

  if (sections.length === 0) {
    return <p className="muted">{emptyText}</p>;
  }

  const activePane =
    panes.find((pane) => pane.title === activePaneTitle) ?? panes[0] ?? null;
  const displayRows = activePane?.rows ?? activeSection.rows;
  const displayLabel = activePane?.title ?? activeSection.title;

  return (
    <div className="client-panel">
      {canNavigate ? (
        <nav className="client-section-nav" aria-label="环境信息分组">
          {sections.map((section) => {
            const selected = section.title === activeSection.title;
            return (
              <button
                key={section.title}
                type="button"
                className={`client-section-nav-item${selected ? " is-active" : ""}`}
                aria-current={selected ? "true" : undefined}
                onClick={() => setActiveTitle(section.title)}
              >
                {section.title}
              </button>
            );
          })}
        </nav>
      ) : null}

      {panes.length > 0 ? (
        <div className="client-storage">
          <nav className="client-storage-rail" aria-label={`${activeSection.title} 子分组`}>
            {panes.map((pane) => {
              const selected = pane.title === (activePane?.title ?? "");
              return (
                <button
                  key={pane.title}
                  type="button"
                  className={`client-storage-rail-item${selected ? " is-active" : ""}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setActivePaneTitle(pane.title)}
                >
                  {pane.title}
                </button>
              );
            })}
          </nav>
          <section className="client-section is-open" aria-label={displayLabel}>
            <MetaTable rows={displayRows} copied={copied} onCopy={onCopy} />
          </section>
        </div>
      ) : (
        <section className="client-section is-open" aria-label={displayLabel}>
          {showTitles && !canNavigate ? (
            <h2 className="client-section-heading">
              <span className="client-section-title">{activeSection.title}</span>
              <span className="client-section-meta muted">{activeSection.rows.length}</span>
            </h2>
          ) : null}
          <MetaTable rows={displayRows} copied={copied} onCopy={onCopy} />
        </section>
      )}
    </div>
  );
}
