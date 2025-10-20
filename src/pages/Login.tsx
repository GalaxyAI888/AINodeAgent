import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('请输入用户名和密码');
      return;
    }
    
    setLoading(true);
    try {
      const success = await login(formData.username, formData.password);
      if (success) {
        toast.success('登录成功');
        navigate('/dashboard');
      } else {
        toast.error('用户名或密码错误');
      }
    } catch (error) {
      toast.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/60 p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600">
            <i className="fa-solid fa-microchip text-2xl text-white"></i>
          </div>
          <h1 className="text-2xl font-bold text-white">AI大模型客户端</h1>
          <p className="mt-2 text-sm text-slate-400">登录您的账户</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-slate-300">用户名</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                <i className="fa-solid fa-user"></i>
              </span>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-3 pl-10 pr-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="请输入用户名"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">密码</label>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-3 pl-10 pr-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="请输入密码"
              />
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={cn(
              "w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-white transition-all duration-200",
              loading ? "opacity-80" : "hover:shadow-lg hover:shadow-indigo-500/20"
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>登录中...</span>
              </div>
            ) : (
              "登录"
            )}
          </motion.button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            首次使用？<span className="text-indigo-400 cursor-pointer hover:underline">注册账户</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}