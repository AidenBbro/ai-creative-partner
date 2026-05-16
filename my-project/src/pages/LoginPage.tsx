import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // 普通用户
      if (username === '123' && password === '456') {
        const mockUser = {
          id: '1',
          username: '123',
          email: 'user@example.com',
          city: '北京',
          role: 'user'
        };
        localStorage.setItem('authToken', 'mock-token-123456');
        localStorage.setItem('user', JSON.stringify(mockUser));
        navigate('/dashboard');
      }
      // 管理员
      else if (username === '111' && password === '222') {
        const adminUser = {
          id: 'admin-1',
          username: '111',
          email: 'admin@example.com',
          city: '北京',
          role: 'admin'
        };
        localStorage.setItem('authToken', 'admin-token-111222');
        localStorage.setItem('user', JSON.stringify(adminUser));
        navigate('/dashboard');
      } else {
        throw new Error('用户名或密码错误');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
          <p className="text-gray-500 mt-2">登录 AI 创意伙伴</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="输入用户名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="输入密码"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-center text-gray-500 text-sm">
            🧑‍💼 用户账号：用户名 <code className="bg-gray-100 px-2 py-1 rounded">123</code> 密码 <code className="bg-gray-100 px-2 py-1 rounded">456</code>
          </p>
          <p className="text-center text-purple-600 text-sm flex items-center justify-center gap-1">
            <Shield className="w-4 h-4" />
            👑 管理员账号：用户名 <code className="bg-purple-100 px-2 py-1 rounded">111</code> 密码 <code className="bg-purple-100 px-2 py-1 rounded">222</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
