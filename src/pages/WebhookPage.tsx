import { useEffect, useState, type FormEvent } from "react";
import { WebhookForm } from "../components/webhook/WebhookForm";
import { WebhookFormSkeleton } from "../components/webhook/WebhookFormSkeleton";
import { PageIntro } from "../components/layout/PageIntro";
import {
  fetchHealth,
  fetchWebhookConfig,
  saveWebhookConfig,
  testWebhookConfig,
  type WebhookConfig,
} from "../api";

const EMPTY: WebhookConfig = {
  enabled: false,
  url: "",
  format: "auto",
  consoleUrl: "",
  notifyNew: true,
  notifyReopened: true,
};

export function WebhookPage() {
  const [config, setConfig] = useState<WebhookConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [adminAuth, setAdminAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [health, saved] = await Promise.all([fetchHealth(), fetchWebhookConfig()]);
        if (cancelled) return;
        setAdminAuth(health.adminAuth);
        setConfig({
          ...saved,
          consoleUrl: saved.consoleUrl || window.location.origin,
        });
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function patch<K extends keyof WebhookConfig>(key: K, value: WebhookConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setNotice(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const saved = await saveWebhookConfig(config);
      setConfig(saved);
      setNotice("已保存");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function onTest() {
    setTesting(true);
    setError(null);
    setNotice(null);
    try {
      if (config.url.trim()) {
        await saveWebhookConfig(config);
      }
      await testWebhookConfig();
      setNotice("测试消息已发送");
    } catch (err) {
      setError(err instanceof Error ? err.message : "测试失败");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="page">
      <PageIntro title="告警" desc="通过 Webhook 在新问题出现或已解决问题复发时发送通知。" />

      {error ? <p className="flash-error">{error}</p> : null}
      {notice ? <p className="flash-ok">{notice}</p> : null}

      {loading ? <WebhookFormSkeleton /> : null}

      {!loading ? (
        <WebhookForm
          config={config}
          adminAuth={adminAuth}
          saving={saving}
          testing={testing}
          onPatch={patch}
          onSubmit={onSubmit}
          onTest={onTest}
        />
      ) : null}
    </div>
  );
}
