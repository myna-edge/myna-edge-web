export const NAV_ITEMS = [
  { to: "/", label: "概览", end: true as const },
  { to: "/issues", label: "问题" },
  { to: "/webhook", label: "告警" },
  { to: "/guide", label: "接入" },
] as const;
