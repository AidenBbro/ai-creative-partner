import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, XCircle, Clock, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3000/api';

export default function MemoPage() {
  const [content, setContent] = useState('');
  const [memos, setMemos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMemos();
  }, [navigate]);

  const fetchMemos = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/memos/my-memos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMemos(data.data.memos || []);
      }
    } catch (err) {
      console.error('获取备忘录失败:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('请填写备忘录内容');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/memos/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content.trim()
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setContent('');
      setSuccess('提交成功！等待审核...');
      fetchMemos();
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已通过';
      case 'rejected':
        return '未通过';
      default:
        return '审核中';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl font-bold text-gray-800">备忘录</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">创建新备忘录</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                备忘录内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                placeholder="记录你的想法..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {loading ? '提交中...' : '提交审核'}
            </button>
          </form>
        </motion.div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">我的备忘录</h2>
          
          {fetching ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">加载中...</p>
            </div>
          ) : memos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl p-8 shadow-sm">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">还没有创建备忘录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {memos.map((memo, index) => (
                <motion.div
                  key={memo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-gray-800 whitespace-pre-wrap">{memo.content}</p>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ml-4 ${getStatusColor(memo.status)}`}>
                      {getStatusIcon(memo.status)}
                      {getStatusText(memo.status)}
                    </div>
                  </div>
                  {memo.status === 'rejected' && memo.reject_reason && (
                    <p className="text-sm text-red-500 mb-2">
                      原因：{memo.reject_reason}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(memo.created_at).toLocaleString('zh-CN')}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
