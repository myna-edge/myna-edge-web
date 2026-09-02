# myna-edge-web

Myna 错误监控控制台（React + Vite），部署到 Cloudflare Pages。

## 开发

```powershell
npm install
npm run dev
```

开发服务器 `http://127.0.0.1:43127`，`/api` 代理到本地 API（`:8787`）。请先启动 [myna-edge-api](https://github.com/myna-edge/myna-edge-api)。

## 部署（推荐）

1. 先部署 [myna-edge-api](https://github.com/myna-edge/myna-edge-api)
2. Cloudflare Pages **Connect to Git** 连接本仓库
3. 构建命令 `npm run build`，输出目录 `dist`
4. 在 Pages **Environment variables** 中配置 `VITE_API_BASE`（及可选 token）

**不必**把生产环境变量提交进 Git。详见 [docs/deploy.md](./docs/deploy.md)。
