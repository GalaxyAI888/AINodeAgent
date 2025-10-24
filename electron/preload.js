// 预加载脚本，用于在渲染进程和主进程之间建立通信桥梁
const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露安全的API
contextBridge.exposeInMainWorld('electron', {
  // 系统对话框
  showErrorDialog: (message) => ipcRenderer.send('show-error-dialog', message),
  showInfoDialog: (message) => ipcRenderer.send('show-info-dialog', message),
  
  // 可以根据需要添加更多的API
  // 例如文件操作、系统信息获取等
});

// 可以在这里添加更多的IPC监听器
ipcRenderer.on('fromMain', (event, data) => {
  console.log('从主进程收到的消息:', data);
});