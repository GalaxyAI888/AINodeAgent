import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Download, Upload, HardDrive, Link2, Activity,
  Package, Code, X, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
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
  },
  // 添加更多模型数据以测试分页功能
  {
    id: 'm7',
    name: 'CLIP',
    type: '多模态',
    description: '连接文本和图像的多模态模型',
    size: '1.8 GB',
    downloads: '150,200+',
    url: 'https://huggingface.co/openai/clip-vit-base-patch32',
    popularity: 9.3
  },
  {
    id: 'm8',
    name: 'ControlNet',
    type: '图像生成',
    description: '可控的图像生成模型扩展',
    size: '3.2 GB',
    downloads: '98,500+',
    url: 'https://huggingface.co/lllyasviel/ControlNet-v1-1',
    popularity: 9.1
  },
  {
    id: 'm9',
    name: 'T5',
    type: '大语言模型',
    description: '文本到文本的转换模型',
    size: '8.4 GB',
    downloads: '180,300+',
    url: 'https://huggingface.co/google/flan-t5-xxl',
    popularity: 9.2
  }
];

// 获取所有模型类型
const modelTypes = ['全部', ...Array.from(new Set(cloudModels.map(model => model.type)))];

export default function ModelMarket() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModelDetail, setShowModelDetail] = useState(false);
  const [selectedModel, setSelectedModel] = useState(cloudModels[0]);
  const [selectedType, setSelectedType] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [modelsPerPage] = useState(6);
  
  // 过滤模型
  const filteredModels = cloudModels.filter(model => {
    const matchesSearch = searchQuery === '' || 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === '全部' || model.type === selectedType;
    
    return matchesSearch && matchesType;
  });
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const endIndex = startIndex + modelsPerPage;
  const paginatedModels = filteredModels.slice(startIndex, endIndex);
  
  const handleDownloadModel = (model: any) => {
    setSelectedModel(model);
    setShowModelDetail(true);
    toast.info(`开始下载模型: ${model.name}`);
  };
  
  // 获取类型对应的颜色
  const getTypeColor = (type: string) => {
    switch(type) {
      case '图像生成': return 'pink';
      case '语音识别': return 'emerald';
      case '大语言模型': return 'indigo';
      case '多模态': return 'purple';
      default: return 'slate';
    }
  };

  const ModelMarketContent = () => (
    <>
      {/* 模型市场概览 */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">云端模型市场</h2>
          <p className="mt-1 text-slate-400">浏览和下载预置的AI模型</p>
        </div>
        
        {/* 模型类型筛选 */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">类型:</span>
            <div className="flex flex-wrap gap-2">
              {modelTypes.map((type) => (
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
          {paginatedModels.length > 0 ? (
            paginatedModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rounded-xl border border-slate-800 bg-slate-800/50 overflow-hidden shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">{model.name}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs bg-${getTypeColor(model.type)}-500/20 text-${getTypeColor(model.type)}-400`}>
                      {model.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{model.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <HardDrive size={12} />
                      <span>{model.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download size={12} />
                      <span>{model.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity size={12} />
                      <span>{model.popularity}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDownloadModel(model)}
                      className="flex-1 rounded-lg bg-indigo-500/20 px-3 py-2 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300"
                    >
                      下载模型
                    </button>
                    <a 
                      href={model.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                    >
                      <Link2 size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400">
              暂无符合条件的模型
            </div>
          )}
        </div>
      </div>
      
      {/* 分页控件 */}
      {totalPages > 1 && paginatedModels.length > 0 && (
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
            placeholder="搜索模型..."
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
    </>
  );

  return (
    <Layout activeRoute="/model-market">
      <ModelMarketContent />
    </Layout>
  );
}