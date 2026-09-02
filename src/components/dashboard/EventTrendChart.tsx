import { useMemo } from "react";
import type { EventTrendPoint } from "../../api";

type EventTrendChartProps = {
  points: EventTrendPoint[];
  days?: number;
  title?: string;
  unit?: string;
};

function formatDayLabel(day: string): string {
  const parts = day.split("-");
  if (parts.length !== 3) return day;
  return `${Number(parts[1])}/${Number(parts[2])}`;
}

/** 控制 x 轴标签密度，避免 14/30 天时重叠 */
function labelStep(count: number): number {
  if (count <= 8) return 1;
  if (count <= 16) return 2;
  return Math.max(Math.ceil(count / 6), 3);
}

function showPointLabel(index: number, total: number, step: number): boolean {
  if (index === 0 || index === total - 1) return true;
  return index % step === 0;
}

export function EventTrendChart({ points, days = 7, title, unit = "次" }: EventTrendChartProps) {
  const chart = useMemo(() => {
    const width = 640;
    const height = 88;
    const pad = { top: 10, right: 12, bottom: 22, left: 12 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const max = Math.max(...points.map((p) => p.count), 1);
    const total = points.reduce((sum, p) => sum + p.count, 0);
    const n = Math.max(points.length - 1, 1);
    const step = labelStep(points.length);
    const showDots = points.length <= 16;

    const coords = points.map((p, i) => {
      const x = pad.left + (i / n) * innerW;
      const y = pad.top + innerH - (p.count / max) * innerH;
      return {
        x,
        y,
        day: p.day,
        count: p.count,
        showLabel: showPointLabel(i, points.length, step),
      };
    });

    const line = coords
      .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(" ");
    const last = coords[coords.length - 1];
    const first = coords[0];
    const area = `${line} L${last.x.toFixed(1)} ${(pad.top + innerH).toFixed(1)} L${first.x.toFixed(1)} ${(pad.top + innerH).toFixed(1)} Z`;

    return { width, height, max, total, coords, line, area, showDots };
  }, [points]);

  if (points.length === 0) {
    const rangeLabel = title ?? `近 ${days} 天`;
    return (
      <div className="trend-card trend-card-empty">
        <p className="muted">{rangeLabel} · 暂无数据</p>
      </div>
    );
  }

  const rangeLabel = title ?? `近 ${days} 天`;

  return (
    <div className="trend-card">
      <div className="trend-card-head">
        <span className="trend-card-title">{rangeLabel}</span>
        <span className="trend-card-total">
          共 <strong>{chart.total}</strong> {unit} · 峰值 {chart.max}
        </span>
      </div>
      <svg
        className="trend-svg"
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        role="img"
        aria-label={`${rangeLabel}，共 ${chart.total} ${unit}`}
      >
        <path d={chart.area} className="trend-area" />
        <path d={chart.line} className="trend-line" fill="none" />
        {chart.coords.map((c) => (
          <g key={c.day}>
            {chart.showDots ? <circle cx={c.x} cy={c.y} r={2.5} className="trend-dot" /> : null}
            {c.showLabel ? (
              <text x={c.x} y={chart.height - 4} textAnchor="middle" className="trend-label">
                {formatDayLabel(c.day)}
              </text>
            ) : null}
            <title>{`${c.day}: ${c.count}${unit}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}
