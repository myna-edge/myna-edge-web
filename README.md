# myna-edge-web

Myna 错误监控控制台（React + Vite），部署到 Cloudflare Pages。

## 开发

```powershell
npm install
npm run dev
```

开发服务器默认 `http://127.0.0.1:43127`（`host: true` 时也可通过局域网 IP 访问）。复制 `.env.development.example` 为 `.env.development` 并设置 `VITE_API_BASE`（指向本机或局域网 API，如 `http://192.168.x.x:8787`）。请先启动 [myna-edge-api](https://github.com/myna-edge/myna-edge-api)。

## 部署（推荐）

1. 先部署 [myna-edge-api](https://github.com/myna-edge/myna-edge-api)，拿到 Worker URL
2. Cloudflare Pages **Connect to Git** 连接本仓库
3. 填写构建设置：
   - Framework preset：`Vite`（或 None）
   - Build command：`npm run build`
   - Build output directory：`dist`
4. Environment variables 至少配置 **`VITE_API_BASE`**（API 未开 token 时不必配其它变量）
5. 改过 `VITE_*` 后需重新部署，构建期才会写入静态资源

**不必**把生产环境变量提交进 Git。详见 [docs/deploy.md](./docs/deploy.md)。
