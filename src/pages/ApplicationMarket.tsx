import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Download, Upload, Settings, Code, X, Terminal, Package,
  ArrowLeft, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const cloudApplications = [
  {
    id: 'a1',
    name: 'Automatic1111 WebUI',
    type: '图像生成',
    description: '流行的Stable Diffusion Web界面，支持丰富的图像生成功能和插件',
    dockerImage: 'ghcr.io/AUTOMATIC1111/stable-diffusion-webui:latest',
    dockerfileUrl: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/master/Dockerfile',
    stars: '25.6k',
    pulls: '1.8M+'
  },
  {
    id: 'a2',
    name: 'VoxBox',
    type: '语音合成',
    description: '多功能语音合成工具箱，支持多种声音模型和语音处理',
    dockerImage: 'registry.cn-hangzhou.aliyuncs.com/silkcloud/voxbox:latest',
    dockerfileUrl: 'https://github.com/Winfredy/SadTalker/blob/main/docker/Dockerfile',
    stars: '12.3k',
    pulls: '750k+'
  },
  {
    id: 'a3',
    name: 'ComfyUI',
    type: '图像生成',
    description: '基于节点的Stable Diffusion界面，支持复杂工作流和自定义节点',
    dockerImage: 'ghcr.io/comfyanonymous/ComfyUI:latest',
    dockerfileUrl: 'https://github.com/comfyanonymous/ComfyUI/blob/master/Dockerfile',
    stars: '15.8k',
    pulls: '1.2M+'
  },
  {
    id: 'a4',
    name: 'Ollama',
    type: '本地LLM',
    description: '本地大语言模型运行框架，支持多种开源模型部署',
    dockerImage: 'ollama/ollama:latest',
    dockerfileUrl: 'https://github.com/ollama/ollama/blob/main/Dockerfile',
    stars: '32.5k',
    pulls: '5.2M+'
  },
  {
    id: 'a5',
    name: 'BentoML',
    type: '模型部署',
    description: '机器学习模型部署和服务框架，支持模型打包和API服务',
    dockerImage: 'bentoml/bento-server:latest',
    dockerfileUrl: 'https://github.com/bentoml/BentoML/blob/main/Dockerfile',
    stars: '8.7k',
    pulls: '620k+'
  },
  {
    id: 'a6',
    name: 'Upscaler',
    type: '图像增强',
    description: 'AI图像超分辨率工具，支持多种模型和批量处理',
    dockerImage: 'ghcr.io/xinntao/real-esrgan-ncnn-vulkan:latest',
    dockerfileUrl: 'https://github.com/xinntao/Real-ESRGAN/blob/master/Dockerfile',
    stars: '7.2k',
    pulls: '480k+'
  },
  // 添加更多应用数据以测试分页功能
  {
    id: 'a7',
    name: 'AudioCraft',
    type: '音频生成',
    description: '用于音频合成和音乐创作的AI工具',
    dockerImage: 'ghcr.io/facebookresearch/audiocraft:latest',
    dockerfileUrl: 'https://github.com/facebookresearch/audiocraft/blob/main/docker/Dockerfile',
    stars: '10.3k',
    pulls: '520k+'
  },
  {
    id: 'a8',
    name: 'LangServe',
    type: '模型部署',
    description: 'LangChain应用的服务部署框架',
    dockerImage: 'ghcr.io/langchain-ai/langserve:latest',
    dockerfileUrl: 'https://github.com/langchain-ai/langserve/blob/main/Dockerfile',
    stars: '6.8k',
    pulls: '380k+'
  },
  {
    id: 'a9',
    name: 'FaceSwap',
    type: '图像处理',
    description: 'AI人脸交换与编辑工具',
    dockerImage: 'ghcr.io/deepfakes/faceswap:latest',
    dockerfileUrl: 'https://github.com/deepfakes/faceswap/blob/master/Dockerfile',
    stars: '9.5k',
    pulls: '430k+'
  }
];

// 获取所有应用类型
const appTypes = ['全部', ...Array.from(new Set(cloudApplications.map(app => app.type)))];

