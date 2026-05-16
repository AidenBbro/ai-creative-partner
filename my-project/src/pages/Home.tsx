// src/Home.tsx
import { Sparkles, Camera, PawPrint, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI 创造记录',
      description: '智能记录你每天用AI创造的精彩瞬间',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: '照片智能分类',
      description: '自动分类整理，AI帮你总结照片内容',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: <PawPrint className="w-8 h-8" />,
      title: '个性化壁纸',
      description: '可爱宠物壁纸，每天换个新心情',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: '便捷备忘录',
      description: '随时记录灵感，不错过任何想法',
      color: 'from-orange-400 to-yellow-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-12 px-6"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl shadow-lg text-white`}
        >
          <div className="mb-3">{feature.icon}</div>
          <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
          <p className="text-sm opacity-90">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
