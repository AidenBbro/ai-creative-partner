import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Image, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3000/api';

export default function WallpaperUploadPage() {
  const [title, setTitle] = useState('');
  const [uploads, setUploads] = useState<any[]>([]);
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
    fetchUploads();
  }, [navigate]);

  const fetchUploads = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/wallpaper-uploads/my-uploads`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUploads(data.data.uploads || []);
      }
    } catch (err) {
      console.error('获取上传记录失败:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('请填写壁纸标题');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/wallpaper-uploads/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim()
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setTitle('');
      setSuccess('提交成功！等待审核...');
      fetchUploads();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
            <Image className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-800">壁纸上传</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">上传新壁纸</h2>
          
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
                壁纸标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="给壁纸起个名字..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              {loading ? '提交中...' : '提交审核'}
            </button>
          </form>
        </motion.div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">我的上传记录</h2>
          
          {fetching ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">加载中...</p>
            </div>
          ) : uploads.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl p-8 shadow-sm">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">还没有上传过壁纸</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploads.map((upload, index) => (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <Image className="w-16 h-16 text-gray-300" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-800 truncate flex-1 mr-2">
                        {upload.title}
                      </h3>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                        {getStatusIcon(upload.status)}
                        {getStatusText(upload.status)}
                      </div>
                    </div>
                    {upload.status === 'rejected' && upload.reject_reason && (
                      <p className="text-sm text-red-500 text-xs">
                        原因：{upload.reject_reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(upload.created_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
