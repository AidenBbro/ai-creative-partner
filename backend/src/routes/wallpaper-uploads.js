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

/**
 * @swagger
 * tags:
 *   name: Wallpaper Uploads
 *   description: 壁纸上传与审核
 */

/**
 * @swagger
 * /api/wallpaper-uploads/upload:
 *   post:
 *     summary: 上传壁纸并提交审核
 *     tags: [Wallpaper Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: '壁纸标题不能为空'
      });
    }

    const { data: newUpload, error } = await supabase
      .from('wallpaper_uploads')
      .insert([
        {
          user_id: req.userId,
          url: '',
          title: title.trim(),
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    await supabase
      .from('notifications')
      .insert([
        {
          user_id: req.userId,
          title: '壁纸上传成功',
          content: '您的壁纸已上传，正在等待审核，请耐心等待。',
          type: 'system'
        }
      ]);

    res.status(201).json({
      success: true,
      message: '壁纸上传成功，正在等待审核',
      data: {
        upload: newUpload
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

/**
 * @swagger
 * /api/wallpaper-uploads/my-uploads:
 *   get:
 *     summary: 获取我的壁纸上传记录
 *     tags: [Wallpaper Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-uploads', authenticateToken, async (req, res) => {
  try {
    const { data: uploads, error } = await supabase
      .from('wallpaper_uploads')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        uploads: uploads || [],
        pagination: {
          page: 1,
          limit: 100,
          total: uploads?.length || 0,
          totalPages: 1
        }
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

/**
 * @swagger
 * /api/wallpaper-uploads/all:
 *   get:
 *     summary: 获取所有壁纸上传记录（管理员用）
 *     tags: [Wallpaper Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const { data: uploads, error } = await supabase
      .from('wallpaper_uploads')
      .select('*, users(username, avatar)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        uploads: uploads || [],
        pagination: {
          page: 1,
          limit: 100,
          total: uploads?.length || 0,
          totalPages: 1
        }
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

/**
 * @swagger
 * /api/wallpaper-uploads/approve/{id}:
 *   post:
 *     summary: 审核通过壁纸
 *     tags: [Wallpaper Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.post('/approve/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: upload, error: fetchError } = await supabase
      .from('wallpaper_uploads')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: '上传记录不存在'
      });
    }

    const { error: updateError } = await supabase
      .from('wallpaper_uploads')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    await supabase
      .from('notifications')
      .insert([
        {
          user_id: upload.user_id,
          title: '壁纸审核通过',
          content: '恭喜！您上传的壁纸审核通过，已正式发布。',
          type: 'approval'
        }
      ]);

    res.json({
      success: true,
      message: '审核通过'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/wallpaper-uploads/reject/{id}:
 *   post:
 *     summary: 审核拒绝壁纸
 *     tags: [Wallpaper Uploads]
 *     security:
 *       - bearerAuth: []
 */
router.post('/reject/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { data: upload, error: fetchError } = await supabase
      .from('wallpaper_uploads')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: '上传记录不存在'
      });
    }

    const { error: updateError } = await supabase
      .from('wallpaper_uploads')
      .update({
        status: 'rejected',
        reject_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    const notificationContent = reason
      ? `很抱歉，您上传的壁纸未通过审核。原因：${reason}`
      : '很抱歉，您上传的壁纸未通过审核。';

    await supabase
      .from('notifications')
      .insert([
        {
          user_id: upload.user_id,
          title: '壁纸审核未通过',
          content: notificationContent,
          type: 'approval'
        }
      ]);

    res.json({
      success: true,
      message: '已拒绝该壁纸'
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
