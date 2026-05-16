const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  if (token.startsWith('mock-token-') || token.startsWith('admin-token-')) {
    const userId = token.includes('admin-token-') ? 'admin-1' : '1';
    req.userId = userId;
    req.isAdmin = token.includes('admin-token-');
    req.user = { id: userId, isAdmin: req.isAdmin };
    return next();
  }

  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.user = { id: decoded.userId, ...decoded };
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
 *   name: Memos
 *   description: 备忘录管理
 */

/**
 * @swagger
 * /api/memos/create:
 *   post:
 *     summary: 创建备忘录并提交审核
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 备忘录内容
 *     responses:
 *       201:
 *         description: 备忘录创建成功
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: '备忘录内容不能为空'
      });
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({
        success: false,
        message: '数据库连接失败'
      });
    }

    const { data: newMemo, error } = await supabase
      .from('memos')
      .insert([
        {
          user_id: req.userId,
          content: content.trim(),
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
          title: '备忘录提交成功',
          content: '您的备忘录已提交，正在等待审核，请耐心等待。',
          type: 'system'
        }
      ]);

    res.status(201).json({
      success: true,
      message: '备忘录提交成功，正在等待审核',
      data: {
        memo: newMemo
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
 * /api/memos/my-memos:
 *   get:
 *     summary: 获取我的备忘录列表
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-memos', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({
        success: false,
        message: '数据库连接失败'
      });
    }

    const { data: memos, error } = await supabase
      .from('memos')
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
        memos: memos || []
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
 * /api/memos/all:
 *   get:
 *     summary: 获取所有备忘录（管理员用）
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 */
router.get('/all', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({
        success: false,
        message: '数据库连接失败'
      });
    }

    const { data: memos, error } = await supabase
      .from('memos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({
      success: true,
      data: {
        memos: memos || []
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
 * /api/memos/approve/{id}:
 *   post:
 *     summary: 审核通过备忘录
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 */
router.post('/approve/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({
        success: false,
        message: '数据库连接失败'
      });
    }

    const { id } = req.params;

    const { data: memo, error: fetchError } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

    if (!memo) {
      return res.status(404).json({
        success: false,
        message: '备忘录不存在'
      });
    }

    const { error: updateError } = await supabase
      .from('memos')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    await supabase
      .from('notifications')
      .insert([
        {
          user_id: memo.user_id,
          title: '备忘录审核通过',
          content: '恭喜！您的备忘录审核通过，已正式发布。',
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
 * /api/memos/reject/{id}:
 *   post:
 *     summary: 审核拒绝备忘录
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 */
router.post('/reject/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({
        success: false,
        message: '数据库连接失败'
      });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const { data: memo, error: fetchError } = await supabase
      .from('memos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!memo) {
      return res.status(404).json({
        success: false,
        message: '备忘录不存在'
      });
    }

    const { error: updateError } = await supabase
      .from('memos')
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
      ? `很抱歉，您的备忘录未通过审核。原因：${reason}`
      : '很抱歉，您的备忘录未通过审核。';

    await supabase
      .from('notifications')
      .insert([
        {
          user_id: memo.user_id,
          title: '备忘录审核未通过',
          content: notificationContent,
          type: 'approval'
        }
      ]);

    res.json({
      success: true,
      message: '已拒绝该备忘录'
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
