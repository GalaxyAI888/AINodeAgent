import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';

// 解决ES模块中__dirname的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 避免多次打开窗口
let mainWindow: BrowserWindow | null = null;

// 创建主窗口
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'AI大模型客户端',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '../preload.js'),
    },
    show: false,
    frame: true,
    // 如果有图标，可以添加以下配置
    // icon: path.join(__dirname, '../../build/icon.ico')
  });

  // 加载应用
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../static/index.html')}`;

  mainWindow.loadURL(startUrl);

  // 当窗口加载完成后显示窗口
  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  // 窗口关闭时清理资源
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 开发模式下打开DevTools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

// 应用准备就绪后创建窗口
app.whenReady().then(() => {
  createWindow();
  
  // 处理macOS上的窗口行为
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 退出应用时的处理
app.on('window-all-closed', () => {
  // 在macOS上，应用及其菜单栏通常保持活动状态，直到用户明确退出
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 可以在这里添加更多的IPC通信处理
// 例如处理文件选择、系统通知等功能
ipcMain.on('show-error-dialog', (event, message) => {
  dialog.showErrorBox('错误', message);
});

ipcMain.on('show-info-dialog', (event, message) => {
  dialog.showMessageBox({
    type: 'info',
    title: '信息',
    message: message,
    buttons: ['确定']
  });
});