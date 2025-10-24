import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: string;
}

export default function Layout({ children, activeRoute }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const handleNavClick = (route: string) => {
    navigate(route);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('已成功退出登录');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900 text-slate-100">
      {/* 顶部导航栏 */}
      <header className="z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <h1 className="text-xl font-bold">AI大模型客户端</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
            <Settings size={20} />
          </button>
          
          <div className="relative group">
            <button className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-slate-400" />
              )}
              <span>{user?.username}</span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            
            <div className="absolute right-0 mt-1 hidden w-48 origin-top-right rounded-lg border border-slate-700 bg-slate-800 shadow-lg group-hover:block">
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  <LogOut size={16} />
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* 侧边栏 */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onNavClick={handleNavClick} 
          activeRoute={activeRoute} 
        />
        
          {/* 主内容区 - 修复布局问题，确保内容正确显示 */}
          <main className={`flex-1 overflow-auto p-6 transition-all duration-300 ${sidebarOpen ? 'ml-[240px]' : 'ml-0'}`}>
            {children}
          </main>
      </div>
    </div>
  );
}