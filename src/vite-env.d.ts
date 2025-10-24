/// <reference types="vite/client" />

// 扩展全局对象以支持Electron环境
declare global {
  interface Window {
    process: {
      type: string;
    }
  }
}
