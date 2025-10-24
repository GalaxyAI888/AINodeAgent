import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Lock, Mail, Wallet, Globe, ChevronDown,
  Save, AlertCircle, CheckCircle, Upload, X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

export default function AccountSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: 'user@example.com',
    newPassword: '',
    confirmPassword: '',
    web3Address: user?.web3Address || '',
    avatar: user?.avatar || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = () => {
    toast.info('上传头像功能即将上线');
  };

  const handleSaveProfile = () => {
    setIsSubmitting(true);
    // 模拟API请求
    setTimeout(() => {
      toast.success('个人资料已更新');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (!formData.newPassword) {
      toast.error('请输入新密码');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    
    setIsSubmitting(true);
    // 模拟API请求
    setTimeout(() => {
      toast.success('密码已修改');
      setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      setIsSubmitting(false);
    }, 1000);
  };

  const AccountSettingsContent = () => (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">账号设置</h2>
        <p className="mt-1 text-slate-400">管理您的个人信息和账号安全</p>
      </div>
      
      {/* 选项卡 */}
      <div className="mb-6 border-b border-slate-800">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profile' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            个人资料
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'security' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            安全设置
          </button>
          <button
            onClick={() => setActiveTab('web3')}
            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'web3' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Web3账户
          </button>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-sm">
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-6">基本信息</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* 头像上传 */}
              <div className="flex flex-col items-center justify-center p-6 border border-slate-700 rounded-lg bg-slate-900/50">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-indigo-500/30">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="User avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-slate-700 flex items-center justify-center">
                        <User size={48} className="text-slate-500" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAvatarUpload}
                    className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg"
                  >
                    <Upload size={16} />
                  </button>
                </div>
                <p className="text-sm text-slate-400">点击更换头像</p>
                <p className="text-xs text-slate-500 mt-1">支持JPG、PNG格式，最大5MB</p>
              </div>
              
              {/* 个人信息表单 */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">用户名</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">电子邮箱</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      username: user?.username || '',
                      email: 'user@example.com'
                    }))}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                  >
                    <X size={16} className="mr-1 inline" /> 取消
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSubmitting}
                    className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-600"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> 保存中...
                      </div>
                    ) : (
                      <><Save size={16} className="mr-1 inline" /> 保存</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-6">安全设置</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-4">修改密码</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">新密码</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="请输入新密码"
                    />
                    <p className="text-xs text-slate-500 mt-1">密码长度至少8位，包含字母和数字</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">确认新密码</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }))}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X size={16} className="mr-1 inline" /> 取消
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-600"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> 修改中...
                    </div>
                  ) : (
                    <><Save size={16} className="mr-1 inline" /> 修改密码</>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-4">安全选项</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium">两步验证</h5>
                    <p className="text-xs text-slate-400 mt-1">开启后登录时需要额外验证</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-medium">登录提醒</h5>
                    <p className="text-xs text-slate-400 mt-1">异地登录时发送提醒</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'web3' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium mb-6">Web3账户管理</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="web3Address" className="block text-sm font-medium text-slate-300 mb-2">钱包地址</label>
                <div className="flex">
                  <input
                    type="text"
                    id="web3Address"
                    value={formData.web3Address}
                    onChange={(e) => handleInputChange('web3Address', e.target.value)}
                    className="flex-1 rounded-l-lg border border-slate-700 bg-slate-900 py-3 px-4 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button className="rounded-r-lg border border-slate-700 bg-slate-800 px-4 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                    复制
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">用于接收算力网络收益</p>
              </div>
              
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 text-amber-500" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-400">注意事项</h4>
                    <p className="text-xs text-amber-300 mt-1">
                      请确保您拥有该钱包地址的私钥或助记词，一旦绑定将无法直接修改。如需更换，请联系客服。
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, web3Address: user?.web3Address || '' }))}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <X size={16} className="mr-1 inline" /> 取消
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-600"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> 保存中...
                    </div>
                  ) : (
                    <><Save size={16} className="mr-1 inline" /> 保存</>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h4 className="text-sm font-medium text-slate-300 mb-4">收益记录</h4>
              <div className="rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-3 border-b border-slate-700 bg-slate-800 text-sm font-medium">最近收益</div>
                <div className="divide-y divide-slate-800">
                  {[
                    { date: '2025-10-17', amount: '+50 积分', status: '已到账' },
                    { date: '2025-10-16', amount: '+35 积分', status: '已到账' },
                    { date: '2025-10-15', amount: '+42 积分', status: '已到账' }
                  ].map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-800/50">
                      <div>
                        <p className="text-sm">{record.date}</p>
                        <p className="text-xs text-slate-400 mt-1">算力网络收益</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">{record.amount}</p>
                        <p className="text-xs text-slate-400 mt-1">{record.status}</p>
                      </div>
                    </div>
                  ))}
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
    <Layout activeRoute="/account-settings">
      <AccountSettingsContent />
    </Layout>
  );
}