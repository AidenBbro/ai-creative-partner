# GitHub 项目托管指南

## 项目结构

你的项目包含两个主要部分：
- **前端**：`my-project/` (React + TypeScript + Vite)
- **后端**：`backend/` (Node.js + Express + Supabase)

---

## 第一步：安装 Git

### Windows 用户：

1. 访问 https://git-scm.com/download/win
2. 下载 Git for Windows 安装程序
3. 运行安装程序，保持默认设置（直接点击 Next）
4. 安装完成后，打开 PowerShell 或 CMD
5. 验证安装：
   ```powershell
   git --version
   ```

---

## 第二步：在 GitHub 创建仓库

1. 访问 https://github.com
2. 登录你的 GitHub 账号
3. 点击右上角的 **+** 号，选择 **New repository**
4. 填写信息：
   - **Repository name**: `ai-creative-partner` (或其他名称)
   - **Description**: `AI创意伙伴 - 前后端分离应用`
   - **Public/Private**: 选择 Private（私有）或 Public（公开）
   - ✅ **不要**勾选 "Initialize this repository with a README"
5. 点击 **Create repository**
6. **重要**：复制仓库的 HTTPS 或 SSH URL，例如：
   ```
   https://github.com/你的用户名/ai-creative-partner.git
   ```

---

## 第三步：初始化 Git 并推送代码

在 PowerShell 或 CMD 中执行以下命令：

### 1. 进入项目目录
```powershell
cd "d:\Trae\父级"
```

### 2. 初始化 Git 仓库
```powershell
git init
```

### 3. 配置用户信息（如果还没配置）
```powershell
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

### 4. 创建 .gitignore 文件（如果不存在）
```powershell
# 复制 .gitignore 到根目录（如果 my-project 有的话）
copy my-project\.gitignore .gitignore
```

### 5. 添加所有文件
```powershell
git add .
```

### 6. 提交代码
```powershell
git commit -m "Initial commit: AI创意伙伴项目 - 前后端分离架构"
```

### 7. 添加远程仓库
```powershell
git remote add origin https://github.com/你的用户名/ai-creative-partner.git
```

### 8. 推送代码到 GitHub
```powershell
git push -u origin main
```

**提示**：如果出现分支名称错误，使用 `master` 而不是 `main`：
```powershell
git push -u origin master
```

---

## 第四步：验证托管成功

1. 打开浏览器访问你的 GitHub 仓库
2. 应该能看到所有代码文件
3. 检查是否有 `.gitignore` 中的文件被忽略（如 `node_modules`、`dist`）

---

## 常见问题与解决方案

### 问题 1：推送被拒绝

**错误信息**：
```
! [rejected] main -> main (fetch first)
error: failed to push some refs
```

**解决方案**：
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 问题 2：提示需要认证

**解决方案**：
1. 在 GitHub 中生成 Personal Access Token：
   - 进入 GitHub → Settings → Developer settings → Personal access tokens
   - 点击 Generate new token
   - 勾选 `repo` 权限
   - 复制生成的 token
2. 使用 token 作为密码：
   ```powershell
   git remote set-url origin https://你的用户名:你的token@github.com/你的用户名/仓库名.git
   ```

### 问题 3：文件未提交

**检查状态**：
```powershell
git status
```

**查看未跟踪文件**：
```powershell
git status --porcelain
```

---

## 项目文件说明

### 前端（my-project/）
```
my-project/
├── src/
│   ├── pages/          # 页面组件
│   ├── components/     # 通用组件
│   ├── App.tsx         # 主应用
│   └── main.tsx        # 入口文件
├── public/             # 静态资源
├── package.json        # 依赖配置
├── vite.config.ts      # Vite 配置
└── tailwind.config.js  # Tailwind CSS 配置
```

### 后端（backend/）
```
backend/
├── src/
│   ├── config/         # 配置文件
│   ├── routes/         # API 路由
│   ├── middleware/     # 中间件
│   └── server.js       # 服务器入口
├── .env                # 环境变量（包含密钥）
├── package.json        # 依赖配置
└── init-safe.sql      # 数据库初始化脚本
```

---

## 重要安全提示

⚠️ **不要将敏感信息提交到 GitHub**：

1. `.env` 文件包含：
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `JWT_SECRET`
   - 数据库连接信息

2. **解决方案**：
   - 将 `.env` 重命名为 `.env.example`
   - 创建一个新的 `.env` 文件（已在 .gitignore 中）
   - 在 README 中说明需要创建 `.env` 文件

3. **如果已提交敏感信息**：
   - 立即修改 Supabase 密钥
   - 使用 GitHub 的 "Remove sensitive data" 指南清除历史记录

---

## 后续维护

### 日常开发流程
```powershell
# 1. 确保在正确分支
git checkout main

# 2. 拉取最新代码
git pull origin main

# 3. 创建功能分支
git checkout -b feature/new-feature

# 4. 开发完成后提交
git add .
git commit -m "Add new feature"

# 5. 推送到远程
git push origin feature/new-feature

# 6. 在 GitHub 创建 Pull Request
```

### 克隆仓库到新电脑
```powershell
git clone https://github.com/你的用户名/ai-creative-partner.git
cd ai-creative-partner
npm install
# 创建 .env 文件
npm run dev
```

---

## 推荐的工作流程

1. **main 分支**：稳定版本，只接受通过 Pull Request 的合并
2. **develop 分支**：开发分支
3. **feature 分支**：新功能开发
4. **bugfix 分支**：修复 bug

---

## 完成清单

- [ ] 安装 Git
- [ ] 创建 GitHub 仓库
- [ ] 初始化本地 Git 仓库
- [ ] 配置 .gitignore
- [ ] 首次提交代码
- [ ] 推送到 GitHub
- [ ] 验证仓库内容
- [ ] 更新 README.md

---

祝编码愉快！🎉
