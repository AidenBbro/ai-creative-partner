import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="py-8 text-center"
    >
      <button
        onClick={() => navigate('/login')}
        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        开始使用
      </button>
    </motion.footer>
  );
}
