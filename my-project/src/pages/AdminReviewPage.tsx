import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Clock, FileText, Image, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:3000/api';

export default function AdminReviewPage() {
  const [wallpaperUploads, setWallpaperUploads] = useState<any[]>([]);
  const [memos, setMemos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'memo'>('wallpaper');
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const [wallpaperRes, memoRes] = await Promise.all([
        fetch(`${API_URL}/wallpaper-uploads/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/memos/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const wallpaperData = await wallpaperRes.json();
      const memoData = await memoRes.json();

      if (wallpaperData.success) {
        setWallpaperUploads(wallpaperData.data?.uploads || []);
      }
      if (memoData.success) {
        setMemos(memoData.data?.memos || []);
      }
    } catch (err) {
      console.error('获取数据失败:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (type: 'wallpaper' | 'memo', id: string) => {
    setProcessingId(id);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = type === 'wallpaper' ? '/wallpaper-uploads' : '/memos';
      
      const response = await fetch(`${API_URL}${endpoint}/approve/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('审核通过！已发送通知给用户');
        fetchAllData();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('审核失败:', err);
      setError(err.message || '审核失败，请重试');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (type: 'wallpaper' | 'memo', id: string) => {
    const reason = prompt('请输入拒绝原因（可选）：');
    
    setProcessingId(id);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = type === 'wallpaper' ? '/wallpaper-uploads' : '/memos';
      
      const response = await fetch(`${API_URL}${endpoint}/reject/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: reason || '' })
      });

      const data = await response.json();

      if (data.success) {
        alert('已拒绝！已发送通知给用户');
        fetchAllData();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('拒绝失败:', err);
      setError(err.message || '操作失败，请重试');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingWallpapers = wallpaperUploads.filter(item => item.status === 'pending');
  const pendingMemos = memos.filter(item => item.status === 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            已通过
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <XCircle className="w-4 h-4" />
            已拒绝
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-4 h-4" />
            待审核
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-800">管理员审核</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex gap-4 bg-white rounded-2xl p-2 shadow-sm">
          <button
            onClick={() => setActiveTab('wallpaper')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'wallpaper'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Image className="w-5 h-5" />
            壁纸审核
            {pendingWallpapers.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {pendingWallpapers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('memo')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'memo'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            备忘录审核
            {pendingMemos.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {pendingMemos.length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'wallpaper' ? (
              <motion.div
                key="wallpaper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {pendingWallpapers.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">太棒了！没有待审核的壁纸</p>
                    <p className="text-gray-400 text-sm mt-2">所有壁纸都已审核完毕</p>
                  </div>
                ) : (
                  pendingWallpapers.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-6 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{item.title || '无标题'}</h3>
                            {getStatusBadge(item.status)}
                          </div>
                          {item.url && (
                            <div className="mb-3">
                              <img 
                                src={item.url} 
                                alt={item.title}
                                className="w-32 h-32 object-cover rounded-xl"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <p className="text-sm text-gray-500">
                            用户ID: {item.user_id || '未知'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            提交时间: {new Date(item.created_at).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleApprove('wallpaper', item.id)}
                            disabled={processingId === item.id}
                            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            通过
                          </button>
                          <button
                            onClick={() => handleReject('wallpaper', item.id)}
                            disabled={processingId === item.id}
                            className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                          >
                            <XCircle className="w-5 h-5" />
                            拒绝
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div
                key="memo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {pendingMemos.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl">
                    <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">太棒了！没有待审核的备忘录</p>
                    <p className="text-gray-400 text-sm mt-2">所有备忘录都已审核完毕</p>
                  </div>
                ) : (
                  pendingMemos.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-6 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">备忘录</h3>
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 mb-3">
                            <p className="text-gray-700 whitespace-pre-wrap">{item.content}</p>
                          </div>
                          <p className="text-sm text-gray-500">
                            用户ID: {item.user_id || '未知'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            提交时间: {new Date(item.created_at).toLocaleString('zh-CN')}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleApprove('memo', item.id)}
                            disabled={processingId === item.id}
                            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            通过
                          </button>
                          <button
                            onClick={() => handleReject('memo', item.id)}
                            disabled={processingId === item.id}
                            className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                          >
                            <XCircle className="w-5 h-5" />
                            拒绝
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
