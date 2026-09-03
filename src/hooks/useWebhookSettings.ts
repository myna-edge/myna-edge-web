import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import {
  fetchHealth,
  fetchWebhookConfig,
  saveWebhookConfig,
  testWebhookConfig,
  type WebhookConfig,
} from "../api";
import { queryKeys } from "../query/client";
import { toast } from "../toast";

type WebhookQueryData = {
  adminAuth: boolean;
  config: WebhookConfig;
};

function withConsoleFallback(config: WebhookConfig): WebhookConfig {
  return {
    ...config,
    consoleUrl: config.consoleUrl || window.location.origin,
  };
}

export function useWebhookSettings() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<WebhookConfig | null>(null);
  const [dirty, setDirty] = useState(false);

  const query = useQuery({
    queryKey: queryKeys.webhook(),
    queryFn: async (): Promise<WebhookQueryData> => {
      const [health, saved] = await Promise.all([fetchHealth(), fetchWebhookConfig()]);
      return {
        adminAuth: health.adminAuth,
        config: withConsoleFallback(saved),
      };
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (!query.data || dirty) return;
    setDraft(query.data.config);
  }, [query.data, dirty]);

  function patch<K extends keyof WebhookConfig>(key: K, value: WebhookConfig[K]) {
    setDraft((prev) => {
      const base = prev ?? query.data?.config;
      if (!base) return prev;
      return { ...base, [key]: value };
    });
    setDirty(true);
  }

  const saveMutation = useMutation({
    mutationFn: (config: WebhookConfig) => saveWebhookConfig(config),
    onSuccess: (saved) => {
      const next = withConsoleFallback(saved);
      setDraft(next);
      setDirty(false);
      queryClient.setQueryData<WebhookQueryData>(queryKeys.webhook(), (prev) =>
        prev ? { ...prev, config: next } : { adminAuth: false, config: next },
      );
      toast.success("已保存");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "保存失败");
    },
  });

  const testMutation = useMutation({
    mutationFn: (config: WebhookConfig) => testWebhookConfig(config),
    onSuccess: () => {
      toast.success("测试消息已发送");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "测试失败");
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const config = draft ?? query.data?.config;
    if (!config) return;
    saveMutation.mutate(config);
  }

  function onTest() {
    const config = draft ?? query.data?.config;
    if (!config) return;
    testMutation.mutate(config);
  }

  return {
    config: draft ?? query.data?.config ?? null,
    adminAuth: query.data?.adminAuth ?? false,
    loading: query.isPending,
    saving: saveMutation.isPending,
    testing: testMutation.isPending,
    error: query.error
      ? query.error instanceof Error
        ? query.error.message
        : "加载失败"
      : null,
    patch,
    onSubmit,
    onTest,
  };
}
