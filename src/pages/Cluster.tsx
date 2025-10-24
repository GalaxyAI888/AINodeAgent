import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, Zap, Database, Globe, Server, Users, Activity,
  Plus, X, ChevronDown, Download, Upload, Search, 
  Package, Terminal, Monitor, Play, Pause, RefreshCw, 
  Settings, Code, Link2, HardDrive
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const clusterStats = [
  { name: '总节点数', value: '1,254', icon: <Server size={20} />, color: 'indigo' },
  { name: '总GPU数', value: '3,872', icon: <Zap size={20} />, color: 'purple' },
  { name: '总算力', value: '12.5 PFLOPS', icon: <Activity size={20} />, color: 'emerald' },
  { name: '总存储', value: '256 TB', icon: <Database size={20} />, color: 'amber' },
];

const clusterList = [
  {
    id: '1',
    name: 'AI算力网络',
    description: '高性能AI计算集群，支持各种大模型训练和推理',
    status: '在线',
    nodes: 520,
    gpus: 1560,
    joinStatus: '已加入',
    '算力': '5.2 PFLOPS'
  },
  {
    id: '2',
    name: 'Parse 任务集群',
    description: '专注于分布式任务处理的集群，适合批处理任务',
    status: '在线',
    nodes: 380,
    gpus: 1140,
    joinStatus: '已加入',
    '算力': '3.8 PFLOPS'
  },
  {
    id: '3',
    name: 'Research 科研集群',
    description: '面向学术研究的专用集群，提供高优先级资源',
    status: '在线',
    nodes: 354,
    gpus: 1172,
    joinStatus: '未加入',
    '算力': '3.5 PFLOPS'
  }
];

// 云端模型市场数据
const cloudModels = [
  {
    id: 'm1',
    name: 'Stable Diffusion 3',
    type: '图像生成',
    description: '最先进的文本到图像生成模型，支持高质量图像生成',
    size: '8.9 GB',
    downloads: '125,400+',
    url: 'https://huggingface.co/stabilityai/stable-diffusion-3',
    popularity: 9.5
  },
  {
    id: 'm2',
    name: 'Flux 3',
    type: '图像生成',
    description: '新一代高保真图像生成模型，具有更强的细节表现能力',
    size: '12.3 GB',
    downloads: '89,200+',
    url: 'https://huggingface.co/black-forest-labs/FLUX.1-dev',
    popularity: 9.2
  },
  {
    id: 'm3',
    name: 'Whisper',
    type: '语音识别',
    description: '多语言语音识别模型，支持自动语音转文字',
    size: '2.8 GB',
    downloads: '320,500+',
    url: 'https://huggingface.co/openai/whisper-large-v3',
    popularity: 9.7
  },
  {
    id: 'm4',
    name: 'LLaMA 3',
    type: '大语言模型',
    description: '高性能开源大语言模型，支持多种任务和应用场景',
    size: '14.5 GB',
    downloads: '280,100+',
    url: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct',
    popularity: 9.6
  },
  {
    id: 'm5',
    name: 'Mixtral 8x7B',
    type: '大语言模型',
    description: '混合专家模型，具有更高的参数效率和性能',
    size: '22.4 GB',
    downloads: '195,800+',
    url: 'https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1',
    popularity: 9.4
  },
  {
    id: 'm6',
    name: 'Gemma',
    type: '大语言模型',
    description: '轻量级开源大语言模型，适合边缘设备部署',
    size: '5.2 GB',
    downloads: '120,300+',
    url: 'https://huggingface.co/google/gemma-7b-it',
    popularity: 9.0
  }
];

// 云端AI应用市场数据
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
  }
];

// 本地AI应用管理数据
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

