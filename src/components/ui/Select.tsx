import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Override trigger text (menu still uses each option.label). */
  displayLabel?: string;
  "aria-label"?: string;
  id?: string;
  className?: string;
  block?: boolean;
};

export function Select({
  value,
  options,
  onChange,
  displayLabel,
  "aria-label": ariaLabel,
  id,
  className,
  block,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : options[0];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);

    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, selectedIndex]);

  function selectOption(opt: SelectOption) {
    onChange(opt.value);
    setOpen(false);
  }

  function onTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i < 0 ? 0 : i + 1, options.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.max(i < 0 ? options.length - 1 : i - 1, 0));
      return;
    }
    if (e.key === "Enter" && open && activeIndex >= 0) {
      e.preventDefault();
      selectOption(options[activeIndex]);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  }

  const rootClass = ["select-root", block ? "select-root-block" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={rootClass}>
      <button
        type="button"
        id={id}
        className="select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="select-value">{displayLabel ?? selected?.label ?? "—"}</span>
        <ChevronDown
          size={14}
          strokeWidth={2.25}
          className={`select-chevron${open ? " is-open" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <ul id={listId} role="listbox" className="select-menu" aria-label={ariaLabel}>
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <li key={opt.value || "__empty__"} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={[
                    "select-option",
                    isSelected ? "is-selected" : "",
                    isActive ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => selectOption(opt)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
