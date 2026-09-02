import { useEffect, useState, type ReactNode } from "react";
import { apiDisplayBase, fetchHealth, type HealthResponse } from "../../api";

type DsnCardProps = {
  dsn: string;
};

export function DsnCard({ dsn }: DsnCardProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchHealth();
        if (!cancelled) {
          setHealth(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setHealth(null);
          setError(err instanceof Error ? err.message : "无法连接 API");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(dsn);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  let statusNode: ReactNode = <span className="muted">连接中…</span>;
  if (health) {
    statusNode = (
      <span className="badge badge-ok">
        在线 · {health.storage}
        {health.ingestAuth ? " · 需 Token" : ""}
      </span>
    );
  } else if (error) {
    statusNode = <span className="badge badge-warn">离线</span>;
  }

  return (
    <section className="card">
      <div className="card-head">
        <h2 className="card-title">DSN</h2>
        <div className="card-actions">
          {statusNode}
          <button type="button" className="btn btn-ghost" onClick={onCopy}>
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </div>
      <pre className="code-block code-block-dsn">{dsn}</pre>
      <p className="card-note muted">
        采集地址（POST 到此 URL）· {apiDisplayBase()}
        {health?.ingestAuth
          ? " · 服务端已启用 MYNA_INGEST_TOKEN，SDK 须传入相同 Token"
          : " · 本地未启用 Token 时可省略"}
      </p>
      {error ? <p className="flash-error">{error}</p> : null}
    </section>
  );
}
