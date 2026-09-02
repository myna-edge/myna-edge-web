import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ClientSection } from "./clientMeta";
import { MetaTable } from "./MetaTable";

type Props = {
  sections: ClientSection[];
  emptyText?: string;
  /** When multiple sections, allow collapse. Default true. */
  collapsible?: boolean;
  copied: string | null;
  onCopy: (label: string, text: string) => void;
};

export function ClientPanel({
  sections,
  emptyText = "暂无信息。",
  collapsible = true,
  copied,
  onCopy,
}: Props) {
  const showTitles = sections.length > 1 || sections[0]?.title !== "页面";
  const canCollapse = collapsible && showTitles && sections.length > 1;
  const sectionKey = sections.map((s) => s.title).join("|");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const titles = sectionKey ? sectionKey.split("|") : [];
    setOpen(Object.fromEntries(titles.map((title) => [title, true])));
  }, [sectionKey]);

  if (sections.length === 0) {
    return <p className="muted">{emptyText}</p>;
  }

  function toggle(title: string) {
    setOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <div className="client-panel">
      {sections.map((section) => {
        const isOpen = !canCollapse || open[section.title] !== false;
        return (
          <section
            key={section.title}
            className={`client-section${isOpen ? " is-open" : " is-collapsed"}`}
          >
            {showTitles ? (
              canCollapse ? (
                <button
                  type="button"
                  className="client-section-toggle"
                  aria-expanded={isOpen}
                  onClick={() => toggle(section.title)}
                >
                  <span className="client-section-title">{section.title}</span>
                  <span className="client-section-meta muted">
                    {section.rows.length} 项
                  </span>
                  <ChevronDown size={16} className="client-section-chevron" aria-hidden />
                </button>
              ) : (
                <h2 className="client-section-title">{section.title}</h2>
              )
            ) : null}

            {isOpen ? (
              <MetaTable rows={section.rows} copied={copied} onCopy={onCopy} />
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
