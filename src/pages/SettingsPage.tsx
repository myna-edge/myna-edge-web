import { useEffect, useState, type FormEvent } from "react";
import { fetchHealth } from "../api";
import { useConnection } from "../connection/ConnectionProvider";
import { connectionDefaults, type ConnectionDraft } from "../connection/storage";
import { PageIntro } from "../components/layout/PageIntro";
import { toast } from "../toast";

export function SettingsPage() {
  const { draft, overridden, save, reset } = useConnection();
  const [form, setForm] = useState<ConnectionDraft>(draft);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setForm(draft);
  }, [draft]);

  function patch<K extends keyof ConnectionDraft>(key: K, value: ConnectionDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (import.meta.env.PROD && !form.apiBase.trim() && !connectionDefaults().apiBase) {
        throw new Error("生产环境必须填写 API 地址");
      }
      save(form);
      toast.success("已保存");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function onTest() {
    setTesting(true);
    try {
      await fetchHealth(form.apiBase);
      toast.success("连接成功");
    } catch {
      toast.error("连接失败");
    } finally {
      setTesting(false);
    }
  }

  function onReset() {
    reset();
    toast.success("已恢复默认");
  }

  return (
    <div className="page">
      <PageIntro title="设置" desc="本机浏览器中的 API 连接配置，仅影响当前设备。" />

      <form className="card webhook-form" onSubmit={onSubmit}>
        <div className="form-field">
          <label className="form-label" htmlFor="conn-api-base">
            API 地址
          </label>
          <input
            id="conn-api-base"
            className="input input-block"
            type="text"
            inputMode="url"
            placeholder="https://"
            value={form.apiBase}
            onChange={(e) => patch("apiBase", e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="form-hint muted">
            {import.meta.env.DEV
              ? "留空则使用本地开发代理（:43127 → :8787）。"
              : "填写 Worker 根地址，不要带 /api。"}
          </p>
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="conn-secret">
            密钥
          </label>
          <input
            id="conn-secret"
            className="input input-block"
            type="password"
            value={form.secret}
            onChange={(e) => patch("secret", e.target.value)}
            autoComplete="off"
          />
          <p className="form-hint muted">API 开启鉴权时需要；Webhook 与接入示例共用。</p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-accent" disabled={saving}>
            {saving ? "保存中…" : "保存"}
          </button>
          <button type="button" className="btn btn-ghost" disabled={testing} onClick={onTest}>
            {testing ? "测试中…" : "测试连接"}
          </button>
          <button type="button" className="btn btn-ghost" disabled={!overridden} onClick={onReset}>
            恢复默认
          </button>
        </div>
      </form>
    </div>
  );
}
