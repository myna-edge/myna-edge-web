export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.round((Date.now() - then) / 1000);
  if (diffSec < 60) return `${Math.max(diffSec, 0)} 秒前`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} 分钟前`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} 小时前`;
  return `${Math.round(diffHr / 24)} 天前`;
}

export function formatAbsolute(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("zh-CN");
}

export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function statusLabel(status: string): string {
  if (status === "open") return "未处理";
  if (status === "resolved") return "已解决";
  if (status === "ignored") return "已忽略";
  return status;
}
