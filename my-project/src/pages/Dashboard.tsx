import { Camera, Sparkles, PawPrint, FileText, ImagePlus, TrendingUp, CalendarDays, Star, MapPin, Bell, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

const cities = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '重庆',
  '武汉', '西安', '长沙', '郑州', '青岛', '苏州', '天津', '合肥',
  '厦门', '福州', '宁波', '大连', '沈阳', '哈尔滨', '济南', '昆明'
];

export default function DashboardScreen() {
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem('selectedCity') || '北京';
  });
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCity', selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    if (authToken) {
      fetchUnreadCount();
    }
  }, [authToken]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const isAdmin = user?.role === 'admin';

  const mainFeatures = [
    {
      icon: <Star className="w-10 h-10" />,
      title: 'AI 创造记录',
      description: '今日已记录 3 项',
      color: 'from-purple-500 to-pink-500',
      gradient: 'from-purple-50 to-pink-50',
      action: '/record'
    },
    {
      icon: <Camera className="w-10 h-10" />,
      title: '照片分类',
      description: '本周新增 28 张',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-50 to-cyan-50',
      action: '/photos'
    },
    {
      icon: <PawPrint className="w-10 h-10" />,
      title: '宠物壁纸',
      description: '上传和审核',
      color: 'from-green-500 to-emerald-500',
      gradient: 'from-green-50 to-emerald-50',
      action: '/wallpaper-upload'
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: '备忘录',
      description: '5 条待办事项',
      color: 'from-orange-500 to-yellow-500',
      gradient: 'from-orange-50 to-yellow-50',
      action: '/memo'
    }
  ];

  const adminFeatures = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: '管理员审核',
      description: '审核用户提交的内容',
      color: 'from-indigo-500 to-purple-600',
      gradient: 'from-indigo-50 to-purple-100',
      action: '/admin-review'
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

  const bgImages = [
    'https://images.unsplash.com/photo-1732808460864-b8e5eb489a52?w=800',
    'https://images.unsplash.com/photo-1656741349015-3404ed142271?w=800',
    'https://images.unsplash.com/photo-1718885433034-908d5bca08cf?w=800',
    'https://images.unsplash.com/photo-1708037429826-de89ac0dd6c7?w=800'
  ];

  const adminBgImages = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
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
            <div className="flex items-center gap-2">
              <h2>功能大厅</h2>
              {isAdmin && (
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  管理员
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCitySelector(!showCitySelector)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm">{selectedCity}</span>
              </button>
              {showCitySelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto"
                >
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCitySelector(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                        city === selectedCity ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {/* Profile */}
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
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

        {/* Admin Features (only visible to admins) */}
        {isAdmin && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              管理员功能
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminFeatures.map((feature, index) => (
                <motion.button
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(feature.action)}
                  className="rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden border-2 border-purple-200"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${adminBgImages[index]})`,
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
          </div>
        )}

        {/* Main Features Grid */}
        <div>
          {isAdmin && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              用户功能
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainFeatures.map((feature, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => feature.action === '/photos' ? 
                  console.log(`Navigate to ${feature.action}`) : 
                  navigate(feature.action)}
                className="rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${bgImages[index]})`,
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
