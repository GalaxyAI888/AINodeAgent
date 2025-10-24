import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Clock, Activity, CheckCircle, AlertTriangle, 
  RefreshCw, Plus, Filter, Download, Upload, Search, ChevronDown,
  ArrowLeft, ArrowRight, Server, Cpu, HardDrive, Zap, Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据 - 任务引擎
const taskEngines = [
  {
    id: 'engine1',
    name: 'LLM文本处理引擎',
    type: '文本处理',
    status: '运行中',
    cpuUsage: '12%',
    memoryUsage: '2.5/16 GB',
    tasksRunning: 3,
    uptime: '12小时30分钟',
    version: '1.2.3',
    lastRestart: '2025-10-17 09:00:00',
    isAutoStart: true
  },
  {
    id: 'engine2',
    name: '图像生成引擎',
    type: '图像处理',
    status: '运行中',
    cpuUsage: '15%',
    memoryUsage: '3.8/16 GB',
    tasksRunning: 2,
    uptime: '8小时15分钟',
    version: '1.1.2',
    lastRestart: '2025-10-17 13:00:00',
    isAutoStart: true
  },
  {
    id: 'engine3',
    name: '音频处理引擎',
    type: '音频处理',
    status: '已停止',
    cpuUsage: '0%',
    memoryUsage: '0.3/16 GB',
    tasksRunning: 0,
    uptime: '0',
    version: '1.0.5',
    lastRestart: '2025-10-16 18:30:00',
    isAutoStart: false
  }
];

// Mock数据 - 任务
const tasks = [
  {
    id: '1',
    name: '文本生成任务 - 技术文档撰写',
    type: 'LLM',
    status: '完成',
    progress: 100,
    priority: '中',
    startTime: '2025-10-17 09:30:00',
    endTime: '2025-10-17 09:45:30',
    duration: '15分钟',
    gpu: 'NVIDIA RTX 4090',
    memoryUsed: '4.2 GB'
  },
  {
    id: '2',
    name: '图像生成任务 - 产品设计图',
    type: '图像',
    status: '完成',
    progress: 100,
    priority: '高',
    startTime: '2025-10-17 08:45:00',
    endTime: '2025-10-17 09:15:00',
    duration: '30分钟',
    gpu: 'NVIDIA RTX 4090',
    memoryUsed: '3.8 GB'
  },
  {
    id: '3',
    name: '模型训练任务 - 定制化LLM微调',
    type: '训练',
    status: '进行中',
    progress: 75,
    priority: '高',
    startTime: '2025-10-17 07:00:00',
    endTime: '-',
    duration: '2小时30分钟',
    gpu: 'NVIDIA RTX 3090',
    memoryUsed: '18.5 GB'
  },
  {
    id: '4',
    name: '音频转写任务 - 会议记录',
    type: '音频',
    status: '等待中',
    progress: 0,
    priority: '低',
    startTime: '-',
    endTime: '-',
    duration: '-',
    gpu: '-',
    memoryUsed: '-'
  },
  {
    id: '5',
    name: '数据分析任务 - 用户行为分析',
    type: '数据分析',
    status: '失败',
    progress: 0,
    priority: '中',
    startTime: '2025-10-17 06:30:00',
    endTime: '2025-10-17 06:45:00',
    duration: '15分钟',
    gpu: 'NVIDIA RTX A6000',
    memoryUsed: '6.2 GB'
  },
  {
    id: '6',
    name: '3D模型生成 - 产品原型',
    type: '3D',
    status: '进行中',
    progress: 45,
    priority: '中',
    startTime: '2025-10-17 05:15:00',
    endTime: '-',
    duration: '1小时20分钟',
    gpu: 'NVIDIA RTX 4090',
    memoryUsed: '12.8 GB'
  }
];

const taskTypes = ['全部', 'LLM', '图像', '训练', '音频', '数据分析', '3D'];
const taskStatuses = ['全部', '进行中', '等待中', '完成', '失败'];
const priorities = ['全部', '高', '中', '低'];

