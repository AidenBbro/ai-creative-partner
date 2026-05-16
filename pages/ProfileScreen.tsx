import { User, Settings, Trophy, Image, Calendar, Heart, ChevronRight, LogOut, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const userStats = [
    { label: 'AI 创作', value: '48', icon: <Trophy className="w-6 h-6" />, color: 'from-purple-400 to-pink-400' },
    { label: '照片集', value: '186', icon: <Image className="w-6 h-6" />, color: 'from-blue-400 to-cyan-400' },
    { label: '打卡天数', value: '32', icon: <Calendar className="w-6 h-6" />, color: 'from-green-400 to-emerald-400' },
    { label: '收藏壁纸', value: '12', icon: <Heart className="w-6 h-6" />, color: 'from-orange-400 to-yellow-400' },
  ];

  const settingsItems = [
    { icon: <User className="w-5 h-5" />, label: '个人资料', color: 'bg-blue-100 text-blue-600' },
    { icon: <Bell className="w-5 h-5" />, label: '消息通知', color: 'bg-purple-100 text-purple-600' },
    { icon: <Settings className="w-5 h-5" />, label: '应用设置', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回
          </button>
          <h2>我的信息</h2>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-8 shadow-lg text-center"
        >
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="mb-1">AI 探索者</h2>
          <p className="text-gray-500 mb-4">探索AI的无限可能</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>加入于 2026年4月</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {userStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                {stat.icon}
              </div>
              <div className="mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 shadow-lg text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="mb-1">连续创作达人</h3>
              <p className="text-sm opacity-90">已连续打卡 7 天，继续保持！</p>
            </div>
          </div>
        </motion.div>

        {/* Settings List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {settingsItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                {item.icon}
              </div>
              <span className="flex-1 text-left text-gray-900">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </motion.button>
      </div>
    </div>
  );
}