export default function Cluster() {
  const navigate = useNavigate();
  const [selectedCluster, setSelectedCluster] = useState(clusterList[0]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [joinToken, setJoinToken] = useState('');
  
  const handleJoinCluster = () => {
    // 模拟加入集群
    if (joinToken) {
      toast.success(`成功加入集群: ${selectedCluster.name}`);
      setShowJoinModal(false);
      setJoinToken('');
    } else {
      toast.error('请输入有效的Token');
    }
  };
  
  const handleLeaveCluster = () => {
    // 模拟退出集群
    toast.success(`已退出集群: ${selectedCluster.name}`);
    setShowLeaveModal(false);
  };

  const ClusterContent = () => (
    <>
      {/* 集群概览 */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">算力网络概览</h2>
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
      
        {/* 集群统计卡片 */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clusterStats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm`}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400`}>
                {stat.icon}
              </div>
              <h3 className="mb-2 text-sm font-medium text-slate-400">{stat.name}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 集群列表和详情 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* 集群列表 */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 overflow-hidden shadow-sm lg:col-span-1">
          <div className="p-4 border-b border-slate-800 bg-slate-800">
            <h3 className="text-lg font-medium">可用集群</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {clusterList.map((cluster) => (
              <motion.div
                key={cluster.id}
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.3)' }}
                onClick={() => setSelectedCluster(cluster)}
                className={`p-4 cursor-pointer transition-colors ${selectedCluster.id === cluster.id ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{cluster.name}</h4>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    cluster.joinStatus === '已加入' ? 'bg-green-500/20 text-green-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {cluster.joinStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{cluster.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Server size={12} />
                    <span>{cluster.nodes} 节点</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Zap size={12} />
                    <span>{cluster.gpus} GPU</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* 集群详情 */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{selectedCluster?.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{selectedCluster?.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedCluster?.joinStatus === '已加入' ? (
                  <button 
                    onClick={() => setShowLeaveModal(true)}
                    className="rounded-lg border border-red-500 bg-red-500/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/30 hover:text-red-300"
                  >
                    退出集群
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowJoinModal(true)}
                    className="rounded-lg border border-green-500 bg-green-500/20 px-4 py-2 text-sm text-green-400 transition-colors hover:bg-green-500/30 hover:text-green-300"
                  >
                    加入集群
                  </button>
                )}
              </div>
            </div>
            
            {/* 集群关键指标 */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Server size={16} />
                  </div>
                  <span className="text-sm text-slate-400">节点数</span>
                </div>
                <p className="text-3xl font-bold">{selectedCluster?.nodes}</p>
              </div>
              
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Zap size={16} />
                  </div>
                  <span className="text-sm text-slate-400">GPU数</span>
                </div>
                <p className="text-3xl font-bold">{selectedCluster?.gpus}</p>
              </div>
              
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Activity size={16} />
                  </div>
                  <span className="text-sm text-slate-400">总算力</span>
                </div>
                <p className="text-3xl font-bold">{selectedCluster?.['算力']}</p>
              </div>
              
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Globe size={16} />
                  </div>
                  <span className="text-sm text-slate-400">状态</span>
                </div>
                <p className="text-3xl font-bold">{selectedCluster?.status}</p>
              </div>
            </div>
            
            {/* 集群分布图 (使用简单的进度条模拟) */}
            <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50 mb-6">
              <h4 className="text-sm font-medium mb-4">集群节点分布</h4>
              <div className="space-y-4">
                {[
                  { region: '华北', percentage: 35 },
                  { region: '华东', percentage: 40 },
                  { region: '华南', percentage: 15 },
                  { region: '西部', percentage: 10 }
                ].map((region, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{region.region}</span>
                      <span>{region.percentage}%</span>
                    </div>
                    <div className="w-full rounded-full bg-slate-700">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${region.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 集群收益信息 */}
            <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
              <h4 className="text-sm font-medium mb-4">算力收益</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">今日收益</p>
                  <p className="text-xl font-bold text-green-400">+12.5 积分</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">本周收益</p>
                  <p className="text-xl font-bold text-green-400">+87.2 积分</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">本月收益</p>
                  <p className="text-xl font-bold text-green-400">+356.8 积分</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 右侧工具栏 */}
      <div className="mt-6 flex justify-end gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-48 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        
        <button 
          onClick={() => setShowJoinModal(true)}
          className="flex items-center gap-2 rounded-lg border border-indigo-500 bg-indigo-500/20 px-4 py-2 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300"
        >
          <Plus size={16} />
          <span>加入集群</span>
        </button>
      </div>
      
      {/* 加入集群模态框 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showJoinModal ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 ${showJoinModal ? 'block' : 'hidden'}`}
        onClick={() => setShowJoinModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: showJoinModal ? 1 : 0.9, opacity: showJoinModal ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/95 p-6 shadow-xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">加入集群</h3>
            <button 
              onClick={() => setShowJoinModal(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <label htmlFor="cluster-name" className="block text-sm font-medium text-slate-300 mb-2">集群名称</label>
            <input
              type="text"
              id="cluster-name"
              value={selectedCluster?.name}
              disabled
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="join-token" className="block text-sm font-medium text-slate-300 mb-2">集群Token</label>
            <input
              type="text"
              id="join-token"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              placeholder="请输入集群Token"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => setShowJoinModal(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            >
              取消
            </button>
            <button 
              onClick={handleJoinCluster}
              className="rounded-lg bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-600"
            >
              加入
            </button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* 退出集群确认模态框 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showLeaveModal ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 ${showLeaveModal ? 'block' : 'hidden'}`}
        onClick={() => setShowLeaveModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: showLeaveModal ? 1 : 0.9, opacity: showLeaveModal ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/95 p-6 shadow-xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">确认退出集群</h3>
            <button 
              onClick={() => setShowLeaveModal(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-slate-300">
              您确定要退出 <span className="font-medium text-white">{selectedCluster?.name}</span> 集群吗？
              退出后将无法继续为该集群提供算力并获取收益。
            </p>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => setShowLeaveModal(false)}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            >
              取消
            </button>
            <button 
              onClick={handleLeaveCluster}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
            >
              确认退出
            </button>
          </div>
         </motion.div>
       </motion.div>
    </>
  );

  return (
    <Layout activeRoute="/cluster">
      <ClusterContent />
    </Layout>
  );
}