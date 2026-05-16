const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { initTables } = require('./config/supabase');
const usersRouter = require('./routes/users');
const recordsRouter = require('./routes/records');
const wallpaperUploadsRouter = require('./routes/wallpaper-uploads');
const notificationsRouter = require('./routes/notifications');
const memosRouter = require('./routes/memos');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Creative Partner API',
      version: '1.0.0',
      description: 'AI创意伙伴后端API文档 - 使用Supabase数据库'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发服务器'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Token认证'
        }
      }
    },
    tags: [
      { name: 'Users', description: '用户管理' },
      { name: 'Records', description: 'AI创作记录' },
      { name: 'Wallpaper Uploads', description: '壁纸上传与审核' },
      { name: 'Memos', description: '备忘录管理' },
      { name: 'Notifications', description: '消息通知' }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AI Creative Partner API'
}));

app.use('/api/users', usersRouter);
app.use('/api/records', recordsRouter);
app.use('/api/wallpaper-uploads', wallpaperUploadsRouter);
app.use('/api/memos', memosRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'Supabase'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '路由不存在'
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

const startServer = async () => {
  try {
    await initTables();
    
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 AI Creative Partner Backend is running!                  ║
║                                                               ║
║   🌐 API:         http://localhost:${PORT}                        ║
║   📚 API Docs:    http://localhost:${PORT}/api-docs               ║
║   🏥 Health Check: http://localhost:${PORT}/api/health              ║
║                                                               ║
║   📦 Database:    Supabase                                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
