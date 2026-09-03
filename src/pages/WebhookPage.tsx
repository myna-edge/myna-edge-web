import { WebhookForm } from "../components/webhook/WebhookForm";
import { WebhookFormSkeleton } from "../components/webhook/WebhookFormSkeleton";
import { PageIntro } from "../components/layout/PageIntro";
import { useWebhookSettings } from "../hooks/useWebhookSettings";

export function WebhookPage() {
  const {
    config,
    adminAuth,
    loading,
    saving,
    testing,
    error,
    patch,
    onSubmit,
    onTest,
  } = useWebhookSettings();

  return (
    <div className="page">
      <PageIntro title="告警" desc="通过 Webhook 在新问题出现或已解决问题复发时发送通知。" />

      {error ? <p className="flash-error">{error}</p> : null}

      {loading || !config ? <WebhookFormSkeleton /> : null}

      {!loading && config ? (
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
