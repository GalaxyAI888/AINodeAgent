interface ImportMetaEnv {
  // 基础的base url
  readonly VITE_BASE_API_URL: string

  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

