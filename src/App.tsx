import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Resources from "@/pages/Resources";
import Tasks from "@/pages/Tasks";
import Cluster from "@/pages/Cluster";
import Wallet from "@/pages/Wallet";
import Logs from "@/pages/Logs";
import ModelMarket from "@/pages/ModelMarket";
import ApplicationMarket from "@/pages/ApplicationMarket";
import AccountSettings from "@/pages/AccountSettings";
import NodeSettings from "@/pages/NodeSettings";
import NetworkSettings from "@/pages/NetworkSettings";
import LocalApplications from "@/pages/LocalApplications";
import AIImageManagement from "@/pages/AIImageManagement";
import LocalModels from "@/pages/LocalModels";
import { AuthContext, User } from '@/contexts/authContext';
import PrivateRoute from '@/components/PrivateRoute';
import Layout from '@/components/Layout';

// 实现AuthProvider组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 在实际应用中，这里会连接到后端API
  // 目前使用mock数据和本地存储实现基本功能
  
  const getInitialAuthState = (): { isAuthenticated: boolean; user: User | null } => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth);
      } catch {
        return { isAuthenticated: false, user: null };
      }
    }
    return { isAuthenticated: false, user: null };
  };
  
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState().isAuthenticated);
  const [user, setUser] = useState<User | null>(getInitialAuthState().user);
  
  // 保存认证状态到本地存储
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated, user }));
  }, [isAuthenticated, user]);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock登录逻辑
    // 实际应用中应该调用API验证凭据
    if (username && password) {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 设置模拟用户数据
      const mockUser: User = {
        id: '1',
        username: username,
        balance: 100,
        computePoints: 500,
        web3Address: '0x1234567890abcdef1234567890abcdef12345678',
        avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20profile%20picture&sign=a47ca4238b884af3e5f2e2dfbbcc7eb9'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* 受保护的路由 - 所有页面都应该使用Layout组件正确渲染 */}
        <Route element={<PrivateRoute />}>
          {/* 直接使用带有Layout的页面组件 */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/cluster" element={<Cluster />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/model-market" element={<ModelMarket />} />
          <Route path="/application-market" element={<ApplicationMarket />} />
          <Route path="/local-applications" element={<LocalApplications />} />
          <Route path="/ai-image-management" element={<AIImageManagement />} />
          <Route path="/local-models" element={<LocalModels />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/node-settings" element={<NodeSettings />} />
          <Route path="/network-settings" element={<NetworkSettings />} />
        </Route>
        
        <Route path="*" element={<div className="flex h-screen w-screen items-center justify-center text-2xl text-slate-400">404 - 页面不存在</div>} />
      </Routes>
    </AuthProvider>
  );
}
