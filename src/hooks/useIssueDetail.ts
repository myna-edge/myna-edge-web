import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchIssue,
  ignoreIssue,
  reopenIssue,
  resolveIssue,
  type EventRow,
  type Issue,
} from "../api";
import { extraEntries } from "../components/issue/issueMeta";
import { hasClientInfo } from "../components/issue/clientMeta";
import type { DetailTab } from "../components/issue/DetailTabs";
import { useCopy } from "./useCopy";

export function useIssueDetail(id: number) {
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [tab, setTab] = useState<DetailTab>("stack");
  const { copied, onCopy } = useCopy();

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError("无效的问题编号");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchIssue(id);
        if (cancelled) return;
        setIssue(data.issue);
        setEvents(data.events);
        setSelectedEventId(data.events.find((e) => e.stack)?.id ?? data.events[0]?.id ?? null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const selectedIndex = useMemo(
    () => events.findIndex((e) => e.id === selectedEventId),
    [events, selectedEventId],
  );

  const selectedEvent = selectedIndex >= 0 ? events[selectedIndex] : null;
  const displayStack = selectedEvent?.stack ?? null;
  const hasClient = hasClientInfo(selectedEvent);
  const hasContext = extraEntries(selectedEvent?.extra).length > 0;

  const userCount = useMemo(
    () => new Set(events.map((e) => e.user_id).filter(Boolean)).size,
    [events],
  );

  useEffect(() => {
    if (displayStack) {
      setTab("stack");
    } else if (hasClient) {
      setTab("client");
    } else if (hasContext) {
      setTab("context");
    }
  }, [selectedEventId, displayStack, hasClient, hasContext]);

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

  const onResolve = useCallback(async () => {
    if (!issue) return;
    setPending(true);
    try {
      await resolveIssue(issue.id);
      navigate("/?status=resolved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
      setPending(false);
    }
  }, [issue, navigate]);

  const onIgnore = useCallback(async () => {
    if (!issue) return;
    setPending(true);
    try {
      await ignoreIssue(issue.id);
      navigate("/?status=ignored");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
      setPending(false);
    }
  }, [issue, navigate]);

  const onReopen = useCallback(async () => {
    if (!issue) return;
    setPending(true);
    try {
      await reopenIssue(issue.id);
      navigate("/?status=open");
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败");
      setPending(false);
    }
  }, [issue, navigate]);

  return {
    issue,
    events,
    error,
    pending,
    loading,
    selectedEventId,
    selectedIndex,
    selectedEvent,
    displayStack,
    hasClient,
    hasContext,
    userCount,
    tab,
    setTab,
    copied,
    onCopy,
    selectEvent,
    selectOlder,
    selectNewer,
    onResolve,
    onIgnore,
    onReopen,
  };
}
