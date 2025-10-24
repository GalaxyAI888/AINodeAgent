import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, HardDrive, Zap, Settings, Server, 
  Save, AlertCircle, CheckCircle, ChevronRight,
  ChevronDown, ArrowUpDown, Lock, Unlock, RefreshCw, X
} from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const gpuDevices = [
  {
    id: '1',
    model: 'NVIDIA RTX 4090',
    memory: '24 GB',
    temperature: '65°C',
    utilization: '60%',
    power: '280W'
  },
  {
    id: '2',
    model: 'NVIDIA RTX 3090',
    memory: '24 GB',
    temperature: '60°C',
    utilization: '45%',
    power: '250W'
  }
];

export default function NodeSettings() {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    nodeName: 'My AI Node',
    description: 'Personal AI computing node',
    maxMemoryUsage: 80,
    maxGpuTemperature: 85,
    autoStart: true,
    allowRemoteAccess: false,
    remoteAccessPort: 7860,
    enablePowerSaving: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGpu, setSelectedGpu] = useState(gpuDevices[0]);
  const [expandedSections, setExpandedSections] = useState({
    performance: true,
    power: true,
    security: true
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    setIsSubmitting(true);
    // 模拟API请求
    setTimeout(() => {
      toast.success('节点设置已保存');
      setIsSubmitting(false);
    }, 1000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const NodeSettingsContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">节点设置</h2>
        <p className="mt-1 text-slate-400">配置您的AI计算节点参数</p>
      </div>
      
      {/* 选项卡 */}
      <div className="mb-6 border-b border-slate-800">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('basic')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'basic' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            基本设置
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'advanced' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            高级设置
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'devices' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            设备管理
          </button>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm">
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-6">基本配置</h3>
            
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="nodeName" className="block text-sm font-medium text-slate-300 mb-2">节点名称</label>
                  <input
                    type="text"
                    id="nodeName"
                    value={formData.nodeName}
                    onChange={(e) => handleInputChange('nodeName', e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">节点描述</label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium text-slate-300 mb-4">资源限制</h4>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                      <span>最大GPU内存使用率 ({formData.maxMemoryUsage}%)</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={formData.maxMemoryUsage}
                      onChange={(e) => handleInputChange('maxMemoryUsage', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                      <span>最高GPU温度限制 ({formData.maxGpuTemperature}°C)</span>
                    </label>
                    <input
                      type="range"
                      min="70"
                      max="95"
                      value={formData.maxGpuTemperature}
                      onChange={(e) => handleInputChange('maxGpuTemperature', parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium text-slate-300 mb-4">启动选项</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">开机自启动</h5>
                      <p className="text-xs text-slate-400 mt-1">系统启动时自动运行AI节点服务</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.autoStart}
                        onChange={(e) => handleInputChange('autoStart', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">启用节能模式</h5>
                      <p className="text-xs text-slate-400 mt-1">空闲时降低GPU频率以节省电力</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.enablePowerSaving}
                        onChange={(e) => handleInputChange('enablePowerSaving', e.target.checked)}
                        className="sr-only peer" 
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setFormData({
                    nodeName: 'My AI Node',
                    description: 'Personal AI computing node',
                    maxMemoryUsage: 80,
                    maxGpuTemperature: 85,
                    autoStart: true,
                    allowRemoteAccess: false,
                    remoteAccessPort: 7860,
                    enablePowerSaving: true
                  })}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X size={16} className="mr-1 inline" /> 取消
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-600"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> 保存中...
                    </div>
                  ) : (
                    <><Save size={16} className="mr-1 inline" /> 保存设置</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'advanced' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-6">高级配置</h3>
            
            {/* 性能设置 */}
            <div className="mb-6 border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('performance')}
                className="flex w-full items-center justify-between p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" />
                  <span className="font-medium">性能设置</span>
                </div>
                {expandedSections.performance ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {expandedSections.performance && (
                <div className="p-4 space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>推理线程数</span>
                      </label>
                      <select className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4" selected>4</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>批处理大小</span>
                      </label>
                      <select className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4" selected>4</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>内存分配策略</span>
                      </label>
                      <select className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="balanced" selected>平衡</option>
                        <option value="performance">性能优先</option>
                        <option value="memory">内存优先</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>量化精度</span>
                      </label>
                      <select className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="fp32">FP32</option>
                        <option value="fp16">FP16</option>
                        <option value="bf16">BF16</option>
                        <option value="int8" selected>INT8</option>
                        <option value="int4">INT4</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 电源管理 */}
            <div className="mb-6 border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('power')}
                className="flex w-full items-center justify-between p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HardDrive size={18} className="text-green-400" />
                  <span className="font-medium">电源管理</span>
                </div>
                {expandedSections.power ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {expandedSections.power && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">空闲超时关机</h5>
                      <p className="text-xs text-slate-400 mt-1">长时间未使用时自动关闭节点</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                      <span>空闲超时时间 (分钟)</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      defaultValue={30}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                      <span>5分钟</span>
                      <span>30分钟</span>
                      <span>120分钟</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>最大功率限制 (W)</span>
                      </label>
                      <input
                        type="number"
                        defaultValue={300}
                        min="100"
                        max="1000"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>温度控制策略</span>
                      </label>
                      <select className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="balanced" selected>平衡</option>
                        <option value="aggressive">激进</option>
                        <option value="conservative">保守</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 安全设置 */}
            <div className="mb-6 border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('security')}
                className="flex w-full items-center justify-between p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-red-400" />
                  <span className="font-medium">安全设置</span>
                </div>
                {expandedSections.security ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {expandedSections.security && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">允许远程访问</h5>
                      <p className="text-xs text-slate-400 mt-1">允许从其他设备访问此节点</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.allowRemoteAccess}
                        onChange={(e) => handleInputChange('allowRemoteAccess', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                  
                  {formData.allowRemoteAccess && (
                    <div>
                      <label htmlFor="remoteAccessPort" className="block text-sm font-medium text-slate-300 mb-2">远程访问端口</label>
                      <input
                        type="number"
                        id="remoteAccessPort"
                        value={formData.remoteAccessPort}
                        onChange={(e) => handleInputChange('remoteAccessPort', parseInt(e.target.value))}
                        min="1024"
                        max="65535"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">API访问令牌</h5>
                      <p className="text-xs text-slate-400 mt-1">用于API调用的安全令牌</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                        <RefreshCw size={14} className="mr-1 inline" /> 重置
                      </button>
                      <button className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                        复制
                      </button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-slate-700 bg-slate-900 p-3 font-mono text-sm">
                    ******************************
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setFormData({
                  nodeName: 'My AI Node',
                  description: 'Personal AI computing node',
                  maxMemoryUsage: 80,
                  maxGpuTemperature: 85,
                  autoStart: true,
                  allowRemoteAccess: false,
                  remoteAccessPort: 7860,
                  enablePowerSaving: true
                })}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X size={16} className="mr-1 inline" /> 取消
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-600"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> 保存中...
                  </div>
                ) : (
                  <><Save size={16} className="mr-1 inline" /> 保存设置</>
                )}
              </button>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'devices' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-6">设备管理</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* GPU设备列表 */}
              <div className="rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 border-b border-slate-700 bg-slate-800 text-sm font-medium">GPU设备</div>
                <div className="divide-y divide-slate-800">
                  {gpuDevices.map((gpu) => (
                    <div 
                      key={gpu.id}
                      onClick={() => setSelectedGpu(gpu)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedGpu.id === gpu.id ? 'bg-indigo-500/10' : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <h4 className="font-medium">{gpu.model}</h4>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="flex items-center gap-1 text-slate-400">
                          <HardDrive size={12} />
                          <span>{gpu.memory}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Zap size={12} />
                          <span>{gpu.utilization}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 设备详情 */}
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <h4 className="font-medium mb-4">{selectedGpu.model} 详情</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">显存容量</span>
                    <span className="text-sm">{selectedGpu.memory}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">使用率</span>
                    <span className="text-sm">{selectedGpu.utilization}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">温度</span>
                    <span className="text-sm">{selectedGpu.temperature}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">功耗</span>
                    <span className="text-sm">{selectedGpu.power}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h5 className="text-sm font-medium mb-3">设备状态</h5>
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 flex items-start gap-2">
                    <CheckCircle size={16} className="mt-0.5 text-green-400" />
                    <p className="text-xs text-green-300">设备运行正常，温度和使用率在安全范围内</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                    <RefreshCw size={14} className="mr-1 inline" /> 刷新状态
                  </button>
                  <button className="rounded-lg border border-indigo-500 bg-indigo-500/20 px-3 py-1.5 text-xs text-indigo-400 transition-colors hover:bg-indigo-500/30 hover:text-indigo-300">
                    <Settings size={14} className="mr-1 inline" /> 设备设置
                  </button>
                </div>
              </div>
            </div>
            
            {/* 设备监控 */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-sm font-medium mb-4">设备监控</h4>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-xs text-slate-400 mb-1">平均使用率</p>
                    <p className="text-lg font-bold text-indigo-400">52%</p>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-xs text-slate-400 mb-1">平均温度</p>
                    <p className="text-lg font-bold text-indigo-400">62°C</p>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-xs text-slate-400 mb-1">累计运行时间</p>
                    <p className="text-lg font-bold text-indigo-400">128小时</p>
                  </div>
                  <div className="rounded-lg bg-slate-800 p-3">
                    <p className="text-xs text-slate-400 mb-1">任务完成数</p>
                    <p className="text-lg font-bold text-indigo-400">356</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );

  // 确保正确使用Layout组件包裹页面内容
  return (
    <Layout activeRoute="/node-settings">
      <NodeSettingsContent />
    </Layout>
  );
}