import { DASHBOARD_DAYS_OPTIONS, type DashboardDays } from "./constants";

type Props = {
  value: DashboardDays;
  onChange: (days: DashboardDays) => void;
};

export function DashboardRangePicker({ value, onChange }: Props) {
  return (
    <div className="dashboard-range" role="group" aria-label="统计时间范围">
      {DASHBOARD_DAYS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`dashboard-range-btn ${value === opt.value ? "is-active" : ""}`}
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
