import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, CreditCard, Gift, QrCode, ChevronDown,
  Filter, Download, Upload, Search, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';

// Mock数据
const transactionHistory = [
  {
    id: '1',
    type: '充值',
    amount: 500,
    balance: 600,
    date: '2025-10-17 10:30:00',
    description: '微信扫码充值'
  },
  {
    id: '2',
    type: '消费',
    amount: 100,
    balance: 100,
    date: '2025-10-16 15:45:00',
    description: '模型训练费用'
  },
  {
    id: '3',
    type: '收入',
    amount: 50,
    balance: 200,
    date: '2025-10-15 09:20:00',
    description: '算力网络收益'
  },
  {
    id: '4',
    type: '消费',
    amount: 50,
    balance: 150,
    date: '2025-10-14 16:10:00',
    description: '图像生成费用'
  },
  {
    id: '5',
    type: '充值',
    amount: 200,
    balance: 200,
    date: '2025-10-13 11:00:00',
    description: '卡密充值'
  }
];

const transactionTypes = ['全部', '充值', '消费', '收入'];
const timeRanges = ['全部', '今日', '本周', '本月', '三个月内'];

export default function Wallet() {
  const { user } = useAuth();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeMethod, setRechargeMethod] = useState('wechat');
  const [rechargeAmount, setRechargeAmount] = useState(100);
  const [cardCode, setCardCode] = useState('');
  const [filters, setFilters] = useState({
    type: '全部',
    timeRange: '全部'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  
  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1); // 重置为第一页
  };
  
  const filteredTransactions = transactionHistory.filter(transaction => {
    if (filters.type !== '全部' && transaction.type !== filters.type) return false;
    // 这里简化处理，实际应用中应该根据具体的时间范围进行过滤
    return true;
  });
  
  // 分页逻辑
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
  
  const handleRecharge = () => {
    if (rechargeMethod === 'wechat') {
      // 模拟微信充值
      toast.success(`已生成${rechargeAmount}元的微信充值二维码`);
      setShowRechargeModal(false);
    } else if (rechargeMethod === 'card') {
      if (cardCode) {
        // 模拟卡密充值
        toast.success('卡密充值成功');
        setShowRechargeModal(false);
        setCardCode('');
      } else {
        toast.error('请输入有效的卡密');
      }
    }
  };
  
  const getTransactionColor = (type: string) => {
    switch(type) {
      case '充值': return 'green';
      case '收入': return 'green';
      case '消费': return 'red';
      default: return 'slate';
    }
  };
  
  const getTransactionIcon = (type: string) => {
    switch(type) {
      case '充值': return <i className="fa-solid fa-plus text-green-400"></i>;
      case '收入': return <i className="fa-solid fa-arrow-down-left text-green-400"></i>;
      case '消费': return <i className="fa-solid fa-arrow-up-right text-red-400"></i>;default: return <i className="fa-solid fa-exchange-alt text-slate-400"></i>;
    }
  };

  const WalletContent = () => (
    <>
      {/* 账户概览 */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">账户概览</h2>
          <p className="mt-1 text-slate-400">查看您的余额和交易记录</p>
        </div>
        
        {/* 账户余额卡片 */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mb-8 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="mb-2 text-sm font-medium text-slate-400">账户余额</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">¥{user?.balance}</span>
                <span className="text-sm text-slate-400">可用余额</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-3 md:mt-0">
              <button 
                onClick={() => setShowRechargeModal(true)}
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20"
              >
                <DollarSign size={16} className="mr-1 inline" /> 充值
              </button>
              
              <button className="rounded-lg border border-slate-700 px-6 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
                <CreditCard size={16} className="mr-1 inline" /> 提现
              </button>
            </div>
          </div>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <i className="fa-solid fa-zap"></i>
                </div>
                <span className="text-sm text-slate-400">算力积分</span>
              </div>
              <p className="text-2xl font-bold">{user?.computePoints}</p>
              <p className="text-xs text-slate-500 mt-1">可用于抵扣模型使用费</p>
            </div>
            
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <i className="fa-solid fa-link"></i>
                </div>
                <span className="text-sm text-slate-400">Web3账户</span>
              </div>
              <p className="text-sm font-mono truncate">{user?.web3Address}</p>
              <p className="text-xs text-slate-500 mt-1">用于接收算力网络收益</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* 交易记录 */}
      <div className="rounded-xl border border-slate-800 bg-slate-800/50 shadow-sm">
        <div className="p-4 border-b border-slate-800 bg-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-medium">交易记录</h3>
            
            <div className="flex flex-wrap gap-4">
              {/* 交易类型筛选 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">类型:</span>
                <div className="flex flex-wrap gap-2">
                  {transactionTypes.map((type) => (
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
              
              {/* 时间范围筛选 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">时间:</span>
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
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/30">
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">类型</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">金额</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">余额</th>
                <th className="pb-3 pr-6 pt-3 text-left text-sm font-medium text-slate-400">描述</th>
                <th className="pb-3 text-left text-sm font-medium text-slate-400">时间</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                    <td className="py-4 pr-6">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full bg-${getTransactionColor(transaction.type)}-500/20 flex items-center justify-center`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <span className="text-sm">{transaction.type}</span>
                      </div>
                    </td>
                    <td className={`py-4 pr-6 text-sm font-medium ${
                      transaction.type === '充值' || transaction.type === '收入' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === '充值' || transaction.type === '收入' ? '+' : '-'}{transaction.amount}
                    </td>
                    <td className="py-4 pr-6 text-sm">¥{transaction.balance}</td>
                    <td className="py-4 pr-6 text-sm">{transaction.description}</td>
                    <td className="py-4 text-sm text-slate-400">{transaction.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    暂无交易记录
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
              显示 {startIndex + 1} - {Math.min(endIndex, filteredTransactions.length)} 共 {filteredTransactions.length} 项
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
      <div className="mt-6 flex justify-end">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索交易记录..."
            className="w-48 rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>
    </>
  );

  return (
    <Layout activeRoute="/wallet">
      <WalletContent />
    </Layout>
  );
}