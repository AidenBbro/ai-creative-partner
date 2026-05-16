// src/Header.tsx
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center py-8"
    >
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        AI 创意伙伴
      </h1>
    </motion.header>
  );
}
