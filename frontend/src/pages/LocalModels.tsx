import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HardDrive, Trash, Search, Filter, Download, Upload, RefreshCw,
  ChevronRight, ChevronDown, X, AlertCircle, CheckCircle, Play
} from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// 定义模型接口
interface AIModel {
  id: string;
  name: string;
  type: string;
  version: string;
  size: string;
  downloadedAt: string;
  status: '可用' | '使用中' | '已损坏';
  description: string;
  source: string;
  usageCount: number;
}

// Mock数据 - 模拟从云端下载的AI模型
const mockLocalModels: AIModel[] = [
  {
    id: 'm1',
    name: 'Stable Diffusion 3',
    type: '图像生成',
    version: '3.0',
    size: '8.9 GB',
    downloadedAt: '2025-10-17 10:30:00',
    status: '可用',
    description: '最先进的文本到图像生成模型，支持高质量图像生成',
    source: 'https://huggingface.co/stabilityai/stable-diffusion-3',
    usageCount: 12
  },
  {
    id: 'm2',
    name: 'LLaMA 3',
    type: '大语言模型',
    version: '8B',
    size: '14.5 GB',
    downloadedAt: '2025-10-16 15:45:00',
    status: '使用中',
    description: '高性能开源大语言模型，支持多种任务和应用场景',
    source: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct',
    usageCount: 28
  },
  {
    id: 'm3',
    name: 'Whisper',
    type: '语音识别',
    version: 'v3',
    size: '2.8 GB',
    downloadedAt: '2025-10-15 09:20:00',
    status: '可用',
    description: '多语言语音识别模型，支持自动语音转文字',
    source: 'https://huggingface.co/openai/whisper-large-v3',
    usageCount: 8
  },
  {
    id: 'm4',
    name: 'Mixtral 8x7B',
    type: '大语言模型',
    version: 'v0.1',
    size: '22.4 GB',
    downloadedAt: '2025-10-14 16:10:00',
    status: '可用',
    description: '混合专家模型，具有更高的参数效率和性能',
    source: 'https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1',
    usageCount: 5
  },
  {
    id: 'm5',
    name: 'Gemma',
    type: '大语言模型',
    version: '7B',
    size: '5.2 GB',
    downloadedAt: '2025-10-13 11:00:00',
    status: '已损坏',
    description: '轻量级开源大语言模型，适合边缘设备部署',
    source: 'https://huggingface.co/google/gemma-7b-it',
    usageCount: 3
  },
  {
    id: 'm6',
    name: 'Flux 3',
    type: '图像生成',
    version: '1.0',
    size: '12.3 GB',
    downloadedAt: '2025-10-12 08:30:00',
    status: '可用',
    description: '新一代高保真图像生成模型，具有更强的细节表现能力',
    source: 'https://huggingface.co/black-forest-labs/FLUX.1-dev',
    usageCount: 7
  },
  {
    id: 'm7',
    name: 'DALL-E Mini',
    type: '图像生成',
    version: 'v2',
    size: '1.5 GB',
    downloadedAt: '2025-10-11 14:20:00',
    status: '可用',
    description: '轻量级文本到图像生成模型，适合快速生成概念图',
    source: 'https://huggingface.co/dalle-mini/dalle-mini',
    usageCount: 15
  },
  {
    id: 'm8',
    name: 'TTS Model',
    type: '语音合成',
    version: '1.0',
    size: '3.8 GB',
    downloadedAt: '2025-10-10 12:15:00',
    status: '可用',
    description: '高质量文本到语音合成模型，支持多种声音风格',
    source: 'https://huggingface.co/models?search=tts',
    usageCount: 9
  }
];

// 模型类型列表
const modelTypes = ['全部', '图像生成', '大语言模型', '语音识别', '语音合成'];
// 模型状态列表
const modelStatuses = ['全部', '可用', '使用中', '已损坏'];
// 排序选项
const sortOptions = ['下载时间', '模型大小', '使用次数'];

