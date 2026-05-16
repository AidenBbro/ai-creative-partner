import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import DashboardScreen from './pages/Dashboard';
import RecordScreen from './pages/RecordScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'dashboard' | 'record' | 'profile'>('welcome');

  const handleGetStarted = () => {
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: 'welcome' | 'dashboard' | 'record' | 'profile') => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col items-center justify-center p-6">
              <Header />
              <Home />
              <Footer onGetStarted={handleGetStarted} />
            </div>
          </motion.div>
        )}

        {currentScreen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardScreen onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentScreen === 'record' && (
          <motion.div
            key="record"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RecordScreen onNavigate={handleNavigate} />
          </motion.div>
        )}

        {currentScreen === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfileScreen onNavigate={handleNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
