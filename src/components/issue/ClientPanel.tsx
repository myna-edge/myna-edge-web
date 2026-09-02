import type { EventRow } from "../../api";
import { clientSections } from "./clientMeta";
import { MetaTable } from "./MetaTable";

type Props = {
  event: EventRow;
  copied: string | null;
  onCopy: (label: string, text: string) => void;
};

export function ClientPanel({ event, copied, onCopy }: Props) {
  const sections = clientSections(event);

  if (sections.length === 0) {
    return <p className="muted">本条事件没有客户端信息。</p>;
  }

  return (
    <div className="client-panel">
      {sections.map((section) => (
        <section key={section.title} className="detail-section">
          <h2>{section.title}</h2>
          <MetaTable rows={section.rows} copied={copied} onCopy={onCopy} />
        </section>
      ))}
    </div>
  );
}
