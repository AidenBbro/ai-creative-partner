const express = require('express');
const { body, validationResult, query } = require('express-validator');
const jwt = require('jsonwebtoken');
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

router.post('/', authenticateToken, [
  body('content').trim().notEmpty().withMessage('内容不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { content, city, record_date } = req.body;
    const date = record_date || new Date().toISOString().split('T')[0];

    const { data: newRecord, error } = await supabase
      .from('ai_records')
      .insert([
        { 
          user_id: req.userId, 
          content, 
          city: city || null, 
          record_date: date 
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: '创建成功',
      data: {
        record: newRecord
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

router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('每页数量必须在1-100之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const city = req.query.city;
    const offset = (page - 1) * limit;

    let queryBuilder = supabase
      .from('ai_records')
      .select('*', { count: 'exact' })
      .eq('user_id', req.userId)
      .order('record_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (city) {
      queryBuilder = queryBuilder.eq('city', city);
    }

    const { data: records, error, count } = await queryBuilder;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
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

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: records, error } = await supabase
      .from('ai_records')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) {
      throw error;
    }

    if (!records || records.length === 0) {
      return res.status(404).json({
        success: false,
        message: '记录不存在'
      });
    }

    res.json({
      success: true,
      data: {
        record: records[0]
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

router.put('/:id', authenticateToken, [
  body('content').optional().trim().notEmpty().withMessage('内容不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { content, city, record_date } = req.body;
    const updates = {};

    if (content !== undefined) updates.content = content;
    if (city !== undefined) updates.city = city;
    if (record_date !== undefined) updates.record_date = record_date;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有要更新的字段'
      });
    }

    const { data: updatedRecord, error } = await supabase
      .from('ai_records')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: '记录不存在'
      });
    }

    res.json({
      success: true,
      message: '更新成功',
      data: {
        record: updatedRecord
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

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('ai_records')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);

    if (error) {
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
