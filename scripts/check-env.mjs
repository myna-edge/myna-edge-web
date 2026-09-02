import { loadEnv } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(root, "..");
const env = loadEnv("production", webRoot, "");

if (!env.VITE_API_BASE?.trim()) {
  console.error(`
[myna] 缺少 VITE_API_BASE，生产构建无法继续。

请复制并编辑配置文件：
  .env.production.example  →  .env.production

示例：
  VITE_API_BASE=https://myna-api.<你的子域>.workers.dev

然后重新执行：npm run deploy:web
`);
  process.exit(1);
}
