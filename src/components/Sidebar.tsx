import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Server, Cpu, Network, Briefcase, Wallet, FileText,
  Settings, HelpCircle, LogOut, Package, Globe, HardDrive
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onNavClick: (route: string) => void;
  activeRoute: string;
}

export default function Sidebar({ isOpen, onNavClick, activeRoute }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const navItems = [
    { icon: <Home size={20} />, title: "仪表盘", route: "/dashboard", isActive: activeRoute === "/dashboard" },
    { icon: <Server size={20} />, title: "资源管理", route: "/resources", isActive: activeRoute === "/resources" },
    { icon: <Network size={20} />, title: "集群管理", route: "/cluster", isActive: activeRoute === "/cluster" },
    { icon: <Package size={20} />, title: "云端模型市场", route: "/model-market", isActive: activeRoute === "/model-market" },
    { icon: <Globe size={20} />, title: "云端AI应用市场", route: "/application-market", isActive: activeRoute === "/application-market" },
    { icon: <HardDrive size={20} />, title: "本地AI应用管理", route: "/local-applications", isActive: activeRoute === "/local-applications" },
     { icon: <Package size={20} />, title: "本地AI应用镜像", route: "/ai-image-management", isActive: activeRoute === "/ai-image-management" },
    { icon: <HardDrive size={20} />, title: "本地AI模型管理", route: "/local-models", isActive: activeRoute === "/local-models" },
    { icon: <Briefcase size={20} />, title: "任务管理", route: "/tasks", isActive: activeRoute === "/tasks" },
    { icon: <Wallet size={20} />, title: "钱包充值", route: "/wallet", isActive: activeRoute === "/wallet" },
    { icon: <FileText size={20} />, title: "日志记录", route: "/logs", isActive: activeRoute === "/logs" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleExpand = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: isOpen ? 240 : 0, opacity: isOpen ? 1 : 0 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-slate-800 bg-slate-900/95 shadow-lg backdrop-blur-sm z-20 overflow-hidden`}
      >
        <div className={`h-full flex flex-col`}>
          {/* 用户信息 */}
          {isOpen && (
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img src={user.avatar} alt="User avatar" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-white font-medium">{user?.username?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-slate-400">算力积分: {user?.computePoints}</p>
                </div>
              </div>
            </div>
          )}

          {/* 导航菜单 */}
          <nav className="flex-1 p-2 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => onNavClick(item.route)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      item.isActive
                        ? "bg-indigo-500/20 text-indigo-400"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <span className={cn(
                      "h-5 w-5 flex-shrink-0",
                      item.isActive ? "text-indigo-400" : ""
                    )}>
                      {item.icon}
                    </span>
                    {isOpen && <span>{item.title}</span>}
                  </button>
                </li>
              ))}

              {/* 可展开菜单 */}
              <li>
                <button
                  onClick={() => toggleExpand('settings')}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={20} />
                    {isOpen && <span>设置</span>}
                  </div>
                  {isOpen && (
                    <motion.div
                      animate={{ rotate: expandedItem === 'settings' ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </motion.div>
                  )}
                </button>

                <AnimatePresence>
                  {expandedItem === 'settings' && isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 mt-1 overflow-hidden"
                    >
                        {/* 确保设置子菜单的路由链接正确 */}
                        {[
                          { name: '账号设置', route: '/account-settings' },
                          { name: '节点设置', route: '/node-settings' },
                          { name: '网络设置', route: '/network-settings' }
                        ].map((subItem, idx) => (
                         <li key={idx}>
                           <button
                             className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
                             onClick={() => onNavClick(subItem.route)}
                           >
                             {subItem.name}
                           </button>
                         </li>
                       ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </nav>

          {/* 底部菜单 */}
          {isOpen && (
            <div className="p-2 border-t border-slate-800">
              <ul className="space-y-1">
                <li>
                  <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
                    <HelpCircle size={20} />
                    <span>帮助与支持</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <LogOut size={20} />
                    <span>退出登录</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}