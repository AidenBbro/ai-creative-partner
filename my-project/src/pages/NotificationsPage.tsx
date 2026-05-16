import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3000/api';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }
    fetchNotifications();
    fetchUnreadCount();
  }, [authToken, navigate]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const deleted = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (deleted && !deleted.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return '📋';
      case 'system':
      default:
        return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-800">消息通知</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              全部已读
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">加载中...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无消息通知</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-5 shadow-sm transition-all ${
                  !notification.is_read ? 'border-l-4 border-purple-500 bg-purple-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {formatDate(notification.created_at)}
                        </span>
                        <div className="flex items-center gap-1">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                              title="标记为已读"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{notification.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
