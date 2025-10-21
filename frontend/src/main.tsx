import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

// 为Electron环境设置基本路径
const setBaseUrl = () => {
  // 检查是否在Electron环境中
  if (window.process && window.process.type === 'renderer') {
    const baseUrl = document.createElement('base');
    baseUrl.href = './';
    document.head.appendChild(baseUrl);
  }
};

setBaseUrl();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
