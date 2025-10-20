import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  Cpu, HardDrive, Clock, Activity, AlertTriangle, RefreshCw,
  Settings, Filter, Download, Upload, Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const gpuPerformanceData = [
  { name: '00:00', usage: 30, memory: 40, temp: 55 },
  { name: '04:00', usage: 20, memory: 35, temp: 52 },
  { name: '08:00', usage: 45, memory: 55, temp: 60 },
  { name: '12:00', usage: 70, memory: 75, temp: 72 },
  { name: '16:00', usage: 65, memory: 70, temp: 68 },
  { name: '20:00', usage: 80, memory: 85, temp: 75 },
  { name: '现在', usage: 60, memory: 65, temp: 65 },
];

const gpuList = [
  {
    id: '1',
    model: 'NVIDIA RTX 4090',
    usage: 60,
    memory: { total: 24, used: 15.6, free: 8.4 },
    temperature: 65,
    power: 280,
    status: '正常',
    processes: 8
  },
  {
    id: '2',
    model: 'NVIDIA RTX 3090',
    usage: 45,
    memory: { total: 24, used: 10.8, free: 13.2 },
    temperature: 60,
    power: 250,
    status: '正常',
    processes: 5
  },
  {
    id: '3',
    model: 'NVIDIA RTX A6000',
    usage: 30,
    memory: { total: 48, used: 14.4, free: 33.6 },
    temperature: 55,
    power: 300,
    status: '正常',
    processes: 3
  }
];

const systemMetrics = [
  { name: 'CPU使用率', value: '25%', icon: <Cpu size={20} />, color: 'blue' },
  { name: '内存占用', value: '6.8/16 GB', icon: <HardDrive size={20} />, color: 'purple' },
  { name: '磁盘空间', value: '120/512 GB', icon: <HardDrive size={20} />, color: 'emerald' },
  { name: '系统负载', value: '1.2', icon: <Activity size={20} />, color: 'amber' },
];

export default function Resources() {
  const navigate = useNavigate();
  const [selectedGpu, setSelectedGpu] = useState(gpuList[0]);
  const [timeRange, setTimeRange] = useState('day');
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case 'day': return '今日';
      case 'week': return '本周';
      case 'month': return '本月';
      default: return '今日';
    }
  };
  
  const formatMemory = (used: number, total: number) => {
    return `${used.toFixed(1)} / ${total} GB (${((used/total)*100).toFixed(0)}%)`;
  };

  const ResourcesContent = () => (
    <>
      {/* 系统概览 */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">系统资源概览</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
              <Filter size={16} />
              <span>筛选</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
              <Download size={16} />
              <span>导出</span>
            </button>
          </div>
        </div>
        
        {/* 系统指标卡片 */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {systemMetrics.map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm`}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-${metric.color}-500/20 text-${metric.color}-400`}>
                {metric.icon}
              </div>
              <h3 className="mb-2 text-sm font-medium text-slate-400">{metric.name}</h3>
              <p className="text-2xl font-bold">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* GPU列表和详情 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* GPU列表 */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 overflow-hidden shadow-sm lg:col-span-1">
          <div className="p-4 border-b border-slate-800 bg-slate-800">
            <h3 className="text-lg font-medium">GPU设备列表</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {gpuList.map((gpu) => (
              <motion.div
                key={gpu.id}
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.3)' }}
                onClick={() => setSelectedGpu(gpu)}
                className={`p-4 cursor-pointer transition-colors ${selectedGpu.id === gpu.id ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{gpu.model}</h4>
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    gpu.status === '正常' ? 'bg-green-500/20 text-green-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {gpu.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>使用率</span>
                      <span>{gpu.usage}%</span>
                    </div>
                    <div className="w-full rounded-full bg-slate-700">
                      <div 
                        className={`h-1.5 rounded-full ${
                          gpu.usage > 80 ? 'bg-red-500' :
                          gpu.usage > 60 ? 'bg-amber-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${gpu.usage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>温度</span>
                    <span>{gpu.temperature}°C</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* GPU详情和性能图表 */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{selectedGpu?.model} 详情</h3>
              <div className="flex items-center gap-2">
                {['day', 'week', 'month'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      timeRange === range
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {getTimeRangeLabel()}
                  </button>
                ))}
              </div>
            </div>
            
            {/* GPU关键指标 */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Cpu size={16} />
                  </div>
                  <span className="text-sm text-slate-400">GPU使用率</span>
                </div>
                <p className="text-3xl font-bold">{selectedGpu?.usage}%</p>
              </div>
              
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <HardDrive size={16} />
                  </div>
                  <span className="text-sm text-slate-400">显存使用</span>
                </div>
                <p className="text-3xl font-bold">
                  {selectedGpu && formatMemory(selectedGpu.memory.used, selectedGpu.memory.total)}
                </p>
              </div>
              
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <Activity size={16} />
                  </div>
                  <span className="text-sm text-slate-400">温度</span>
                </div>
                <p className="text-3xl font-bold">{selectedGpu?.temperature}°C</p>
              </div>
              
              <div className="rounded-lg border border-slate-700 p-4 bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Settings size={16} />
                  </div>
                  <span className="text-sm text-slate-400">功耗</span>
                </div>
                <p className="text-3xl font-bold">{selectedGpu?.power}W</p>
              </div>
            </div>
            
            {/* GPU性能图表 */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={gpuPerformanceData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="usage" stroke="#6366f1" strokeWidth={2} dot={{ r: 0 }} />
                  <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={2} dot={{ r: 0 }} />
                  <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={{ r: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* 进程列表 */}
      <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm">
        <div className="p-4 border-b border-slate-800 bg-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">GPU进程</h3>
            <span className="text-sm text-slate-400">总计 {selectedGpu?.processes} 个进程</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">进程ID</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">任务名称</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">GPU使用率</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">显存使用</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">运行时间</th>
                <th className="pb-3 pt-3 text-left text-sm font-medium text-slate-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '12345', name: '文本生成任务', usage: 25, memory: '4.2 GB', time: '2小时' },
                { id: '12346', name: '图像生成任务', usage: 20, memory: '3.8 GB', time: '1小时' },
                { id: '12347', name: '模型训练', usage: 15, memory: '7.6 GB', time: '5小时' }
              ].map((process, index) => (
                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-4 pr-6 text-sm">{process.id}</td>
                  <td className="py-4 pr-6 text-sm">{process.name}</td>
                  <td className="py-4 pr-6 text-sm">{process.usage}%</td>
                  <td className="py-4 pr-6 text-sm">{process.memory}</td>
                  <td className="py-4 pr-6 text-sm">{process.time}</td>
                  <td className="py-4">
                    <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-red-500 hover:text-red-400">
                      结束
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 右侧工具栏 */}
      <div className="mt-6 flex justify-end gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索资源..."
            className="w-48 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className={`rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white ${refreshing ? 'text-indigo-400' : ''}`}
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <RefreshCw size={20} />
            )}
          </button>
          
          <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <Layout activeRoute="/resources">
      <ResourcesContent />
    </Layout>
  );
}