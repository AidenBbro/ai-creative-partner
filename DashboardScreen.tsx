import { Camera, Sparkles, PawPrint, FileText, ImagePlus, TrendingUp, CalendarDays, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const mainFeatures = [
    {
      icon: <Star className="w-10 h-10" />,
      title: 'AI 创造记录',
      description: '今日已记录 3 项',
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-50 to-pink-50',
      action: 'record'
    },
    {
      icon: <Camera className="w-10 h-10" />,
      title: '照片分类',
      description: '本周新增 28 张',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-50 to-cyan-50',
      action: 'photos'
    },
    {
      icon: <PawPrint className="w-10 h-10" />,
      title: '宠物壁纸',
      description: '探索新壁纸',
      color: 'from-green-500 to-emerald-500',
      gradient: 'from-green-50 to-emerald-50',
      action: 'wallpaper'
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: '备忘录',
      description: '5 条待办事项',
      color: 'from-orange-500 to-yellow-500',
      gradient: 'from-orange-50 to-yellow-50',
      action: 'memo'
    }
  ];

  const quickStats = [
    { label: '本周创作', value: '12', icon: <TrendingUp className="w-5 h-5" /> },
    { label: '总照片数', value: '186', icon: <ImagePlus className="w-5 h-5" /> },
    { label: '连续打卡', value: '7天', icon: <CalendarDays className="w-5 h-5" /> },
  ];

  const recentActivities = [
    { title: '生成了一篇产品文案', time: '2 小时前', type: 'ai' },
    { title: '添加了 5 张旅行照片', time: '5 小时前', type: 'photo' },
    { title: '更换了宠物猫咪壁纸', time: '昨天', type: 'wallpaper' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2>功能大厅</h2>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white shadow-md"
          >
            我
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-md"
            >
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                {stat.icon}
                <span className="text-sm">{stat.label}</span>
              </div>
              <div className="font-medium text-gray-900">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainFeatures.map((feature, index) => (
            <motion.button
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => feature.action === 'record' ? onNavigate('record') : console.log(`Navigate to ${feature.action}`)}
              className="rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${
                  index === 0 ? 'https://images.unsplash.com/photo-1732808460864-b8e5eb489a52?w=800' :
                  index === 1 ? 'https://images.unsplash.com/photo-1656741349015-3404ed142271?w=800' :
                  index === 2 ? 'https://images.unsplash.com/photo-1718885433034-908d5bca08cf?w=800' :
                  'https://images.unsplash.com/photo-1708037429826-de89ac0dd6c7?w=800'
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3>最近活动</h3>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'ai' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'photo' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {activity.type === 'ai' ? <Sparkles className="w-5 h-5" /> :
                   activity.type === 'photo' ? <Camera className="w-5 h-5" /> :
                   <PawPrint className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="text-gray-900">{activity.title}</div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
