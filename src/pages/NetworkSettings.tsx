import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, Globe, Server, Shield, Zap, 
  Save, AlertCircle, CheckCircle, ChevronRight,
  ChevronDown, ChevronUp, RefreshCw, Lock, Unlock, Plus, Minus,
  Settings, X
} from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const networkStats = [
  { name: '上传速度', value: '45.2 Mbps', icon: <ChevronUp size={16} />, color: 'indigo' },
  { name: '下载速度', value: '128.5 Mbps', icon: <ChevronDown size={16} />, color: 'emerald' },
  { name: '延迟', value: '12 ms', icon: <Zap size={16} />, color: 'amber' },
  { name: '已连接节点', value: '8', icon: <Server size={16} />, color: 'purple' }
];

// 模拟网络适配器数据
const networkAdapters = [
  {
    id: '1',
    name: '以太网',
    type: '有线',
    status: '已连接',
    ip: '192.168.1.100',
    speed: '1000 Mbps'
  },
  {
    id: '2',
    name: 'Wi-Fi',
    type: '无线',
    status: '未连接',
    ip: '无',
    speed: '300 Mbps'
  }
];

// 模拟集群连接数据
const clusterConnections = [
  {
    id: '1',
    name: 'AI算力网络',
    status: '已连接',
    address: 'https://cluster.gpstack.io',
    latency: '12 ms',
    lastSeen: '刚刚'
  },
  {
    id: '2',
    name: 'Parse 任务集群',
    status: '已连接',
    address: 'https://parse.cluster.io',
    latency: '18 ms',
    lastSeen: '1分钟前'
  }
];

