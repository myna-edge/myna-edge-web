import { apiBase } from "./client";
import type { OverviewResponse } from "./types";

export async function fetchOverview(days = 7): Promise<OverviewResponse> {
  const res = await fetch(`${apiBase()}/api/overview?days=${days}`);
  if (!res.ok) throw new Error(`GET /api/overview → ${res.status}`);
  return res.json();
}
