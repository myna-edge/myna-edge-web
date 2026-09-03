import { X } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type ClearableInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "value" | "onChange"> & {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function ClearableInput({
  id,
  value,
  onChange,
  className = "",
  ...rest
}: ClearableInputProps) {
  const showClear = value.length > 0;

  return (
    <div className={`input-clearable${className ? ` ${className}` : ""}`}>
      <input
        id={id}
        className="input input-block"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {showClear ? (
        <button
          type="button"
          className="input-clear"
          aria-label="清除"
          onClick={() => onChange("")}
        >
          <X size={14} strokeWidth={2} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
