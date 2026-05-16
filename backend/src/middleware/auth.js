const jwt = require('jsonwebtoken');

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
    // 解析 mock token
    const userId = token.includes('admin-token-') ? 'admin-1' : '1';
    req.userId = userId;
    req.isAdmin = token.includes('admin-token-');
    return next();
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

module.exports = authenticateToken;
