const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');

const router = express.Router();

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('用户名长度应在3-50个字符之间'),
  body('email').isEmail().normalizeEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6个字符')
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

    const { username, email, password, city } = req.body;

    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`);

    if (checkError) {
      throw checkError;
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          username, 
          email, 
          password: hashedPassword, 
          city: city || null 
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: userWithoutPassword,
        token
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

router.post('/login', [
  body('username').trim().notEmpty().withMessage('请输入用户名或邮箱'),
  body('password').notEmpty().withMessage('请输入密码')
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

    const { username, password } = req.body;

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`);

    if (error) {
      throw error;
    }

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token
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

router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, city, avatar, bio, created_at')
      .eq('id', decoded.userId);

    if (error) {
      throw error;
    }

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: users[0]
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

router.put('/profile', [
  body('username').optional().trim().isLength({ min: 3, max: 50 }),
  body('email').optional().isEmail().normalizeEmail()
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

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const { username, email, city, avatar, bio } = req.body;
    const updates = {};

    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (city !== undefined) updates.city = city;
    if (avatar !== undefined) updates.avatar = avatar;
    if (bio !== undefined) updates.bio = bio;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有要更新的字段'
      });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', decoded.userId)
      .select('id, username, email, city, avatar, bio, created_at')
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: '更新成功',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: '用户名或邮箱已被使用'
      });
    }
    res.status(500).json({
      success: false,
      message: '服务器错误: ' + error.message
    });
  }
});

router.delete('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', decoded.userId);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: '账户已删除'
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
