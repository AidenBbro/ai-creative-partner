const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('Supabase client initialization error:', error);
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  // 支持 mock token
  if (token.startsWith('mock-token-') || token.startsWith('admin-token-')) {
    const userId = token.includes('admin-token-') ? 'admin-1' : '1';
    req.userId = userId;
    req.isAdmin = token.includes('admin-token-');
    return next();
  }

  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        notifications: notifications || []
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', req.userId)
      .eq('is_read', false);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        count: data?.length || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

router.post('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      message: '已标记为已读'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

router.post('/read-all', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', req.userId)
      .eq('is_read', false);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      message: '已标记全部为已读'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

module.exports = router;
