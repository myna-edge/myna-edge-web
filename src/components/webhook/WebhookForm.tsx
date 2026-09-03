import type { FormEvent } from "react";
import type { WebhookConfig } from "../../api";
import { ClearableInput } from "../ui/ClearableInput";

function isDingTalkUrl(url: string): boolean {
  return url.toLowerCase().includes("oapi.dingtalk.com");
}

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
  const dingTalk = isDingTalkUrl(config.url);

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
        <p className="form-hint muted">
          粘贴飞书、企业微信或钉钉机器人地址；其他地址按通用 JSON 发送。钉钉若选「自定义关键词」，请填
          Myna（消息里已包含）。
        </p>
        <input
          id="webhook-url"
          className="input input-block"
          type="url"
          placeholder="https://..."
          value={config.url}
          onChange={(e) => onPatch("url", e.target.value)}
        />
      </div>

      {dingTalk ? (
        <div className="form-field">
          <label className="form-label" htmlFor="webhook-sign-secret">
            钉钉加签密钥
          </label>
          <p className="form-hint muted">
            安全设置选「加签」时填写 SEC 开头的密钥；用关键词则可留空。
          </p>
          <ClearableInput
            id="webhook-sign-secret"
            type="password"
            value={config.signSecret}
            onChange={(value) => onPatch("signSecret", value)}
            autoComplete="off"
            placeholder="SEC..."
            spellCheck={false}
          />
        </div>
      ) : null}

      <div className="form-field">
        <label className="form-label" htmlFor="webhook-console">
          控制台地址
        </label>
        <p className="form-hint muted">用于在通知里生成问题详情链接。</p>
        <input
          id="webhook-console"
          className="input input-block"
          type="url"
          placeholder={typeof window !== "undefined" ? window.location.origin : "https://..."}
          value={config.consoleUrl}
          onChange={(e) => onPatch("consoleUrl", e.target.value)}
        />
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
