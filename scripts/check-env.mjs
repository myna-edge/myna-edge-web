import { loadEnv } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(root, "..");
const fileEnv = loadEnv("production", webRoot, "");
const apiBase = (process.env.VITE_API_BASE || fileEnv.VITE_API_BASE || "").trim();

if (!apiBase) {
  console.error(`
[myna] 缺少 VITE_API_BASE，生产构建无法继续。

推荐（Cloudflare Pages）：
  项目 Settings → Environment variables 添加
    VITE_API_BASE=https://myna-api.<你的子域>.workers.dev

可选（本地 CLI 部署）：
  复制 .env.production.example → .env.production 并填写同上变量
`);
  process.exit(1);
}
