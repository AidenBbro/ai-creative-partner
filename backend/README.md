# AI Creative Partner Backend

基于 Node.js + Express + MySQL 的后端服务，提供用户管理、JWT 认证、AI 创作记录等功能，集成 Swagger 文档。

## 功能特性

- 用户注册/登录（JWT 认证）
- 用户信息 CRUD
- AI 创作记录 CRUD
- 自动记录地理位置和时间
- Swagger API 文档
- 数据库自动初始化

## 前置要求

- Node.js >= 14.0.0
- MySQL 5.7 或更高版本

## 快速开始

### 1. 配置数据库

首先确保 MySQL 服务已启动，然后修改 `.env` 文件中的数据库配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ai_creative_partner
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务启动后会自动创建数据库和表。

## 访问地址

- API 服务：http://localhost:3000
- API 文档：http://localhost:3000/api-docs
- 健康检查：http://localhost:3000/api/health

## API 端点

### 用户管理
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `DELETE /api/users/profile` - 删除用户账户

### AI 创作记录
- `POST /api/records` - 创建记录
- `GET /api/records` - 获取记录列表
- `GET /api/records/:id` - 获取单条记录
- `PUT /api/records/:id` - 更新记录
- `DELETE /api/records/:id` - 删除记录

所有需要认证的接口请在请求头中添加：
```
Authorization: Bearer <your_token>
```

## 项目结构

```
backend/
├── src/
│   ├── config/
│   │   └── database.js    # 数据库配置和初始化
│   ├── middleware/
│   │   └── auth.js        # JWT 认证中间件
│   ├── routes/
│   │   ├── users.js       # 用户路由
│   │   └── records.js     # AI 记录路由
│   └── server.js          # 主服务器
├── .env                   # 环境变量
├── .env.example           # 环境变量示例
├── package.json
└── README.md
```
