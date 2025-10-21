import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative h-32 w-32 mb-8"
        >
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-indigo-300 border-l-transparent"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600">
            <i className="fa-solid fa-microchip text-3xl text-white"></i>
          </div>
        </motion.div>
        
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          AI大模型客户端
        </h1>
        
        <p className="text-center text-slate-400">
          利用本地算力使用AIGC能力，加入算力网络获取收益
        </p>
        
        {isLoading && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              ></motion.div>
            </div>
            <p className="text-sm text-slate-500">加载中...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}