export default function LocalModels() {
  // 状态管理
  const [models, setModels] = useState<AIModel[]>(mockLocalModels);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '全部',
    status: '全部'
  });
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [modelsPerPage] = useState(5);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 过滤和排序模型数据
  const filteredAndSortedModels = models
    .filter(model => {
      // 搜索过滤
      const matchesSearch = searchQuery === '' || 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 类型过滤
      const matchesType = filters.type === '全部' || model.type === filters.type;
      
      // 状态过滤
      const matchesStatus = filters.status === '全部' || model.status === filters.status;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      // 根据不同字段排序
      switch (sortBy) {
        case '下载时间':
          return sortOrder === 'asc' 
            ? new Date(a.downloadedAt).getTime() - new Date(b.downloadedAt).getTime()
            : new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime();
        case '模型大小':
          // 从大小字符串中提取数字和单位进行比较
          const sizeRegex = /(\d+(?:\.\d+)?)\s*(\w+)/;
          const aSizeMatch = a.size.match(sizeRegex);
          const bSizeMatch = b.size.match(sizeRegex);
          
          if (aSizeMatch && bSizeMatch) {
            const aSize = parseFloat(aSizeMatch[1]);
            const bSize = parseFloat(bSizeMatch[1]);
            const aUnit = aSizeMatch[2];
            const bUnit = bSizeMatch[2];
            
            // 转换为相同单位比较
            const unitMultipliers: Record<string, number> = { 'GB': 1024, 'MB': 1, 'TB': 1024 * 1024 };
            const aSizeInMB = aSize * unitMultipliers[aUnit] || 0;
            const bSizeInMB = bSize * unitMultipliers[bUnit] || 0;
            
            return sortOrder === 'asc' ? aSizeInMB - bSizeInMB : bSizeInMB - aSizeInMB;
          }
          return 0;
        case '使用次数':
          return sortOrder === 'asc' ? a.usageCount - b.usageCount : b.usageCount - a.usageCount;
        default:
          return 0;
      }
    });

  // 分页逻辑
  const totalPages = Math.ceil(filteredAndSortedModels.length / modelsPerPage);
  const startIndex = (currentPage - 1) * modelsPerPage;
  const endIndex = startIndex + modelsPerPage;
  const paginatedModels = filteredAndSortedModels.slice(startIndex, endIndex);

  // 处理删除模型
  const handleDeleteModel = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    
    if (model && model.status === '使用中') {
      toast.error(`模型 "${model.name}" 正在使用中，无法删除`);
      return;
    }
    
    setModelToDelete(modelId);
    setShowDeleteConfirm(true);
  };

  // 确认删除模型
  const confirmDeleteModel = () => {
    if (modelToDelete) {
      const model = models.find(m => m.id === modelToDelete);
      if (model) {
        setModels(prevModels => prevModels.filter(m => m.id !== modelToDelete));
        toast.success(`已成功删除模型: ${model.name}`);
      }
      setShowDeleteConfirm(false);
      setModelToDelete(null);
    }
  };

  // 取消删除
  const cancelDeleteModel = () => {
    setShowDeleteConfirm(false);
    setModelToDelete(null);
  };

  // 刷新模型列表
  const handleRefreshModels = () => {
    setIsRefreshing(true);
    // 模拟刷新操作
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('模型列表已刷新');
    }, 1000);
  };

  // 处理过滤条件变化
  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1); // 重置为第一页
  };

  // 处理排序变化
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '可用':
        return 'green';
      case '使用中':
        return 'indigo';
      case '已损坏':
        return 'red';
      default:
        return 'slate';
    }
  };

  // 获取类型对应的颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case '图像生成':
        return 'pink';
      case '大语言模型':
        return 'blue';
      case '语音识别':
        return 'emerald';
      case '语音合成':
        return 'purple';
      default:
        return 'slate';
    }
  };

  const LocalModelsContent = () => (
    <>
      {/* 页面标题 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">本地AI模型管理</h2>
        <p className="mt-1 text-slate-400">管理从云端下载的AI模型数据</p>
      </div>
      
      {/* 搜索和筛选区域 */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索模型名称或描述..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          
          {/* 筛选和刷新按钮 */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefreshModels}
              className={`rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white ${isRefreshing ? 'text-indigo-400' : ''}`}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <RefreshCw size={20} />
              )}
            </button>
            
            <button className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
              <Download size={16} />
              <span>导出</span>
            </button>
          </div>
        </div>
        
        {/* 类型和状态筛选 */}
        <div className="mt-4 flex flex-wrap gap-4">
          {/* 模型类型筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">类型:</span>
            <div className="flex flex-wrap gap-2">
              {modelTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('type', type)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.type === type
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {/* 模型状态筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">状态:</span>
            <div className="flex flex-wrap gap-2">
              {modelStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange('status', status)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.status === status
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 模型列表 */}
      <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">模型名称</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">类型</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">版本</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">大小</th>
                <th 
                  className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400 cursor-pointer"
                  onClick={() => handleSortChange('下载时间')}
                >
                  <div className="flex items-center gap-1">
                    下载时间
                    {sortBy === '下载时间' && (
                      <i className={`fa-solid fa-chevron-${sortOrder === 'asc' ? 'up' : 'down'} text-xs`}></i>
                    )}
                  </div>
                </th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">状态</th>
                <th 
                  className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400 cursor-pointer"
                  onClick={() => handleSortChange('使用次数')}
                >
                  <div className="flex items-center gap-1">
                    使用次数
                    {sortBy === '使用次数' && (
                      <i className={`fa-solid fa-chevron-${sortOrder === 'asc' ? 'up' : 'down'} text-xs`}></i>
                    )}
                  </div>
                </th>
                <th className="pb-3 text-left text-sm font-medium text-slate-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedModels.length > 0 ? (
                paginatedModels.map((model) => (
                  <motion.tr 
                    key={model.id} 
                    className="border-b border-slate-800 hover:bg-slate-800/30"
                    whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.3)' }}
                  >
                    <td className="py-4 pr-6 text-sm font-medium">{model.name}</td>
                    <td className="py-4 pr-6">
                      <span className={`rounded-full px-2 py-1 text-xs bg-${getTypeColor(model.type)}-500/20 text-${getTypeColor(model.type)}-400`}>
                        {model.type}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-sm">{model.version}</td>
                    <td className="py-4 pr-6 text-sm">{model.size}</td>
                    <td className="py-4 pr-6 text-sm text-slate-400">{model.downloadedAt}</td>
                    <td className="py-4 pr-6">
                      <span className={`rounded-full px-2 py-1 text-xs bg-${getStatusColor(model.status)}-500/20 text-${getStatusColor(model.status)}-400`}>
                        {model.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-sm">{model.usageCount}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className={`rounded-lg border px-3 py-1 text-xs transition-colors ${
                            model.status === '使用中' 
                              ? 'border-slate-700 text-slate-600 cursor-not-allowed' 
                              : 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20'
                          }`}
                          disabled={model.status === '使用中'}
                        >
                          <Play size={14} className="mr-1 inline" /> 部署
                        </button>
                        <button 
                          onClick={() => handleDeleteModel(model.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            model.status === '使用中' 
                              ? 'text-slate-600 cursor-not-allowed' 
                              : 'text-slate-400 hover:bg-red-500/20 hover:text-red-400'
                          }`}
                          disabled={model.status === '使用中'}
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    暂无符合条件的模型
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800">
            <div className="text-sm text-slate-400">
              显示 {startIndex + 1} - {Math.min(endIndex, filteredAndSortedModels.length)} 共 {filteredAndSortedModels.length} 项
            </div>
            
            <div className="flex items-center gap-2">
              {/* 第一页按钮 */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`rounded-lg border p-2 text-sm transition-colors ${
                  currentPage === 1
                    ? 'border-slate-800 text-slate-600'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-angle-double-left"></i>
              </button>
              
              {/* 上一页按钮 */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`rounded-lg border p-2 text-sm transition-colors ${
                  currentPage === 1
                    ? 'border-slate-800 text-slate-600'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
              
              {/* 页码按钮 */}
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
              
              {/* 下一页按钮 */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`rounded-lg border p-2 text-sm transition-colors ${
                  currentPage === totalPages
                    ? 'border-slate-800 text-slate-600'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-angle-right"></i>
              </button>
              
              {/* 最后一页按钮 */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`rounded-lg border p-2 text-sm transition-colors ${
                  currentPage === totalPages
                    ? 'border-slate-800 text-slate-600'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <i className="fa-solid fa-angle-double-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 页脚提示 */}
      <div className="mt-6 text-sm text-slate-400">
        <p>提示：已损坏的模型可以尝试重新下载或修复，使用中的模型无法删除。</p>
      </div>
      
      {/* 删除确认模态框 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showDeleteConfirm ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 ${showDeleteConfirm ? 'block' : 'hidden'}`}
        onClick={cancelDeleteModel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: showDeleteConfirm ? 1 : 0.9, opacity: showDeleteConfirm ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800/95 p-6 shadow-xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-xl font-bold">确认删除模型</h3>
          </div>
          
          <p className="text-slate-300 mb-6">
            您确定要删除该模型吗？此操作无法撤销，删除后需要重新下载才能使用。
          </p>
          
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={cancelDeleteModel}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              取消
            </button>
            <button 
              onClick={confirmDeleteModel}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
            >
              确认删除
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );

  // 确保正确使用Layout组件包裹页面内容
  return (
    <Layout activeRoute="/local-models">
      <LocalModelsContent />
    </Layout>
  );
}