import { Check, X } from "lucide-react";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { getToastsSnapshot, subscribeToasts, toast, type ToastItem } from "./store";

function ToastCard({ item }: { item: ToastItem }) {
  const Icon = item.tone === "ok" ? Check : X;
  return (
    <div
      className={`toast toast--${item.tone}`}
      role={item.tone === "err" ? "alert" : "status"}
      onClick={() => toast.dismiss(item.id)}
    >
      <span className="toast-icon" aria-hidden>
        <Icon size={14} strokeWidth={2.5} />
      </span>
      <span className="toast-text">{item.text}</span>
    </div>
  );
}

export function ToastViewport() {
  const items = useSyncExternalStore(subscribeToasts, getToastsSnapshot, () => []);

  if (typeof document === "undefined" || items.length === 0) return null;

  return createPortal(
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>,
    document.body,
  );
}
