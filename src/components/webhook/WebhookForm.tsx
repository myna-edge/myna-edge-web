import type { FormEvent } from "react";
import type { WebhookConfig, WebhookFormat } from "../../api";
import { Select } from "../ui/Select";

const FORMAT_OPTIONS: { value: WebhookFormat; label: string }[] = [
  { value: "auto", label: "自动识别" },
  { value: "feishu", label: "飞书 / Lark" },
  { value: "wecom", label: "企业微信" },
  { value: "slack", label: "Slack" },
  { value: "generic", label: "通用 JSON" },
];

type Props = {
  config: WebhookConfig;
  adminAuth: boolean;
  saving: boolean;
  testing: boolean;
  onPatch: <K extends keyof WebhookConfig>(key: K, value: WebhookConfig[K]) => void;
  onSubmit: (e: FormEvent) => void;
  onTest: () => void;
};

export function WebhookForm({
  config,
  adminAuth,
  saving,
  testing,
  onPatch,
  onSubmit,
  onTest,
}: Props) {
  return (
    <form className="card webhook-form" onSubmit={onSubmit}>
      <label className="form-check">
        <input
          type="checkbox"
          checked={config.enabled}
          onChange={(e) => onPatch("enabled", e.target.checked)}
        />
        <span>启用 Webhook 告警</span>
      </label>

      <div className="form-field">
        <label className="form-label" htmlFor="webhook-url">
          Webhook URL
        </label>
        <input
          id="webhook-url"
          className="input input-block"
          type="url"
          placeholder="https://..."
          value={config.url}
          onChange={(e) => onPatch("url", e.target.value)}
        />
        <p className="form-hint muted">
          支持飞书、企业微信、Slack 机器人地址，或任意可接收 POST 的 URL。
        </p>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="webhook-format">
          消息格式
        </label>
        <Select
          id="webhook-format"
          block
          value={config.format}
          aria-label="消息格式"
          options={FORMAT_OPTIONS}
          onChange={(next) => onPatch("format", next as WebhookFormat)}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="webhook-console">
          控制台地址
        </label>
        <input
          id="webhook-console"
          className="input input-block"
          type="url"
          placeholder={typeof window !== "undefined" ? window.location.origin : "https://..."}
          value={config.consoleUrl}
          onChange={(e) => onPatch("consoleUrl", e.target.value)}
        />
        <p className="form-hint muted">用于在通知里生成问题详情链接。</p>
      </div>

      <fieldset className="form-fieldset">
        <legend className="form-label">触发条件</legend>
        <label className="form-check">
          <input
            type="checkbox"
            checked={config.notifyNew}
            onChange={(e) => onPatch("notifyNew", e.target.checked)}
          />
          <span>新问题（首次出现的 Issue）</span>
        </label>
        <label className="form-check">
          <input
            type="checkbox"
            checked={config.notifyReopened}
            onChange={(e) => onPatch("notifyReopened", e.target.checked)}
          />
          <span>问题复发（已解决后再次上报）</span>
        </label>
      </fieldset>

      {adminAuth ? (
        <p className="card-note muted">
          API 已启用鉴权，保存与测试需在「设置」页填写密钥。
        </p>
      ) : null}

      <div className="form-actions">
        <button type="submit" className="btn btn-accent" disabled={saving}>
          {saving ? "保存中…" : "保存"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={testing || !config.url.trim()}
          onClick={onTest}
        >
          {testing ? "发送中…" : "发送测试"}
        </button>
      </div>
    </form>
  );
}
