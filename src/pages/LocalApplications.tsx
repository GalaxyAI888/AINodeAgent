import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Terminal, RefreshCw, Monitor, Settings, Play, Pause
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const localApplications = [
  {
    id: 'l1',
    name: 'Stable Diffusion WebUI',
    model: 'Stable Diffusion 3',
    status: '运行中',
    uptime: '2天4小时',
    gpuUsage: '65%',
    memoryUsage: '12.8/24 GB',
    port: '7860',
    url: 'http://localhost:7860'
  },
  {
    id: 'l2',
    name: 'Ollama',
    model: 'LLaMA 3 8B',
    status: '已停止',
    uptime: '0',
    gpuUsage: '0%',
    memoryUsage: '0/24 GB',
    port: '11434',
    url: 'http://localhost:11434'
  },
  {
    id: 'l3',
    name: 'Whisper Server',
    model: 'Whisper Large V3',
    status: '运行中',
    uptime: '5天12小时',
    gpuUsage: '15%',
    memoryUsage: '3.2/24 GB',
    port: '9000',
    url: 'http://localhost:9000'
  }
];

export default function LocalApplications() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleToggleAppStatus = (appId: string) => {
    const app = localApplications.find(a => a.id === appId);
    if (app) {
      const newStatus = app.status === '运行中' ? '已停止' : '运行中';
      toast.success(`${app.name} 已${newStatus === '运行中' ? '启动' : '停止'}`);
    }
  };

  const handleRefreshAppStatus = (appId: string) => {
    toast.info('正在刷新应用状态...');
  };

  const handleBuildImage = () => {
    navigate('/ai-image-management');
  };

  const LocalApplicationsContent = () => (
    <>
      {/* 本地应用管理 */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">本地AI应用管理</h2>
          <p className="mt-1 text-slate-400">管理已部署的AI应用和服务</p>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-800">
            <h3 className="text-lg font-medium">本地应用列表</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">应用名称</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">使用模型</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">状态</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">GPU使用率</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">显存占用</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">端口</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {localApplications.map((app) => (
                  <tr key={app.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-4 pr-6 text-sm">{app.name}</td>
                    <td className="py-4 pr-6 text-sm">{app.model}</td>
                    <td className="py-4 pr-6">
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        app.status === '运行中' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-sm">{app.gpuUsage}</td>
                    <td className="py-4 pr-6 text-sm">{app.memoryUsage}</td>
                    <td className="py-4 pr-6 text-sm">{app.port}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleAppStatus(app.id)}
                          className={`rounded-lg border px-3 py-1 text-xs transition-colors ${
                            app.status === '运行中' 
                              ? 'border-red-500 text-red-400 hover:bg-red-500/20' 
                              : 'border-green-500 text-green-400 hover:bg-green-500/20'
                          }`}
                        >
                          {app.status === '运行中' ? '停止' : '启动'}
                        </button>
                        <button 
                          onClick={() => handleRefreshAppStatus(app.id)}
                          className="p-1 rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <a 
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-1 rounded-lg transition-colors ${
                            app.status === '运行中' 
                              ? 'text-indigo-400 hover:bg-indigo-500/20' 
                              : 'text-slate-600 cursor-not-allowed'
                          }`}
                          disabled={app.status !== '运行中'}
                        >
                          <Monitor size={14} />
                        </a>
                        <button className="p-1 rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white">
                          <Settings size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* 右侧工具栏 */}
      <div className="mt-6 flex justify-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索应用..."
            className="w-48 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        
        <button 
          onClick={handleBuildImage}
          className="ml-2 rounded-lg border border-indigo-500 bg-indigo-500/20 px-4 py-2 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300"
        >
           <Terminal size={16} className="mr-1 inline" /> 管理本地应用镜像
        </button>
      </div>
    </>
  );

  return (
    <Layout activeRoute="/local-applications">
      <LocalApplicationsContent />
    </Layout>
  );
}