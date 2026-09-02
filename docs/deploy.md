# 部署 Web 到 Cloudflare Pages

`VITE_*` 在**构建时**写入静态资源，部署前必须配置。

## 步骤

```powershell
copy .env.production.example .env.production
```

编辑 `.env.production`：

```env
VITE_API_BASE=https://myna-api.<子域>.workers.dev
VITE_MYNA_INGEST_TOKEN=   # 若 API 启用了 MYNA_INGEST_TOKEN，可预填接入页
```

```powershell
npm run deploy
```

`npm run build` 会检查 `VITE_API_BASE` 是否已填写。

## Cloudflare Pages（Git 连接）

- **构建命令**：`npm run build`
- **输出目录**：`dist`
- **环境变量**：在 Pages 项目设置中添加 `VITE_API_BASE`（及可选的 `VITE_MYNA_INGEST_TOKEN`）
