import { Link } from "react-router-dom";
import { ingestDsn, ingestToken } from "../api";
import { CopyBlock } from "../components/guide/CopyBlock";
import { DsnCard } from "../components/guide/DsnCard";
import { PageIntro } from "../components/layout/PageIntro";

function buildNpmSnippet(dsn: string, token?: string): string {
  const tokenLine = token ? `\n  token: "${token}",` : "";
  return `import { initMyna } from "@myna-edge/sdk";

initMyna({
  dsn: "${dsn}",${tokenLine}
  release: "1.0.0",
  environment: "production",
});`;
}

function buildHtmlSnippet(dsn: string, token?: string): string {
  const tokenLine = token ? `\n    token: "${token}",` : "";
  return `<script src="/myna.global.js"></script>
<script>
  Myna.initMyna({
    dsn: "${dsn}",${tokenLine}
    release: "1.0.0",
    environment: "production",
  });
</script>`;
}

const TEST_SNIPPET = `throw new Error("Myna test");`;

export function GuidePage() {
  const dsn = ingestDsn();
  const token = ingestToken() || undefined;

  return (
    <div className="page">
      <PageIntro title="接入" desc="复制 DSN 与 SDK 代码，将应用错误接入 Myna。" />
      <DsnCard dsn={dsn} />
      <CopyBlock title="npm / bundler" code={buildNpmSnippet(dsn, token)} />
      <CopyBlock title="纯 HTML" code={buildHtmlSnippet(dsn, token)} />
      <CopyBlock title="验证上报" code={TEST_SNIPPET} />
      <section className="card">
        <h2 className="card-title">验证接入</h2>
        <ol className="steps">
          <li>
            在应用入口调用 <code className="mono">initMyna</code>，填入 DSN。
          </li>
          <li>
            在已接入 SDK 的页面执行上方「验证上报」代码，或在业务代码中主动{" "}
            <code className="mono">throw</code> 一个测试错误。
          </li>
          <li>
            返回 <Link to="/issues">问题列表</Link> 确认是否收到。
          </li>
        </ol>
      </section>
    </div>
  );
}
