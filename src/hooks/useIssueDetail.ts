import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchIssue,
  ignoreIssue,
  reopenIssue,
  resolveIssue,
} from "../api";
import { extraEntries } from "../components/issue/issueMeta";
import { hasClientSnapshot } from "../components/issue/clientMeta";
import type { DetailTab } from "../components/issue/DetailTabs";
import { pickDefaultDetailTab } from "../components/issue/DetailTabs";
import { queryKeys } from "../query/client";
import { useCopy } from "./useCopy";

export function useIssueDetail(id: number) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [tab, setTab] = useState<DetailTab>("stack");
  const { copied, onCopy } = useCopy();

  const query = useQuery({
    queryKey: queryKeys.issue(id),
    queryFn: () => fetchIssue(id),
    enabled: Number.isFinite(id),
  });

  const issue = query.data?.issue ?? null;
  const events = query.data?.events ?? [];

  useEffect(() => {
    if (!events.length) return;
    setSelectedEventId((prev) => {
      if (prev != null && events.some((e) => e.id === prev)) return prev;
      return events.find((e) => e.stack)?.id ?? events[0]?.id ?? null;
    });
  }, [events]);

  const selectedIndex = useMemo(
    () => events.findIndex((e) => e.id === selectedEventId),
    [events, selectedEventId],
  );

  const selectedEvent = selectedIndex >= 0 ? events[selectedIndex] : null;
  const displayStack = selectedEvent?.stack ?? null;
  const hasClient = hasClientSnapshot(selectedEvent);
  const hasExtra = extraEntries(selectedEvent?.extra).length > 0;

  const userCount = useMemo(
    () => new Set(events.map((e) => e.user_id).filter(Boolean)).size,
    [events],
  );

  useEffect(() => {
    setTab(pickDefaultDetailTab(displayStack, hasClient, hasExtra));
  }, [selectedEventId, displayStack, hasClient, hasExtra]);

  const selectEvent = useCallback((eventId: number) => {
    setSelectedEventId(eventId);
  }, []);

  const selectOlder = useCallback(() => {
    if (selectedIndex < 0 || selectedIndex >= events.length - 1) return;
    selectEvent(events[selectedIndex + 1].id);
  }, [selectedIndex, events, selectEvent]);

  const selectNewer = useCallback(() => {
    if (selectedIndex <= 0) return;
    selectEvent(events[selectedIndex - 1].id);
  }, [selectedIndex, events, selectEvent]);

  const invalidateRelated = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["issues"] });
    void queryClient.invalidateQueries({ queryKey: ["overview"] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.issue(id) });
  }, [queryClient, id]);

  const resolveMutation = useMutation({
    mutationFn: () => resolveIssue(id),
    onSuccess: () => {
      invalidateRelated();
      navigate("/?status=resolved");
    },
  });

  const ignoreMutation = useMutation({
    mutationFn: () => ignoreIssue(id),
    onSuccess: () => {
      invalidateRelated();
      navigate("/?status=ignored");
    },
  });

  const reopenMutation = useMutation({
    mutationFn: () => reopenIssue(id),
    onSuccess: () => {
      invalidateRelated();
      navigate("/?status=open");
    },
  });

  const actionError =
    resolveMutation.error || ignoreMutation.error || reopenMutation.error;
  const loadError = !Number.isFinite(id)
    ? "无效的问题编号"
    : query.error
      ? query.error instanceof Error
        ? query.error.message
        : "加载失败"
      : null;

  return {
    issue,
    events,
    error:
      loadError ||
      (actionError ? (actionError instanceof Error ? actionError.message : "操作失败") : null),
    pending: resolveMutation.isPending || ignoreMutation.isPending || reopenMutation.isPending,
    loading: query.isPending,
    selectedEventId,
    selectedIndex,
    selectedEvent,
    displayStack,
    hasClient,
    hasExtra,
    userCount,
    tab,
    setTab,
    copied,
    onCopy,
    selectEvent,
    selectOlder,
    selectNewer,
    onResolve: () => resolveMutation.mutate(),
    onIgnore: () => ignoreMutation.mutate(),
    onReopen: () => reopenMutation.mutate(),
  };
}
