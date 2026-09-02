# 部署 Web 到 Cloudflare Pages

推荐方式：**GitHub 连接 Cloudflare Pages**，在网页上配置构建环境变量。  
`VITE_*` 在**构建时**写入静态资源，不要把含真实地址/token 的 `.env.production` 提交进仓库。

Deploy to Cloudflare 按钮**不支持 Pages**（仅 Workers）；Web 请用本页的 Pages 流程。

## 1. 先部署 API

拿到 Worker 地址，例如：`https://myna-edge-api.<子域>.workers.dev`  
（见 [myna-edge-api 部署说明](https://github.com/myna-edge/myna-edge-api/blob/main/docs/deploy.md)）

## 2. 用 GitHub 连接 Pages

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 选择仓库 `myna-edge-web`
3. 构建设置（需要填）：
   - **Framework preset**：`Vite`（选 None 也可以，只要下面两项正确）
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
4. **Environment variables**（Production，构建时可用）：

| 变量 | 是否必须 | 说明 |
|------|----------|------|
| `VITE_API_BASE` | **必填** | API Worker 地址，如 `https://myna-edge-api.<子域>.workers.dev` |
| `VITE_MYNA_INGEST_TOKEN` | 可选 | API 启用了 ingest token 时，可预填接入页 |
| `VITE_MYNA_ADMIN_TOKEN` | 可选 | API 启用了 `MYNA_ADMIN_TOKEN` 时，Webhook 写入需要 |

5. 保存并部署。之后 push `main` 会自动重新构建。

`npm run build` 会校验 `VITE_API_BASE`：既可读本地 `.env.production`，也能读 Pages 注入的环境变量。

### 改完环境变量要不要 Rebuild？

要。`VITE_*` 在构建期打进静态文件，改 Pages 环境变量后必须 **重新部署 / Retry deployment**，页面才会用上新值。

## 推荐顺序（端到端）

1. [myna-edge-api](https://github.com/myna-edge/myna-edge-api)（Worker + D1）
2. 本仓库 Pages（填 `VITE_API_BASE`）
3. [myna-edge-sdk](https://github.com/myna-edge/myna-edge-sdk) 上报到 `https://<api>/api/ingest`

## 可选：本地 CLI 部署

本地部署不是必需步骤：

```powershell
copy .env.production.example .env.production
# 编辑 VITE_API_BASE
npm run deploy
```