export default function ApplicationMarket() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAppDetail, setShowAppDetail] = useState(false);
  const [selectedApp, setSelectedApp] = useState(cloudApplications[0]);
  const [showBuildModal, setShowBuildModal] = useState(false);
  const [buildMethod, setBuildMethod] = useState<'dockerfile' | 'dockerpull'>('dockerfile');
  const [selectedType, setSelectedType] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [appsPerPage] = useState(6);
  
  // 过滤应用
  const filteredApps = cloudApplications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === '全部' || app.type === selectedType;
    
    return matchesSearch && matchesType;
  });
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredApps.length / appsPerPage);
  const startIndex = (currentPage - 1) * appsPerPage;
  const endIndex = startIndex + appsPerPage;
  const paginatedApps = filteredApps.slice(startIndex, endIndex);
  
  const handleDeployApp = (app: any) => {
    setSelectedApp(app);
    setShowAppDetail(true);
    toast.info(`准备部署应用: ${app.name}`);
  };

  const handleBuildImage = (app: any) => {
    setSelectedApp(app);
    setShowBuildModal(true);
  };

  const handleConfirmBuild = () => {
    setShowBuildModal(false);
    if (buildMethod === 'dockerfile') {
      toast.success(`开始从Dockerfile构建镜像: ${selectedApp.name}`);
    } else {
      toast.success(`开始从Docker Hub拉取镜像: ${selectedApp.name}`);
    }
  };
  
  // 获取类型对应的颜色
  const getTypeColor = (type: string) => {
    switch(type) {
      case '图像生成': return 'pink';
      case '语音合成': return 'emerald';
      case '本地LLM': return 'indigo';
      case '模型部署': return 'blue';
      case '图像增强': return 'amber';
      case '音频生成': return 'purple';
      case '图像处理': return 'cyan';
      default: return 'slate';
    }
  };

  const ApplicationMarketContent = () => (
    <>
      {/* 应用市场概览 */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">云端AI应用市场</h2>
          <p className="mt-1 text-slate-400">浏览和部署预置的AI应用镜像</p>
        </div>
        
        {/* 应用类型筛选 */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">类型:</span>
            <div className="flex flex-wrap gap-2">
              {appTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setCurrentPage(1); // 重置为第一页
                  }}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    selectedType === type
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedApps.length > 0 ? (
            paginatedApps.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rounded-xl border border-slate-800 bg-slate-800/50 overflow-hidden shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">{app.name}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs bg-${getTypeColor(app.type)}-500/20 text-${getTypeColor(app.type)}-400`}>
                      {app.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{app.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">Docker镜像:</span>
                      <p className="font-mono text-xs truncate mt-1">{app.dockerImage}</p>
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">Dockerfile:</span>
                      <p className="font-mono text-xs truncate mt-1">{app.dockerfileUrl}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <i className="fa-solid fa-star text-amber-400"></i>
                      <span>{app.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={12} />
                      <span>{app.pulls}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleBuildImage(app)}
                    className="flex-1 rounded-lg bg-blue-500/20 px-3 py-2 text-sm text-blue-400 transition-colors hover:bg-blue-500/30 hover:text-blue-300"
                    >
             <Terminal size={16} className="mr-1 inline" /> 构建镜像
                    </button>
                    <button 
                      onClick={() => handleDeployApp(app)}
                      className="flex-1 rounded-lg bg-indigo-500/20 px-3 py-2 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300"
                    >
                      部署应用
                    </button>
                    <button className="p-2 rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white">
                      <Code size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400">
              暂无符合条件的应用
            </div>
          )}
        </div>
      </div>
      
      {/* 分页控件 */}
      {totalPages > 1 && paginatedApps.length > 0 && (
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`rounded-lg border p-2 text-sm transition-colors ${
                currentPage === 1
                  ? 'border-slate-800 text-slate-600'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // 显示当前页附近的页码
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    currentPage === pageNum
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`rounded-lg border p-2 text-sm transition-colors ${
                currentPage === totalPages
                  ? 'border-slate-800 text-slate-600'
                  : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      
      {/* 右侧工具栏 */}
      <div className="mt-6 flex justify-end gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // 重置为第一页
            }}
            placeholder="搜索应用..."
            className="w-48 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
            <Download size={16} />
            <span>导出</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
            <Upload size={16} />
            <span>导入</span>
          </button>
        </div>
      </div>
      
      {/* 构建镜像模态框 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showBuildModal ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 ${showBuildModal ? 'block' : 'hidden'}`}
        onClick={() => setShowBuildModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: showBuildModal ? 1 : 0.9, opacity: showBuildModal ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/95 p-6 shadow-xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">构建镜像</h3>
            <button 
              onClick={() => setShowBuildModal(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-4">应用名称</label>
            <input
              type="text"
              value={selectedApp?.name}
              disabled
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-4">构建方式</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="relative border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500/50 transition-colors">
                <input 
                  type="radio" 
                  name="buildMethod" 
                  value="dockerfile" 
                  checked={buildMethod === 'dockerfile'}
                  onChange={(e) => setBuildMethod(e.target.value as 'dockerfile')}
                  className="absolute opacity-0" 
                />
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    buildMethod === 'dockerfile' ? 'border-blue-500' : 'border-slate-600'
                  }`}>
                    {buildMethod === 'dockerfile' && (
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">从Dockerfile构建</h4>
                    <p className="text-xs text-slate-400 mt-1">使用应用提供的Dockerfile构建</p>
                  </div>
                </div>
              </label>
              
              <label className="relative border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500/50 transition-colors">
                <input 
                  type="radio" 
                  name="buildMethod" 
                  value="dockerpull" 
                  checked={buildMethod === 'dockerpull'}
                  onChange={(e) => setBuildMethod(e.target.value as 'dockerpull')}
                  className="absolute opacity-0" 
                />
                <div className="flex items-center gap-3">
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    buildMethod === 'dockerpull' ? 'border-blue-500' : 'border-slate-600'
                  }`}>
                    {buildMethod === 'dockerpull' && (
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">从Docker Hub拉取</h4>
                    <p className="text-xs text-slate-400 mt-1">直接下载预构建的Docker镜像</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          {buildMethod === 'dockerfile' && (
            <div className="mb-6">
              <label htmlFor="dockerfileUrl" className="block text-sm font-medium text-slate-300 mb-2">Dockerfile URL</label>
              <input
                type="text"
                id="dockerfileUrl"
                value={selectedApp?.dockerfileUrl}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}
          
          {buildMethod === 'dockerpull' && (
            <div className="mb-6">
              <label htmlFor="dockerImage" className="block text-sm font-medium text-slate-300 mb-2">Docker镜像</label>
              <input
                type="text"
                id="dockerImage"
                value={selectedApp?.dockerImage}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}
          
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => setShowBuildModal(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              取消
            </button>
            <button 
              onClick={handleConfirmBuild}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
            >
              <Package size={16} className="mr-1 inline" /> 开始构建
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );

  return (
    <Layout activeRoute="/application-market">
      <ApplicationMarketContent />
    </Layout>
  );
}