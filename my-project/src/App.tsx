import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import DashboardScreen from './pages/Dashboard';
import RecordScreen from './pages/RecordScreen';
import ProfileScreen from './pages/ProfileScreen';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotificationsPage from './pages/NotificationsPage';
import WallpaperUploadPage from './pages/WallpaperUploadPage';
import MemoPage from './pages/MemoPage';
import AdminReviewPage from './pages/AdminReviewPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('authToken');
    return token ? <>{children}</> : <Navigate to="/login" replace />;
  };

  const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('authToken');
    return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col items-center justify-center p-6">
              <Header />
              <Home />
              <Footer />
            </div>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/record"
        element={
          <ProtectedRoute>
            <RecordScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallpaper-upload"
        element={
          <ProtectedRoute>
            <WallpaperUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/memo"
        element={
          <ProtectedRoute>
            <MemoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-review"
        element={
          <ProtectedRoute>
            <AdminReviewPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
