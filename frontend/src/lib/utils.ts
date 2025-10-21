import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 检查是否在Electron环境中运行
export const isElectron = () => {
  return window.process && window.process.type === 'renderer';
};

// 向Electron主进程发送消息的工具函数
export const sendToElectronMain = (channel: string, data?: any) => {
  if (isElectron() && window.electron) {
    try {
      if (channel === 'show-error-dialog' && window.electron.showErrorDialog) {
        window.electron.showErrorDialog(data);
      } else if (channel === 'show-info-dialog' && window.electron.showInfoDialog) {
        window.electron.showInfoDialog(data);
      }
    } catch (error) {
      console.error('Failed to send message to Electron main process:', error);
    }
  }
};
