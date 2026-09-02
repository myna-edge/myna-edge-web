import type { ClientContext, EventRow } from "../../api";
import type { MetaRow } from "./issueMeta";

export type ClientSection = {
  title: string;
  rows: MetaRow[];
};

function formatBytes(bytes?: number): string | null {
  if (bytes == null || Number.isNaN(bytes)) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMs(ms?: number): string | null {
  if (ms == null || Number.isNaN(ms) || ms <= 0) return null;
  return `${ms} ms`;
}

function row(label: string, value: string | null | undefined, opts?: Partial<MetaRow>): MetaRow | null {
  if (value == null || value === "") return null;
  return { label, value, ...opts };
}

function boolLabel(value?: boolean): string | null {
  if (value === undefined) return null;
  return value ? "是" : "否";
}

function parseBrowserFromUa(ua: string | null | undefined): { name?: string; version?: string } {
  if (!ua) return {};
  if (ua.includes("Edg/")) {
    const m = ua.match(/Edg\/([\d.]+)/);
    return { name: "Edge", version: m?.[1] };
  }
  if (ua.includes("Firefox/")) {
    const m = ua.match(/Firefox\/([\d.]+)/);
    return { name: "Firefox", version: m?.[1] };
  }
  if (ua.includes("Chrome/")) {
    const m = ua.match(/Chrome\/([\d.]+)/);
    return { name: "Chrome", version: m?.[1] };
  }
  if (ua.includes("Safari/") && ua.includes("Version/")) {
    const m = ua.match(/Version\/([\d.]+)/);
    return { name: "Safari", version: m?.[1] };
  }
  return {};
}

function resolveIp(event: EventRow): string | undefined {
  return event.client_ip ?? event.client?.request?.ip ?? undefined;
}

export function hasClientInfo(event: EventRow | null | undefined): boolean {
  if (!event) return false;
  if (event.client) return true;
  return !!(event.user_agent || event.url || event.client_ip);
}

export function clientSections(event: EventRow): ClientSection[] {
  const c = event.client;
  const uaFallback = parseBrowserFromUa(event.user_agent);
  const browserName = c?.browser?.name ?? uaFallback.name;
  const browserVersion = c?.browser?.version ?? uaFallback.version;
  const sections: ClientSection[] = [];

  const req = c?.request;
  const requestRows = [
    row("IP", resolveIp(event), { mono: true }),
    row("X-Forwarded-For", req?.forwardedFor, { mono: true }),
    row("X-Real-IP", req?.realIp, { mono: true }),
    row("Host", req?.host, { mono: true }),
    row("Origin", req?.origin, { mono: true }),
    row("Referer", req?.referer, { mono: true, href: req?.referer }),
    row("Accept-Language", req?.acceptLanguage, { mono: true }),
    row("Accept-Encoding", req?.acceptEncoding, { mono: true }),
    row("Method", req?.method, { mono: true }),
    ...(req?.cf
      ? Object.entries(req.cf).map(([key, value]) =>
          row(`CF ${key}`, value, { mono: true }),
        )
      : []),
  ].filter(Boolean) as MetaRow[];
  if (requestRows.length > 0) sections.push({ title: "请求", rows: requestRows });

  const browserRows = [
    row("浏览器", browserName && browserVersion ? `${browserName} ${browserVersion}` : browserName),
    row(
      "Chromium 品牌",
      c?.browser?.brands?.length
        ? c.browser.brands.map((b) => `${b.brand} ${b.version}`).join(", ")
        : null,
    ),
    row("UA 平台", c?.browser?.platform),
    row("移动设备", boolLabel(c?.browser?.mobile)),
    row("语言", c?.browser?.language),
    row(
      "语言列表",
      c?.browser?.languages?.length ? c.browser.languages.join(", ") : null,
    ),
    row("Cookie", boolLabel(c?.browser?.cookieEnabled)),
    row("在线", boolLabel(c?.browser?.onLine)),
    row("WebDriver", boolLabel(c?.browser?.webdriver)),
    row("PDF 插件", boolLabel(c?.browser?.pdfViewerEnabled)),
    row("DNT", c?.browser?.doNotTrack ?? undefined),
    row("User-Agent", c?.browser?.userAgent ?? event.user_agent ?? undefined, { mono: true }),
  ].filter(Boolean) as MetaRow[];
  if (browserRows.length > 0) sections.push({ title: "浏览器", rows: browserRows });

  const network = c?.network;
  const networkRows = [
    row("有效类型", network?.effectiveType),
    row("连接类型", network?.type),
    row("下行 (Mbps)", network?.downlink?.toString()),
    row("RTT (ms)", network?.rtt?.toString()),
    row("省流模式", boolLabel(network?.saveData)),
  ].filter(Boolean) as MetaRow[];
  if (networkRows.length > 0) sections.push({ title: "网络", rows: networkRows });

  const osRows = [
    row("平台", c?.os?.platform),
    row("UA 数据平台", c?.os?.userAgentPlatform),
  ].filter(Boolean) as MetaRow[];
  if (osRows.length > 0) sections.push({ title: "系统", rows: osRows });

  const deviceRows = [
    row("厂商", c?.device?.vendor),
    row("CPU 核心", c?.device?.hardwareConcurrency?.toString()),
    row("内存 (GB)", c?.device?.deviceMemory?.toString()),
    row("触控点数", c?.device?.maxTouchPoints?.toString()),
  ].filter(Boolean) as MetaRow[];
  if (deviceRows.length > 0) sections.push({ title: "设备", rows: deviceRows });

  const screen = c?.screen;
  const viewport = c?.viewport;
  const displayRows = [
    row(
      "屏幕",
      screen?.width != null && screen?.height != null
        ? `${screen.width} × ${screen.height}`
        : null,
    ),
    row(
      "可用区域",
      screen?.availWidth != null && screen?.availHeight != null
        ? `${screen.availWidth} × ${screen.availHeight}`
        : null,
    ),
    row(
      "视口",
      viewport?.width != null && viewport?.height != null
        ? `${viewport.width} × ${viewport.height}`
        : null,
    ),
    row(
      "窗口外框",
      viewport?.outerWidth != null && viewport?.outerHeight != null
        ? `${viewport.outerWidth} × ${viewport.outerHeight}`
        : null,
    ),
    row(
      "滚动位置",
      viewport?.scrollX != null && viewport?.scrollY != null
        ? `${Math.round(viewport.scrollX)}, ${Math.round(viewport.scrollY)}`
        : null,
    ),
    row("色深", screen?.colorDepth != null ? `${screen.colorDepth} bit` : null),
    row("像素比", screen?.pixelRatio?.toString()),
    row(
      "屏幕方向",
      screen?.orientation?.type
        ? `${screen.orientation.type}${screen.orientation.angle != null ? ` (${screen.orientation.angle}°)` : ""}`
        : null,
    ),
  ].filter(Boolean) as MetaRow[];
  if (displayRows.length > 0) sections.push({ title: "显示", rows: displayRows });

  const page = c?.page;
  const pageRows = [
    row("标题", page?.title),
    row("URL", page?.url ?? event.url ?? undefined, { mono: true, href: page?.url ?? event.url ?? undefined }),
    row("路径", page?.path, { mono: true }),
    row("查询", page?.search, { mono: true }),
    row("Hash", page?.hash, { mono: true }),
    row("Referrer", page?.referrer, { mono: true, href: page?.referrer }),
    row("可见性", page?.visibilityState),
    row("页面隐藏", boolLabel(page?.hidden)),
    row("就绪状态", page?.readyState),
    row("字符集", page?.characterSet),
    row("兼容模式", page?.compatMode),
    row("文档语言", page?.lang),
    row("文档方向", page?.dir),
    row("History 长度", page?.historyLength?.toString()),
  ].filter(Boolean) as MetaRow[];
  if (pageRows.length > 0) sections.push({ title: "页面", rows: pageRows });

  const perf = c?.performance;
  const perfRows = [
    row("导航类型", perf?.navigation?.type),
    row("重定向次数", perf?.navigation?.redirectCount?.toString()),
    row("DOM Interactive", formatMs(perf?.navigation?.domInteractive)),
    row("DOM ContentLoaded", formatMs(perf?.navigation?.domContentLoaded)),
    row("Load", formatMs(perf?.navigation?.load)),
    row("传输体积", formatBytes(perf?.navigation?.transferSize)),
    row("编码体积", formatBytes(perf?.navigation?.encodedBodySize)),
    row("解码体积", formatBytes(perf?.navigation?.decodedBodySize)),
    row("JS 堆上限", formatBytes(perf?.memory?.jsHeapSizeLimit)),
    row("JS 堆总量", formatBytes(perf?.memory?.totalJSHeapSize)),
    row("JS 堆已用", formatBytes(perf?.memory?.usedJSHeapSize)),
    row("Time Origin", perf?.timeOrigin?.toString(), { mono: true }),
  ].filter(Boolean) as MetaRow[];
  if (perfRows.length > 0) sections.push({ title: "性能", rows: perfRows });

  const storage = c?.storage;
  if (storage) {
    const storageRows: MetaRow[] = [];
    const ls = storage.localStorage;
    if (ls) {
      if (ls.available) {
        storageRows.push(
          ...([
            row("localStorage 键数", ls.keys?.toString()),
            row("localStorage 体积", formatBytes(ls.bytes)),
            row(
              "localStorage 键名",
              ls.keyNames?.length ? ls.keyNames.join(", ") : ls.keys === 0 ? "（空）" : null,
              { mono: true },
            ),
          ].filter(Boolean) as MetaRow[]),
        );
      } else {
        storageRows.push(
          row("localStorage", ls.error ? `不可用（${ls.error}）` : "不可用")!,
        );
      }
    }

    const ss = storage.sessionStorage;
    if (ss) {
      if (ss.available) {
        storageRows.push(
          ...([
            row("sessionStorage 键数", ss.keys?.toString()),
            row("sessionStorage 体积", formatBytes(ss.bytes)),
            row(
              "sessionStorage 键名",
              ss.keyNames?.length ? ss.keyNames.join(", ") : ss.keys === 0 ? "（空）" : null,
              { mono: true },
            ),
          ].filter(Boolean) as MetaRow[]),
        );
      } else {
        storageRows.push(
          row("sessionStorage", ss.error ? `不可用（${ss.error}）` : "不可用")!,
        );
      }
    }

    const cookies = storage.cookies;
    if (cookies) {
      if (cookies.available) {
        storageRows.push(
          ...([
            row("Cookie 数量", cookies.count?.toString()),
            row("Cookie 体积", formatBytes(cookies.bytes)),
            row(
              "Cookie 名称",
              cookies.names?.length ? cookies.names.join(", ") : cookies.count === 0 ? "（空）" : null,
              { mono: true },
            ),
          ].filter(Boolean) as MetaRow[]),
        );
      } else {
        storageRows.push(row("Cookie", "不可用")!);
      }
    }

    if (storage.indexedDB) {
      storageRows.push(row("IndexedDB", storage.indexedDB.available ? "可用" : "不可用")!);
    }

    if (storageRows.length > 0) sections.push({ title: "Storage", rows: storageRows });
  }

  const localeRows = [
    row("时区", c?.timezone),
    row(
      "UTC 偏移",
      c?.timezoneOffset != null ? `${-c.timezoneOffset / 60}h` : null,
    ),
  ].filter(Boolean) as MetaRow[];
  if (localeRows.length > 0) sections.push({ title: "区域", rows: localeRows });

  if (sections.length === 0 && event.user_agent) {
    sections.push({
      title: "浏览器",
      rows: [row("User-Agent", event.user_agent, { mono: true })!],
    });
  }

  return sections;
}

export function browserLabel(event: EventRow): string | null {
  const c = event.client;
  if (c?.browser?.name) {
    return c.browser.version ? `${c.browser.name} ${c.browser.version}` : c.browser.name;
  }
  const parsed = parseBrowserFromUa(event.user_agent);
  if (parsed.name) {
    return parsed.version ? `${parsed.name} ${parsed.version}` : parsed.name;
  }
  return null;
}

export type { ClientContext };
