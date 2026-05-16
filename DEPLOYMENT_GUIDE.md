# 🌐 部署指南

## 📋 部署前准备

### 1. 更新代码到 GitHub
确保所有修改已提交：
```powershell
cd "d:\Trae\父级"
git add .
git commit -m "Prepare for deployment"
git push origin master
```

---

## 🚀 第一步：部署前端到 Vercel

### 1. 访问 Vercel
打开 https://vercel.com

### 2. 导入项目
- 点击「New Project」
- 选择你的 GitHub 仓库 `AidenBbro/ai-creative-partner`

### 3. 配置项目
- **Project Name**: `ai-creative-partner`
- **Root Directory**: 点击「Edit」→ 选择 `my-project/`

### 4. 添加环境变量
点击「Environment Variables」：
```
VITE_API_URL=https://your-backend.onrender.com/api
```
> ⚠️ 先不要填写，等后端部署后获取实际地址

### 5. 点击「Deploy」

---

## 🚀 第二步：部署后端到 Render

### 1. 访问 Render
打开 https://render.com

### 2. 创建 Web Service
- 点击「New → Web Service」
- 选择你的 GitHub 仓库 `AidenBbro/ai-creative-partner`

### 3. 配置项目
| 配置项 | 值 |
|--------|-----|
| **Name** | `ai-creative-partner-api` |
| **Region** | 选择离你近的区域 |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 4. 添加环境变量
```
PORT=10000
NODE_ENV=production
SUPABASE_URL=https://nzkqnlkonoczfdsvjfcf.supabase.co
SUPABASE_KEY=sb_publishable_P5KOnd--8h5izeZUBfrd4w_7bS0n99e
SUPABASE_ANON_KEY=sb_publishable_P5KOnd--8h5izeZUBfrd4w_7bS0n99e
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://ai-creative-partner.vercel.app
```
> 💡 CORS_ORIGIN 填写你的 Vercel 前端域名

### 5. 点击「Create Web Service」

### 6. 获取后端地址
部署成功后，地址类似：`https://ai-creative-partner-api.onrender.com`

---

## 🚀 第三步：配置前端环境变量

1. 返回 Vercel 项目设置
2. 更新环境变量：
```
VITE_API_URL=https://ai-creative-partner-api.onrender.com/api
```
3. 点击「Deploy」重新部署前端

---

## ✅ 验证部署

### 1. 测试前端
访问：`https://ai-creative-partner.vercel.app`

### 2. 测试 API
访问：`https://ai-creative-partner-api.onrender.com/api/health`

### 3. 测试功能
- 登录：账号 `123` / `456`
- 提交备忘录
- 管理员审核：账号 `111` / `222`

---

## 🔧 常见问题

### 问题 1：CORS 错误
**解决**：确保后端的 `CORS_ORIGIN` 包含前端域名

### 问题 2：API 请求失败
**解决**：检查 `VITE_API_URL` 是否正确

### 问题 3：数据库连接失败
**解决**：检查 Supabase 密钥是否正确

---

## 📁 项目结构

```
ai-creative-partner/
├── my-project/          # 前端（Vercel）
│   ├── src/
│   ├── .env.production
│   └── package.json
├── backend/             # 后端（Render）
│   ├── src/
│   ├── .env
│   └── package.json
└── README.md
```

---

## 🎉 完成！

部署成功后，你将拥有：
- ✅ 前端：`https://ai-creative-partner.vercel.app`
- ✅ 后端：`https://ai-creative-partner-api.onrender.com`
- ✅ 完整的备忘录审核功能

---

**最后一步**：更新 GitHub 上的代码
```powershell
git add .
git commit -m "Add deployment configuration"
git push origin master
```
