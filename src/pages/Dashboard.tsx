import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Microchip, HardDrive, Cpu, Clock, DollarSign, Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const gpuUsageData = [
  { name: '00:00', usage: 30 },
  { name: '04:00', usage: 20 },
  { name: '08:00', usage: 45 },
  { name: '12:00', usage: 70 },
  { name: '16:00', usage: 65 },
  { name: '20:00', usage: 80 },
  { name: '现在', usage: 60 },
];

const modelDistributionData = [
  { name: 'LLM模型', value: 45 },
  { name: '图像模型', value: 30 },
  { name: '音频模型', value: 15 },
  { name: '其他模型', value: 10 },
];

const COLORS = ['#6366F1', '#A855F7', '#EC4899', '#F97316'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const DashboardContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">欢迎回来，{user?.username}</h2>
        <p className="mt-1 text-slate-400">这是您的AI大模型节点状态概览</p>
      </div>
      
      {/* 卡片统计 */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Microchip size={24} />
          </div>
          <h3 className="mb-2 text-sm font-medium text-slate-400">GPU利用率</h3>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">60%</p>
            <span className="mb-1 text-sm text-green-400">
              <i className="fa-solid fa-arrow-up"></i> 5%
            </span>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
            <HardDrive size={24} />
          </div>
          <h3 className="mb-2 text-sm font-medium text-slate-400">内存占用</h3>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">12.5 GB</p>
            <span className="mb-1 text-sm text-red-400">
              <i className="fa-solid fa-arrow-up"></i> 10%
            </span>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Zap size={24} />
          </div>
          <h3 className="mb-2 text-sm font-medium text-slate-400">算力积分</h3>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">{user?.computePoints}</p>
            <span className="mb-1 text-sm text-green-400">
              <i className="fa-solid fa-arrow-up"></i> 20
            </span>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <DollarSign size={24} />
          </div>
          <h3 className="mb-2 text-sm font-medium text-slate-400">账户余额</h3>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">¥{user?.balance}</p>
            <span className="mb-1 text-sm text-red-400">
              <i className="fa-solid fa-arrow-down"></i> 10
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* 图表和数据展示 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* GPU使用率图表 */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium">GPU使用率趋势</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-400">今日</span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-400">本周</span>
              <span className="rounded-full bg-slate-700 px-3 py-1 text-white">本月</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gpuUsageData}
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
                <Bar dataKey="usage" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 模型分布饼图 */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-medium">模型分布</h3>
          <div className="mb-4 h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2">
            {modelDistributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-slate-400">{item.name}</span>
                <span className="ml-auto font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 快速操作 */}
      <div className="mb-8 rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-medium">快速操作</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: <i className="fa-solid fa-robot"></i>, title: "启动模型", color: "indigo" },
            { icon: <i className="fa-solid fa-network-wired"></i>, title: "加入集群", color: "emerald" },
            { icon: <i className="fa-solid fa-image"></i>, title: "生成图像", color: "pink" },
            { icon: <i className="fa-solid fa-file-alt"></i>, title: "文本生成", color: "blue" },
            { icon: <i className="fa-solid fa-wallet"></i>, title: "充值", color: "amber" },
            { icon: <i className="fa-solid fa-cog"></i>, title: "设置", color: "slate" }
          ].map((item, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -3 }}
              className={`flex flex-col items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-center transition-all hover:border-${item.color}-500/50 hover:bg-slate-700/30 hover:shadow-md hover:shadow-${item.color}-500/10`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${item.color}-500/20 text-${item.color}-400`}>
                {item.icon}
              </div>
              <span className="text-sm font-medium">{item.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* 最近任务 */}
      <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium">最近任务</h3>
          <button 
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-1 text-sm text-indigo-400 transition-colors hover:text-indigo-300"
          >
            查看全部 <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="pb-3 pr-6 text-left text-sm font-medium text-slate-400">任务名称</th>
                <th className="pb-3 pr-6 text-left text-sm font-medium text-slate-400">类型</th>
                <th className="pb-3 pr-6 text-left text-sm font-medium text-slate-400">状态</th>
                <th className="pb-3 pr-6 text-left text-sm font-medium text-slate-400">进度</th>
                <th className="pb-3 text-left text-sm font-medium text-slate-400">时间</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "文本生成任务", type: "LLM", status: "完成", progress: 100, time: "10分钟前" },
                { name: "图像生成任务", type: "图像", status: "完成", progress: 100, time: "30分钟前" },
                { name: "模型训练任务", type: "训练", status: "进行中", progress: 75, time: "2小时前" },
                { name: "音频转写任务", type: "音频", status: "等待中", progress: 0, time: "3小时前" },
              ].map((task, index) => (
                <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-4 pr-6 text-sm">{task.name}</td>
                  <td className="py-4 pr-6">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      task.type === 'LLM' ? 'bg-blue-500/20 text-blue-400' :
                      task.type === '图像' ? 'bg-pink-500/20 text-pink-400' :
                      task.type === '训练' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {task.type}
                    </span>
                  </td>
                  <td className="py-4 pr-6">
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      task.status === '完成' ? 'bg-green-500/20 text-green-400' :
                      task.status === '进行中' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6">
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
                  </td>
                  <td className="py-4 text-sm text-slate-400">{task.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <Layout activeRoute="/dashboard">
      <DashboardContent />
    </Layout>
  );
}