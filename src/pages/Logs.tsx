import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, AlertCircle, CheckCircle, Info, Search, 
  Download, Filter, ArrowLeft, ArrowRight, Calendar, Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const logs = [
  {
    id: '1',
    time: '2025-10-17 11:20:34',
    level: 'INFO',
    message: '系统启动成功，GPU节点已就绪',
    component: 'system'
  },
  {
    id: '2',
    time: '2025-10-17 11:18:22',
    level: 'WARNING',
    message: 'GPU温度达到65°C，请注意散热',
    component: 'gpu'
  },
  {
    id: '3',
    time: '2025-10-17 11:15:09',
    level: 'INFO',
    message: '成功加入GPStack主集群',
    component: 'cluster'
  },
  {
    id: '4',
    time: '2025-10-17 11:10:45',
    level: 'ERROR',
    message: '内存不足，模型加载失败',
    component: 'model'
  },
  {
    id: '5',
    time: '2025-10-17 11:08:33',
    level: 'INFO',
    message: '用户登录成功',
    component: 'auth'
  },
  {
    id: '6',
    time: '2025-10-17 11:05:12',
    level: 'INFO',
    message: '文本生成任务完成，耗时15分钟',
    component: 'task'
  },
  {
    id: '7',
    time: '2025-10-17 11:00:00',
    level: 'INFO',
    message: '收到算力网络收益50积分',
    component: 'wallet'
  },
  {
    id: '8',
    time: '2025-10-17 10:55:38',
    level: 'WARNING',
    message: '磁盘空间不足20%，建议清理',
    component: 'system'
  },
  {
    id: '9',
    time: '2025-10-17 10:50:21',
    level: 'INFO',
    message: '图像生成任务启动',
    component: 'task'
  },
  {
    id: '10',
    time: '2025-10-17 10:45:00',
    level: 'INFO',
    message: '微信扫码充值500元成功',
    component: 'wallet'
  }
];

const logLevels = ['全部', 'INFO', 'WARNING', 'ERROR'];
const logComponents = ['全部', 'system', 'gpu', 'cluster', 'model', 'auth', 'task', 'wallet'];
const timeRanges = ['全部', '今天', '昨天', '本周', '本月'];

export default function Logs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: '全部',
    component: '全部',
    timeRange: '全部'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  
  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1); // 重置为第一页
  };
  
  // 过滤日志
  const filteredLogs = logs.filter(log => {
    // 级别过滤
    if (filters.level !== '全部' && log.level !== filters.level) return false;
    // 组件过滤
    if (filters.component !== '全部' && log.component !== filters.component) return false;
    // 搜索过滤
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // 时间范围过滤 (简化处理)
    return true;
  });
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
  
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'ERROR': return 'red';
      case 'WARNING': return 'amber';
      case 'INFO': return 'emerald';
      default: return 'slate';
    }
  };
  
  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'ERROR': return <AlertCircle size={16} />;
      case 'WARNING': return <Info size={16} />;
      case 'INFO': return <CheckCircle size={16} />
      default: return <FileText size={16} />;
    }
  };

  const LogsContent = () => (
    <>
      {/* 日志筛选器 */}
      <div className="mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">系统日志</h2>
          <p className="mt-1 text-slate-400">查看系统运行状态和事件记录</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {/* 日志级别筛选 */}
          <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <AlertCircle size={16} />
              日志级别
            </h3>
            <div className="flex flex-wrap gap-2">
              {logLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleFilterChange('level', level)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.level === level
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {/* 组件筛选 */}
          <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <FileText size={16} />
              组件
            </h3>
            <div className="flex flex-wrap gap-2">
              {logComponents.map((component) => (
                <button
                  key={component}
                  onClick={() => handleFilterChange('component', component)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.component === component
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {component}
                </button>
              ))}
            </div>
          </div>
          
          {/* 时间范围筛选 */}
          <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
              <Calendar size={16} />
              时间范围
            </h3>
            <div className="flex flex-wrap gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleFilterChange('timeRange', range)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.timeRange === range
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 日志列表 */}
      <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm">
        <div className="p-4 border-b border-slate-800 bg-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">日志记录</h3>
            <span className="text-sm text-slate-400">共 {filteredLogs.length} 条日志</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">时间</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">级别</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">组件</th>
                <th className="pb-3 text-left text-sm font-medium text-slate-400">消息</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-4 pr-6 text-sm text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{log.time}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-6">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-${getLevelColor(log.level)}-500/20 text-${getLevelColor(log.level)}-400`}>
                        {getLevelIcon(log.level)}
                        {log.level}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-sm">
                      <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400">
                        {log.component}
                      </span>
                    </td>
                    <td className="py-4 text-sm">{log.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    暂无符合条件的日志
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-800">
            <div className="text-sm text-slate-400">
              显示 {startIndex + 1} - {Math.min(endIndex, filteredLogs.length)} 共 {filteredLogs.length} 项
            </div>
            
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
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    currentPage === page
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              
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
      </div>
      
      {/* 右侧工具栏 */}
      <div className="mt-6 flex justify-end gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索日志..."
            className="w-48 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        
        <button className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
          <Download size={16} />
          <span>导出</span>
        </button>
      </div>
    </>
  );

  return (
    <Layout activeRoute="/logs">
      <LogsContent />
    </Layout>
  );
}