import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Terminal, RefreshCw, Play, 
  Copy, Share2, Trash
} from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock本地镜像数据
const localImages = [
  {
    id: 'i1',
    name: 'ghcr.io/AUTOMATIC1111/stable-diffusion-webui',
    tag: 'latest',
    size: '4.2 GB',
    created: '2025-10-17 10:30:00',
    status: '可用',
    usedBy: 'Stable Diffusion WebUI',
    layers: 12
  },
  {
    id: 'i2',
    name: 'ollama/ollama',
    tag: 'latest',
    size: '3.5 GB',
    created: '2025-10-16 15:45:00',
    status: '可用',
    usedBy: 'Ollama',
    layers: 8
  },
  {
    id: 'i3',
    name: 'bentoml/bento-server',
    tag: '1.0',
    size: '1.8 GB',
    created: '2025-10-15 09:20:00',
    status: '未使用',
    usedBy: '-',
    layers: 6
  },
  {
    id: 'i4',
    name: 'ghcr.io/xinntao/real-esrgan-ncnn-vulkan',
    tag: 'latest',
    size: '2.1 GB',
    created: '2025-10-14 16:10:00',
    status: '未使用',
    usedBy: '-',
    layers: 7
  }
];

export default function AIImageManagement() {
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const handleDeleteImage = (imageId: string) => {
    const image = localImages.find(img => img.id === imageId);
    if (image && image.usedBy === '-') {
      toast.success(`已删除镜像: ${image.name}`);
    } else {
      toast.error('正在使用的镜像无法删除');
    }
  };

  const handleRunContainer = (image: any) => {
    toast.info(`使用镜像 ${image.name} 启动容器`);
  };

  const handleSortImages = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedImages = [...localImages].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortField as keyof typeof a] > b[sortField as keyof typeof b] ? 1 : -1;
    } else {
      return a[sortField as keyof typeof a] < b[sortField as keyof typeof b] ? 1 : -1;
    }
  });

  const AIImageManagementContent = () => (
    <>
      {/* AI应用镜像模块 */}
      <div className="mb-8">
        <div className="mb-6">
           <h2 className="text-2xl font-bold">本地AI应用镜像</h2>
          <p className="mt-1 text-slate-400">管理本地已下载的应用镜像</p>
        </div>
        
        {/* 搜索和工具栏 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={imageSearchQuery}
              onChange={(e) => setImageSearchQuery(e.target.value)}
              placeholder="搜索镜像..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
              <RefreshCw size={16} />
              <span>刷新</span>
            </button>
          </div>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">镜像名称</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">标签</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">大小</th>
                  <th 
                    className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400 cursor-pointer"
                    onClick={() => handleSortImages('created')}
                  >
                    <div className="flex items-center gap-1">
                      创建时间
                      {sortField === 'created' && (
                        <i className={`fa-solid fa-chevron-${sortOrder === 'asc' ? 'up' : 'down'} text-xs`}></i>
                      )}
                    </div>
                  </th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">状态</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">使用应用</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {sortedImages.map((image) => (
                  <tr key={image.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-4 pr-6 text-sm font-mono max-w-xs truncate">
                      {image.name}
                    </td>
                    <td className="py-4 pr-6 text-sm">
                      <span className="rounded-full border border-slate-700 px-2 py-1 text-xs">
                        {image.tag}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-sm">{image.size}</td>
                    <td className="py-4 pr-6 text-sm text-slate-400">{image.created}</td>
                    <td className="py-4 pr-6">
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        image.status === '可用' ? 'bg-green-500/20 text-green-400' :
                        image.status === '未使用' ? 'bg-slate-500/20 text-slate-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {image.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-sm">{image.usedBy}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        {image.usedBy === '-' ? (
                          <button 
                            onClick={() => handleRunContainer(image)}
                            className="rounded-lg border border-indigo-500 text-indigo-400 px-3 py-1 text-xs transition-colors hover:bg-indigo-500/20"
                          >
                            <Play size={14} className="mr-1 inline" /> 运行
                          </button>
                        ) : (
                          <button disabled className="rounded-lg border border-slate-700 text-slate-600 px-3 py-1 text-xs cursor-not-allowed">
                            <Play size={14} className="mr-1 inline" /> 运行中
                          </button>
                        )}
                        <button className="p-1 rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white">
                          <Copy size={14} />
                        </button>
                        <button className="p-1 rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white">
                          <Share2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteImage(image.id)}
                          disabled={image.usedBy !== '-'}
                          className={`p-1 rounded-lg transition-colors ${
                            image.usedBy !== '-' 
                              ? 'text-slate-600 cursor-not-allowed' 
                              : 'text-slate-400 hover:bg-red-500/20 hover:text-red-400'
                          }`}
                        >
                          <Trash size={14} />
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
      
      {/* 镜像构建功能 */}
      <div className="mb-8">
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">应用镜像构建</h3>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Dockerfile 路径或URL</label>
              <input
                type="text"
                placeholder="输入本地Dockerfile路径或远程URL"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-slate-300 mb-2">镜像名称</label>
              <input
                type="text"
                placeholder="输入镜像名称"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <button 
            onClick={() => toast.info('开始构建自定义镜像')}
            className="rounded-lg border border-indigo-500 bg-indigo-500/20 px-6 py-2 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300"
          >
            <Terminal size={16} className="mr-1 inline" /> 构建镜像
          </button>
        </div>
      </div>
    </>
  );

  return (
    <Layout activeRoute="/ai-image-management">
      <AIImageManagementContent />
    </Layout>
  );
}