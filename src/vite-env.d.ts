/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_MYNA_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
