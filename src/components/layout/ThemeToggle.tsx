import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "../../theme/ThemeProvider";

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "浅色", Icon: Sun },
  { value: "dark", label: "深色", Icon: Moon },
  { value: "system", label: "跟随系统", Icon: Monitor },
];

export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="主题">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={`theme-toggle-btn${preference === value ? " is-active" : ""}`}
          aria-label={label}
          aria-pressed={preference === value}
          title={label}
          onClick={() => setPreference(value)}
        >
          <Icon size={15} strokeWidth={2} aria-hidden />
        </button>
      ))}
    </div>
  );
}
