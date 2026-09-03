import { Link } from "react-router-dom";
import { ingestDsn, apiSecret } from "../api";
import { CopyBlock } from "../components/guide/CopyBlock";
import { DsnCard } from "../components/guide/DsnCard";
import { PageIntro } from "../components/layout/PageIntro";
import { CodeBlock } from "../components/ui/CodeBlock";

function buildNpmSnippet(dsn: string, token?: string): string {
  const tokenLine = token ? `\n  token: "${token}",` : "";
  return `// npm install @myna-edge/sdk
import { initMyna } from "@myna-edge/sdk";

initMyna({
  dsn: "${dsn}",${tokenLine}
  release: "1.0.0",
  environment: "production",
});`;
}

function buildHtmlSnippet(dsn: string, token?: string): string {
  const tokenLine = token ? `\n    token: "${token}",` : "";
  return `<script src="https://cdn.jsdelivr.net/npm/@myna-edge/sdk/dist/myna.global.js"></script>
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
  const token = apiSecret() || undefined;

  return (
    <div className="page">
      <PageIntro title="接入指南" desc="三步完成：复制 DSN → 初始化 SDK → 触发一次测试错误。" />

      <p className="guide-step-label muted">1. 复制 DSN</p>
      <DsnCard dsn={dsn} needsToken={Boolean(token)} />

      <p className="guide-step-label muted">2. 初始化 SDK（任选一种）</p>
      <CopyBlock title="npm 项目" language="javascript" code={buildNpmSnippet(dsn, token)} />
      <CopyBlock
        title="纯 HTML 页面"
        language="html"
        code={buildHtmlSnippet(dsn, token)}
        note={
          <>
            脚本地址也可换成{" "}
            <a
              className="guide-link"
              href="https://unpkg.com/@myna-edge/sdk/dist/myna.global.js"
              target="_blank"
              rel="noreferrer"
            >
              unpkg
            </a>
            。若要自托管，下载{" "}
            <a
              className="guide-link"
              href="https://cdn.jsdelivr.net/npm/@myna-edge/sdk/dist/myna.global.js"
              target="_blank"
              rel="noreferrer"
            >
              myna.global.js
            </a>
            {" "}
            （
            <a
              className="guide-link"
              href="https://unpkg.com/@myna-edge/sdk/dist/myna.global.js"
              target="_blank"
              rel="noreferrer"
            >
              unpkg
            </a>
            ）放到站点目录，例如{" "}
            <code className="mono">/js/myna.global.js</code>。
          </>
        }
      />

      <p className="guide-step-label muted">3. 验证是否接入成功</p>
      <section className="card">
        <h2 className="card-title">测试代码</h2>
        <ol className="steps">
          <li>在应用入口执行上方任一初始化代码。</li>
          <li>在已接入的页面运行下方测试代码。</li>
          <li>
            打开 <Link to="/issues">问题列表</Link>，确认是否出现该错误。
          </li>
        </ol>
        <CodeBlock code={TEST_SNIPPET} language="javascript" copyable />
      </section>
    </div>
  );
}
