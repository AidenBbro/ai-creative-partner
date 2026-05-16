# GitHub 推送指南（两种方式）

## 方式一：HTTPS（推荐，无需配置密钥）

### 1. 更改远程仓库地址为 HTTPS
在 PowerShell 中执行：
```powershell
cd "d:\Trae\父级"
& "C:\Program Files\Git\cmd\git.exe" remote set-url origin https://github.com/AidenBbro/ai-creative-partner.git
```

### 2. 推送到 GitHub
```powershell
& "C:\Program Files\Git\cmd\git.exe" push -u origin master
```

### 3. 输入认证信息
- **Username**: `AidenBbro`
- **Password**: 使用 Personal Access Token（不是密码）

---

## 方式二：SSH（需要配置密钥）

### 1. 生成 SSH 密钥
在 PowerShell 中执行：
```powershell
& "C:\Program Files\Git\usr\bin\ssh-keygen.exe" -t ed25519 -C "aiden@example.com"
```
一路回车即可。

### 2. 复制公钥
```powershell
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub" | Clip
```

### 3. 在 GitHub 添加 SSH 密钥
1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴刚才复制的公钥
4. 保存

### 4. 测试连接
```powershell
& "C:\Program Files\Git\usr\bin\ssh.exe" -T git@github.com
```

### 5. 推送代码
```powershell
cd "d:\Trae\父级"
& "C:\Program Files\Git\cmd\git.exe" push -u origin master
```

---

## 如何获取 Personal Access Token（推荐使用 HTTPS）

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. Note: `Git Push`
4. 勾选权限: `repo`
5. 点击 "Generate token"
6. 立即复制 token（只显示一次！）
7. 使用这个 token 作为密码推送

---

## 当前状态
✅ Git 仓库已初始化  
✅ 文件已提交（64 个文件）  
✅ 远程仓库已设置  
⏳ 等待推送

---

## 快速开始（我已经帮你准备好了！）

你可以直接在 PowerShell 中执行：
```powershell
cd "d:\Trae\父级"

# 改用 HTTPS 方式
& "C:\Program Files\Git\cmd\git.exe" remote set-url origin https://github.com/AidenBbro/ai-creative-partner.git

# 推送
& "C:\Program Files\Git\cmd\git.exe" push -u origin master
```

输入：
- Username: `AidenBbro`
- Password: 你的 Personal Access Token
