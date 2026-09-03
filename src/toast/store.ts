export type ToastTone = "ok" | "err";

export type ToastItem = {
  id: string;
  tone: ToastTone;
  text: string;
};

const MAX_VISIBLE = 3;
const DEFAULT_DURATION_MS = 2600;

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
const timers = new Map<string, number>();

function emit() {
  for (const listener of listeners) listener();
}

function dismiss(id: string) {
  const timer = timers.get(id);
  if (timer) {
    window.clearTimeout(timer);
    timers.delete(id);
  }
  const next = toasts.filter((t) => t.id !== id);
  if (next.length === toasts.length) return;
  toasts = next;
  emit();
}

function push(tone: ToastTone, text: string, durationMs = DEFAULT_DURATION_MS) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  toasts = [...toasts, { id, tone, text }].slice(-MAX_VISIBLE);
  emit();

  timers.set(
    id,
    window.setTimeout(() => {
      dismiss(id);
    }, durationMs),
  );

  return id;
}

export const toast = {
  success(text: string, durationMs?: number) {
    return push("ok", text, durationMs);
  },
  error(text: string, durationMs?: number) {
    return push("err", text, durationMs);
  },
  dismiss,
};

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToastsSnapshot(): ToastItem[] {
  return toasts;
}
