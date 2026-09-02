export type ClientStorageSnapshot = {
  available: boolean;
  keys?: number;
  bytes?: number;
  keyNames?: string[];
  error?: string;
};

export type ClientContext = {
  browser?: {
    name?: string;
    version?: string;
    language?: string;
    languages?: string[];
    cookieEnabled?: boolean;
    onLine?: boolean;
    userAgent?: string;
    brands?: Array<{ brand: string; version: string }>;
    mobile?: boolean;
    platform?: string;
    webdriver?: boolean;
    pdfViewerEnabled?: boolean;
    doNotTrack?: string | null;
    productSub?: string;
    appVersion?: string;
    appCodeName?: string;
    appName?: string;
    [key: string]: unknown;
  };
  os?: {
    platform?: string;
    userAgentPlatform?: string;
  };
  device?: {
    vendor?: string;
    maxTouchPoints?: number;
    hardwareConcurrency?: number;
    deviceMemory?: number;
  };
  screen?: {
    width?: number;
    height?: number;
    availWidth?: number;
    availHeight?: number;
    colorDepth?: number;
    pixelRatio?: number;
    orientation?: { type?: string; angle?: number };
  };
  viewport?: {
    width?: number;
    height?: number;
    outerWidth?: number;
    outerHeight?: number;
    scrollX?: number;
    scrollY?: number;
  };
  page?: {
    url?: string;
    path?: string;
    hash?: string;
    search?: string;
    referrer?: string;
    title?: string;
    visibilityState?: string;
    hidden?: boolean;
    characterSet?: string;
    compatMode?: string;
    readyState?: string;
    lang?: string;
    dir?: string;
    historyLength?: number;
  };
  network?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
  };
  storage?: {
    localStorage?: ClientStorageSnapshot;
    sessionStorage?: ClientStorageSnapshot;
    cookies?: {
      available: boolean;
      count?: number;
      bytes?: number;
      names?: string[];
    };
    indexedDB?: { available: boolean };
  };
  performance?: {
    navigation?: {
      type?: string;
      redirectCount?: number;
      domInteractive?: number;
      domContentLoaded?: number;
      load?: number;
      transferSize?: number;
      encodedBodySize?: number;
      decodedBodySize?: number;
    };
    memory?: {
      jsHeapSizeLimit?: number;
      totalJSHeapSize?: number;
      usedJSHeapSize?: number;
    };
    timeOrigin?: number;
  };
  timezone?: string;
  timezoneOffset?: number;
  request?: {
    ip?: string;
    forwardedFor?: string;
    realIp?: string;
    acceptLanguage?: string;
    acceptEncoding?: string;
    referer?: string;
    origin?: string;
    host?: string;
    method?: string;
    cf?: Record<string, string>;
  };
};
