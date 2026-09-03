import { Link } from "react-router-dom";
import { CodeBlock } from "../ui/CodeBlock";

type DsnCardProps = {
  dsn: string;
  needsToken?: boolean;
};

export function DsnCard({ dsn, needsToken = false }: DsnCardProps) {
  const display = dsn || "（尚未配置 API 地址，请先到设置填写）";

  return (
    <section className="card">
      <h2 className="card-title">DSN</h2>
      <CodeBlock code={display} className="code-block-dsn" copyable={Boolean(dsn)} />
      <p className="card-note muted">
        这是 API 根地址，填入 SDK 的 <code className="mono">dsn</code>
        {needsToken ? "。当前已启用密钥，初始化时请一并传入 token" : ""}。
      </p>
      {!dsn ? (
        <p className="card-note muted">
          去 <Link to="/settings">设置</Link> 配置 API 地址后再回来复制。
        </p>
      ) : null}
    </section>
  );
}
