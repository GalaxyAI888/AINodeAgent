/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_AUTH_URL: string;
  readonly VITE_API_PASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}