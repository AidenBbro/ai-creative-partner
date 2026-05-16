import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Sparkles, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecordData {
  content: string;
  city: string;
  date: string;
}

export default function RecordScreen() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<{ [key: number]: RecordData }>(() => {
    const saved = localStorage.getItem('aiRecords');
    return saved ? JSON.parse(saved) : {};
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentValue, setCurrentValue] = useState('');

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const getCurrentCity = () => {
    return localStorage.getItem('selectedCity') || '北京';
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setCurrentValue(records[id]?.content || '');
  };

  const handleSave = (id: number) => {
    const newRecords = {
      ...records,
      [id]: {
        content: currentValue,
        city: getCurrentCity(),
        date: getCurrentDate()
      }
    };
    setRecords(newRecords);
    localStorage.setItem('aiRecords', JSON.stringify(newRecords));
    setEditingId(null);
    setCurrentValue('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setCurrentValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2>AI 创造记录</h2>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          <div className="mb-6">
            <h3 className="mb-2">我的创作记录</h3>
            <p className="text-gray-600">点击任意一行开始记录你的AI创作时光</p>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(num * 0.01, 0.5) }}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                  editingId === num
                    ? 'bg-purple-50 shadow-md'
                    : records[num]
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 hover:shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* 序号 */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  records[num]
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-600'
                }`}>
                  {num}
                </div>

                {/* 内容区域 */}
                <div className="flex-1 min-w-0">
                  {editingId === num ? (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      placeholder="记录你的AI创作..."
                      className="w-full px-4 py-2 bg-white rounded-xl border-2 border-purple-300 focus:border-purple-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => handleEdit(num)}
                      className="cursor-pointer px-4 py-2 text-gray-700"
                    >
                      {records[num] ? (
                        <div>
                          <div className="font-medium truncate">{records[num].content}</div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {records[num].city}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {records[num].date}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-400">点击添加记录...</div>
                      )}
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                {editingId === num ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSave(num)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      保存
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                    >
                      取消
                    </button>
                  </div>
                ) : records[num] ? (
                  <button
                    onClick={() => handleEdit(num)}
                    className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800 transition-colors flex-shrink-0"
                  >
                    编辑
                  </button>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
