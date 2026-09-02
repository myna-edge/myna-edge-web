# myna-edge-web

Myna 错误监控控制台（React + Vite），部署到 Cloudflare Pages。

## 开发

```powershell
npm install
npm run dev
```

开发服务器 `http://127.0.0.1:43127`，`/api` 代理到本地 API（`:8787`）。请先启动 [myna-edge-api](../myna-edge-api)。

## 部署

```powershell
copy .env.production.example .env.production
# 编辑 VITE_API_BASE 为 Worker 地址
npm run deploy
```

详见 [docs/deploy.md](./docs/deploy.md)。