export default function Tasks() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [filters, setFilters] = useState({
    type: '全部',
    status: '全部',
    priority: '全部'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const [engines, setEngines] = useState(taskEngines);
  
  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1); // 重置为第一页
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filters.type !== '全部' && task.type !== filters.type) return false;
    if (filters.status !== '全部' && task.status !== filters.status) return false;
    if (filters.priority !== '全部' && task.priority !== filters.priority) return false;
    return true;
  });
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
  
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case '进行中': return 'amber';
      case '完成': return 'green';
      case '等待中': return 'slate';
      case '失败': return 'red';
      default: return 'slate';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case '高': return 'red';
      case '中': return 'amber';
      case '低': return 'green';
      default: return 'slate';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'LLM': return 'blue';
      case '图像': return 'pink';
      case '训练': return 'purple';
      case '音频': return 'emerald';
      case '数据分析': return 'cyan';
      case '3D': return 'indigo';
      default: return 'slate';
    }
  };

  // 处理引擎开关
  const toggleEngine = (engineId: string) => {
    const updatedEngines = engines.map(engine => {
      if (engine.id === engineId) {
        const newStatus = engine.status === '运行中' ? '已停止' : '运行中';
        toast.info(`${engine.name} 已${newStatus === '运行中' ? '启动' : '停止'}`);
        return { ...engine, status: newStatus };
      }
      return engine;
    });
    setEngines(updatedEngines);
  };

  // 处理自动启动开关
  const toggleAutoStart = (engineId: string) => {
    const updatedEngines = engines.map(engine => {
      if (engine.id === engineId) {
        return { ...engine, isAutoStart: !engine.isAutoStart };
      }
      return engine;
    });
    setEngines(updatedEngines);
  };

  // 重启引擎
  const restartEngine = (engineId: string) => {
    const updatedEngines = engines.map(engine => {
      if (engine.id === engineId) {
        toast.info(`${engine.name} 正在重启...`);
        // 模拟重启过程
        setTimeout(() => {
          toast.success(`${engine.name} 重启成功`);
        }, 1500);
        return { ...engine, status: '运行中', lastRestart: new Date().toLocaleString('zh-CN') };
      }
      return engine;
    });
    setEngines(updatedEngines);
  };

  const TasksContent = () => (
    <>
      {/* 任务引擎管理 */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">任务引擎管理</h2>
          <p className="mt-1 text-slate-400">管理和监控AI任务处理引擎</p>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">引擎名称</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">类型</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">状态</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">CPU使用率</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">内存使用</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">运行任务数</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">运行时间</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">自启动</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {engines.map((engine) => (
                  <tr key={engine.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-4 pr-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Server size={16} className="text-indigo-400" />
                        <span>{engine.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-6">
                      <span className={`rounded-full px-2 py-1 text-xs bg-blue-500/20 text-blue-400`}>
                        {engine.type}
                      </span>
                    </td>
                    <td className="py-4 pr-6">
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        engine.status === '运行中' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {engine.status}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-sm">{engine.cpuUsage}</td>
                    <td className="py-4 pr-6 text-sm">{engine.memoryUsage}</td>
                    <td className="py-4 pr-6 text-sm">{engine.tasksRunning}</td>
                    <td className="py-4 pr-6 text-sm text-slate-400">{engine.uptime}</td>
                    <td className="py-4 pr-6">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={engine.isAutoStart}
                          onChange={() => toggleAutoStart(engine.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleEngine(engine.id)}
                          className={`rounded-lg border px-3 py-1 text-xs transition-colors ${
                            engine.status === '运行中' 
                              ? 'border-red-500 text-red-400 hover:bg-red-500/20' 
                              : 'border-green-500 text-green-400 hover:bg-green-500/20'
                          }`}
                        >
                          {engine.status === '运行中' ? '停止' : '启动'}
                        </button>
                        <button 
                          onClick={() => restartEngine(engine.id)}
                          className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400"
                        >
                          重启
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 引擎统计卡片 */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm`}
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400`}>
              <Server size={20} />
            </div>
            <h3 className="mb-2 text-sm font-medium text-slate-400">引擎总数</h3>
            <p className="text-2xl font-bold">{engines.length}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm`}
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 text-green-400`}>
              <CheckCircle size={20} />
            </div>
            <h3 className="mb-2 text-sm font-medium text-slate-400">运行中引擎</h3>
            <p className="text-2xl font-bold">{engines.filter(e => e.status === '运行中').length}</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm`}
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400`}>
              <Cpu size={20} />
            </div>
            <h3 className="mb-2 text-sm font-medium text-slate-400">平均CPU使用率</h3>
            <p className="text-2xl font-bold">12.3%</p>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm`}
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400`}>
              <HardDrive size={20} />
            </div>
            <h3 className="mb-2 text-sm font-medium text-slate-400">平均内存使用率</h3>
            <p className="text-2xl font-bold">4.2 GB</p>
          </motion.div>
        </div>
      </div>

      {/* 任务概览 */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">任务管理</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white">
              <Filter size={16} />
              <span>筛选</span>
            </button>
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
        
        {/* 任务状态统计 */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: '进行中', value: '2', color: 'amber', icon: <RefreshCw size={20} /> },
            { name: '等待中', value: '1', color: 'slate', icon: <Clock size={20} /> },
            { name: '已完成', value: '2', color: 'green', icon: <CheckCircle size={20} /> },
            { name: '已失败', value: '1', color: 'red', icon: <AlertTriangle size={20} /> }
          ].map((stat, index) => (
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
        
        {/* 任务筛选器 */}
        <div className="mb-6 flex flex-wrap gap-4">
          {/* 任务类型筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">类型:</span>
            <div className="flex flex-wrap gap-2">
              {taskTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('type', type)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.type === type
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {/* 任务状态筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">状态:</span>
            <div className="flex flex-wrap gap-2">
              {taskStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange('status', status)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.status === status
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          {/* 任务优先级筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">优先级:</span>
            <div className="flex flex-wrap gap-2">
              {priorities.map((priority) => (
                <button
                  key={priority}
                  onClick={() => handleFilterChange('priority', priority)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    filters.priority === priority
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 任务列表 */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm">
          <div className="p-4 border-b border-slate-800 bg-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">任务列表</h3>
              <span className="text-sm text-slate-400">共 {filteredTasks.length} 个任务</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/30">
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">任务名称</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">类型</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">状态</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">进度</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">优先级</th>
                  <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">GPU</th>
                  <th className="pb-3 text-left text-sm font-medium text-slate-400">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <td className="py-4 pr-6 text-sm max-w-xs truncate">{task.name}</td>
                      <td className="py-4 pr-6">
                        <span className={`rounded-full px-2 py-1 text-xs bg-${getTypeColor(task.type)}-500/20 text-${getTypeColor(task.type)}-400`}>
                          {task.type}
                        </span>
                      </td>
                      <td className="py-4 pr-6">
                        <span className={`rounded-full px-2 py-1 text-xs bg-${getStatusColor(task.status)}-500/20 text-${getStatusColor(task.status)}-400`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-4 pr-6">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full rounded-full bg-slate-700">
                            <div 
                              className={`h-1.5 rounded-full ${
                                task.progress === 100 ? 'bg-green-500' : 
                                task.progress > 0 ? 'bg-amber-500' : 
                                'bg-slate-600'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-6">
                        <span className={`rounded-full px-2 py-1 text-xs bg-${getPriorityColor(task.priority)}-500/20 text-${getPriorityColor(task.priority)}-400`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-sm">{task.gpu}</td>
                      <td className="py-4">
                        <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:border-indigo-500 hover:text-indigo-400">
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      暂无符合条件的任务
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
                显示 {startIndex + 1} - {Math.min(endIndex, filteredTasks.length)} 共 {filteredTasks.length} 项
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
                  className={`rounded-lg border p-2 text-sm transition-colors ${currentPage === totalPages
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
      </div>
      
      {/* 右侧工具栏 */}
      <div className="mt-6 flex justify-end gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索任务..."
            className="w-48 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        
        <button className="flex items-center gap-2 rounded-lg border border-indigo-500 bg-indigo-500/20 px-4 py-2 text-sm text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300">
          <Plus size={16} />
          <span>创建任务</span>
        </button>
      </div>
    </>
  );

  return (
    <Layout activeRoute="/tasks">
      <TasksContent />
    </Layout>
  );
}