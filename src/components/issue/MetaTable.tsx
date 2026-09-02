import type { MetaRow } from "./issueMeta";

type Props = {
  rows: MetaRow[];
  copied?: string | null;
  onCopy?: (label: string, text: string) => void;
};

export function MetaTable({ rows, copied, onCopy }: Props) {
  return (
    <dl className="detail-meta">
      {rows.map((row) => (
        <div key={row.label} className="detail-meta-wide">
          <dt>{row.label}</dt>
          <dd className={row.mono ? "mono detail-fingerprint" : undefined}>
            {row.href ? (
              <a href={row.href} target="_blank" rel="noreferrer" className="detail-link">
                {row.value}
              </a>
            ) : (
              <span>{row.value}</span>
            )}
            {row.copy && onCopy ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onCopy(row.copy!.key, row.copy!.text)}
              >
                {copied === row.copy.key ? "已复制" : "复制"}
              </button>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
