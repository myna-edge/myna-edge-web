/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_MYNA_INGEST_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