export default function NetworkSettings() {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    networkMode: 'auto',
    useProxy: false,
    proxyType: 'http',
    proxyHost: '',
    proxyPort: '',
    proxyUsername: '',
    proxyPassword: '',
    bandwidthLimit: 0,
    enableFirewall: true,
    upnpEnabled: true,
    staticIpEnabled: false,
    ipAddress: '192.168.1.100',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.1.1',
    dns1: '8.8.8.8',
    dns2: '8.8.4.4'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    proxy: true,
    firewall: true,
    advanced: true
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    setIsSubmitting(true);
    // 模拟API请求
    setTimeout(() => {
      toast.success('网络设置已保存');
      setIsSubmitting(false);
    }, 1000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const NetworkSettingsContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">网络设置</h2>
        <p className="mt-1 text-slate-400">配置您的网络连接和集群通信</p>
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
            onClick={() => setActiveTab('status')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'status' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            网络状态
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
            <h3 className="text-lg font-medium mb-6">网络配置</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">网络连接模式</label>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <label className="relative border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-indigo-500/50 transition-colors">
                    <input 
                      type="radio" 
                      name="networkMode" 
                      value="auto" 
                      checked={formData.networkMode === 'auto'}
                      onChange={(e) => handleInputChange('networkMode', e.target.value)}
                      className="absolute opacity-0" 
                    />
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        formData.networkMode === 'auto' ? 'border-indigo-500' : 'border-slate-600'
                      }`}>
                        {formData.networkMode === 'auto' && (
                          <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">自动配置</h4>
                        <p className="text-xs text-slate-400 mt-1">自动获取IP和DNS设置</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-indigo-500/50 transition-colors">
                    <input 
                      type="radio" 
                      name="networkMode" 
                      value="static" 
                      checked={formData.networkMode === 'static'}
                      onChange={(e) => handleInputChange('networkMode', e.target.value)}
                      className="absolute opacity-0" 
                    />
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        formData.networkMode === 'static' ? 'border-indigo-500' : 'border-slate-600'
                      }`}>
                        {formData.networkMode === 'static' && (
                          <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">静态IP</h4>
                        <p className="text-xs text-slate-400 mt-1">手动配置网络参数</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-indigo-500/50 transition-colors">
                    <input 
                      type="radio" 
                      name="networkMode" 
                      value="wireless" 
                      checked={formData.networkMode === 'wireless'}
                      onChange={(e) => handleInputChange('networkMode', e.target.value)}
                      className="absolute opacity-0" 
                    />
                    <div className="flex items-center gap-3">
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        formData.networkMode === 'wireless' ? 'border-indigo-500' : 'border-slate-600'
                      }`}>
                        {formData.networkMode === 'wireless' && (
                          <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">无线网络</h4>
                        <p className="text-xs text-slate-400 mt-1">连接到Wi-Fi网络</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              {/* 静态IP设置 */}
              {(formData.networkMode === 'static' || formData.staticIpEnabled) && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="ipAddress" className="block text-sm font-medium text-slate-300 mb-2">IP地址</label>
                    <input
                      type="text"
                      id="ipAddress"
                      value={formData.ipAddress}
                      onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subnetMask" className="block text-sm font-medium text-slate-300 mb-2">子网掩码</label>
                    <input
                      type="text"
                      id="subnetMask"
                      value={formData.subnetMask}
                      onChange={(e) => handleInputChange('subnetMask', e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="defaultGateway" className="block text-sm font-medium text-slate-300 mb-2">默认网关</label>
                    <input
                      type="text"
                      id="defaultGateway"
                      value={formData.defaultGateway}
                      onChange={(e) => handleInputChange('defaultGateway', e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dns1" className="block text-sm font-medium text-slate-300 mb-2">首选DNS</label>
                    <input
                      type="text"
                      id="dns1"
                      value={formData.dns1}
                      onChange={(e) => handleInputChange('dns1', e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="dns2" className="block text-sm font-medium text-slate-300 mb-2">备用DNS</label>
                    <input
                      type="text"
                      id="dns2"
                      value={formData.dns2}
                      onChange={(e) => handleInputChange('dns2', e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              )}
              
              {/* 代理设置 */}
              <div className="border border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('proxy')}
                  className="flex w-full items-center justify-between p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-blue-400" />
                    <span className="font-medium">代理设置</span>
                  </div>
                  {expandedSections.proxy ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {expandedSections.proxy && (
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium">使用代理服务器</h5>
                        <p className="text-xs text-slate-400 mt-1">通过代理服务器连接到网络</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.useProxy}
                          onChange={(e) => handleInputChange('useProxy', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                      </label>
                    </div>
                    
                    {formData.useProxy && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label htmlFor="proxyType" className="block text-sm font-medium text-slate-300 mb-2">代理类型</label>
                          <select 
                            id="proxyType"
                            value={formData.proxyType}
                            onChange={(e) => handleInputChange('proxyType', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          >
                            <option value="http">HTTP</option>
                            <option value="https">HTTPS</option>
                            <option value="socks5">SOCKS5</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="proxyHost" className="block text-sm font-medium text-slate-300 mb-2">代理服务器</label>
                          <input
                            type="text"
                            id="proxyHost"
                            value={formData.proxyHost}onChange={(e) => handleInputChange('proxyHost', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="输入代理服务器地址"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="proxyPort" className="block text-sm font-medium text-slate-300 mb-2">端口</label>
                          <input
                            type="number"
                            id="proxyPort"
                            value={formData.proxyPort}
                            onChange={(e) => handleInputChange('proxyPort', parseInt(e.target.value))}
                            min="1"
                            max="65535"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="输入代理端口"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="proxyUsername" className="block text-sm font-medium text-slate-300 mb-2">用户名</label>
                          <input
                            type="text"
                            id="proxyUsername"
                            value={formData.proxyUsername}
                            onChange={(e) => handleInputChange('proxyUsername', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="输入代理用户名（可选）"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="proxyPassword" className="block text-sm font-medium text-slate-300 mb-2">密码</label>
                          <input
                            type="password"
                            id="proxyPassword"
                            value={formData.proxyPassword}
                            onChange={(e) => handleInputChange('proxyPassword', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="输入代理密码（可选）"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setFormData({
                    networkMode: 'auto',
                    useProxy: false,
                    proxyType: 'http',
                    proxyHost: '',
                    proxyPort: '',
                    proxyUsername: '',
                    proxyPassword: '',
                    bandwidthLimit: 0,
                    enableFirewall: true,
                    upnpEnabled: true,
                    staticIpEnabled: false,
                    ipAddress: '192.168.1.100',
                    subnetMask: '255.255.255.0',
                    defaultGateway: '192.168.1.1',
                    dns1: '8.8.8.8',
                    dns2: '8.8.4.4'
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
            <h3 className="text-lg font-medium mb-6">高级网络配置</h3>
            
            {/* 带宽限制 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-4">带宽限制</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium">启用带宽限制</h5>
                    <p className="text-xs text-slate-400 mt-1">限制上传和下载速度，避免影响其他网络应用</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.bandwidthLimit > 0}
                      onChange={(e) => handleInputChange('bandwidthLimit', e.target.checked ? 100 : 0)}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
                
                {(formData.bandwidthLimit > 0) && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>上传速度限制 (Mbps)</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={formData.bandwidthLimit}
                        onChange={(e) => handleInputChange('bandwidthLimit', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>1 Mbps</span>
                        <span>{formData.bandwidthLimit} Mbps</span>
                        <span>100 Mbps</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="flex items-center justify-between block text-sm font-medium text-slate-300 mb-2">
                        <span>下载速度限制 (Mbps)</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="200"
                        defaultValue={150}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                        <span>1 Mbps</span>
                        <span>150 Mbps</span>
                        <span>200 Mbps</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 防火墙设置 */}
            <div className="mb-6 border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('firewall')}
                className="flex w-full items-center justify-between p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-red-400" />
                  <span className="font-medium">防火墙设置</span>
                </div>
                {expandedSections.firewall ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {expandedSections.firewall && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">启用防火墙</h5>
                      <p className="text-xs text-slate-400 mt-1">保护您的节点免受未授权访问</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.enableFirewall}
                        onChange={(e) => handleInputChange('enableFirewall', e.target.checked)}
                        className="sr-only peer" 
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                  
                  {formData.enableFirewall && (
                    <div>
                      <h5 className="text-sm font-medium mb-3">开放端口</h5>
                      <div className="space-y-3">
                        {[
                          { port: '7860', protocol: 'TCP', description: 'Web UI访问' },
                          { port: '11434', protocol: 'TCP', description: 'Ollama API' },
                          { port: '9000', protocol: 'TCP', description: 'Whisper服务' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-slate-700 rounded-lg">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono">{item.port}</span>
                                <span className="text-xs text-slate-400">{item.protocol}</span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                            </div>
                            <button className="p-1 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
                              <Minus size={14} />
                            </button>
                          </div>
                        ))}
                        
                        <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-slate-700 rounded-lg text-sm text-slate-400 hover:bg-slate-800/50 transition-colors">
                          <Plus size={14} />
                          <span>添加开放端口</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 高级选项 */}
            <div className="mb-6 border border-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('advanced')}
                className="flex w-full items-center justify-between p-4 text-left bg-slate-800 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-amber-400" />
                  <span className="font-medium">高级选项</span>
                </div>
                {expandedSections.advanced ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {expandedSections.advanced && (
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">UPnP端口映射</h5>
                      <p className="text-xs text-slate-400 mt-1">自动配置路由器端口映射</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.upnpEnabled}
                        onChange={(e) => handleInputChange('upnpEnabled', e.target.checked)}
                        className="sr-only peer" 
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium">静态IP分配</h5>
                      <p className="text-xs text-slate-400 mt-1">为节点分配固定IP地址</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.staticIpEnabled}
                        onChange={(e) => handleInputChange('staticIpEnabled', e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                  
                  {formData.staticIpEnabled && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="staticIp" className="block text-sm font-medium text-slate-300 mb-2">IP地址</label>
                        <input
                          type="text"
                          id="staticIp"
                          value={formData.ipAddress}
                          onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="staticSubnetMask" className="block text-sm font-medium text-slate-300 mb-2">子网掩码</label>
                        <input
                          type="text"
                          id="staticSubnetMask"
                          value={formData.subnetMask}
                          onChange={(e) => handleInputChange('subnetMask', e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-4 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={20} className="mt-0.5 text-amber-500" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-400">注意事项</h4>
                        <p className="text-xs text-amber-300 mt-1">
                          高级网络设置可能会影响节点的稳定性和安全性。除非您了解这些设置的具体作用，否则不建议随意更改。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <button
                onClick={() => setFormData({
                  networkMode: 'auto',
                  useProxy: false,
                  proxyType: 'http',
                  proxyHost: '',
                  proxyPort: '',
                  proxyUsername: '',
                  proxyPassword: '',
                  bandwidthLimit: 0,
                  enableFirewall: true,
                  upnpEnabled: true,
                  staticIpEnabled: false,
                  ipAddress: '192.168.1.100',
                  subnetMask: '255.255.255.0',
                  defaultGateway: '192.168.1.1',
                  dns1: '8.8.8.8',
                  dns2: '8.8.4.4'
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
        
        {activeTab === 'status' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-6">网络状态</h3>
            
            {/* 网络统计 */}
            <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {networkStats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`rounded-xl border border-slate-800 bg-slate-800/50 p-4 shadow-sm`}
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400`}>
                    {stat.icon}
                  </div>
                  <h3 className="mb-1 text-xs font-medium text-slate-400">{stat.name}</h3>
                  <p className="text-xl font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>
            
            {/* 网络适配器 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-4">网络适配器</h4>
              <div className="rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 border-b border-slate-700 bg-slate-800 text-xs font-medium">
                  <div className="grid grid-cols-5">
                    <div>名称</div>
                    <div>类型</div>
                    <div>状态</div>
                    <div>IP地址</div>
                    <div>速度</div>
                  </div>
                </div>
                <div className="divide-y divide-slate-800">
                  {networkAdapters.map((adapter) => (
                    <div key={adapter.id} className="p-3 text-sm">
                      <div className="grid grid-cols-5">
                        <div>{adapter.name}</div>
                        <div>{adapter.type}</div>
                        <div>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                            adapter.status === '已连接' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {adapter.status}
                          </span>
                        </div>
                        <div className="font-mono">{adapter.ip}</div>
                        <div>{adapter.speed}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 集群连接 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-300 mb-4">集群连接</h4>
              <div className="rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 border-b border-slate-700 bg-slate-800 text-xs font-medium">
                  <div className="grid grid-cols-5">
                    <div>集群名称</div>
                    <div>状态</div>
                    <div>地址</div>
                    <div>延迟</div>
                    <div>最后活动</div>
                  </div>
                </div>
                <div className="divide-y divide-slate-800">
                  {clusterConnections.map((cluster) => (
                    <div key={cluster.id} className="p-3 text-sm">
                      <div className="grid grid-cols-5">
                        <div>{cluster.name}</div>
                        <div>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                            cluster.status === '已连接' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {cluster.status}
                          </span>
                        </div>
                        <div className="font-mono truncate">{cluster.address}</div>
                        <div>{cluster.latency}</div>
                        <div className="text-slate-400">{cluster.lastSeen}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 网络测试 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-slate-300">网络测试</h4>
                <button className="flex items-center gap-1 text-xs text-slate-400 px-3 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 hover:text-white transition-colors">
                  <RefreshCw size={12} /> 重新测试
                </button>
              </div>
              
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h5 className="text-xs text-slate-400 mb-2">连接测试</h5>
                    <div className="space-y-3">
                      {[
                        { service: '主服务器', status: '连通', color: 'green' },
                        { service: '模型仓库', status: '连通', color: 'green' },
                        { service: '更新服务器', status: '连通', color: 'green' },
                        { service: '监控服务', status: '连通', color: 'green' }
                      ].map((test, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{test.service}</span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-${test.color}-500/20 text-${test.color}-400`}>
                            {test.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs text-slate-400 mb-2">DNS解析</h5>
                    <div className="space-y-3">
                      {[
                        { domain: 'cluster.gpstack.io', ip: '203.0.113.42', status: '成功' },
                        { domain: 'models.example.com', ip: '198.51.100.73', status: '成功' },
                        { domain: 'updates.example.com', ip: '192.0.2.123', status: '成功' }
                      ].map((record, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <span className="text-sm">{record.domain}</span>
                            <p className="text-xs text-slate-400 mt-1 font-mono">{record.ip}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs bg-green-500/20 text-green-400">
                            {record.status}
                          </span>
                        </div>
                      ))}
                    </div>
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
    <Layout activeRoute="/network-settings">
      <NetworkSettingsContent />
    </Layout>
  );
}

// 组件已从lucide-react库导入，不需要手动定义