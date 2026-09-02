import { Link } from "react-router-dom";

export type BreakdownItem = {
  label: string;
  count: number;
};

type Props = {
  title: string;
  subtitle?: string;
  items: BreakdownItem[];
  emptyText?: string;
  itemLink?: (item: BreakdownItem) => string | undefined;
};

export function BreakdownChart({
  title,
  subtitle,
  items,
  emptyText = "暂无数据",
  itemLink,
}: Props) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="dash-card">
      <div className="dash-card-head">
        <h3 className="dash-card-title">{title}</h3>
        {subtitle ? <span className="dash-card-subtitle">{subtitle}</span> : null}
      </div>
      {items.length === 0 ? (
        <p className="dash-card-empty muted">{emptyText}</p>
      ) : (
        <ul className="breakdown-list">
          {items.map((item) => {
            const href = itemLink?.(item);
            const row = (
              <>
                <span className="breakdown-label" title={item.label}>
                  {item.label}
                </span>
                <span className="breakdown-track" aria-hidden>
                  <span
                    className="breakdown-bar"
                    style={{
                      width: `${Math.max((item.count / max) * 100, item.count > 0 ? 4 : 0)}%`,
                    }}
                  />
                </span>
                <span className="breakdown-count">{item.count}</span>
              </>
            );

            return (
              <li key={item.label} className="breakdown-row">
                {href ? (
                  <Link to={href} className="breakdown-link">
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
