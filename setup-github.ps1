# GitHub 推送配置脚本

# 请将以下信息替换为你的实际信息：
$githubUsername = "你的GitHub用户名"
$githubEmail = "你的GitHub邮箱"
$repoUrl = "https://github.com/$githubUsername/ai-creative-partner.git"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GitHub 推送配置脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. 配置 Git 用户信息
Write-Host "`n[1/5] 配置 Git 用户信息..." -ForegroundColor Yellow
& "C:\Program Files\Git\cmd\git.exe" config --global user.name $githubUsername
& "C:\Program Files\Git\cmd\git.exe" config --global user.email $githubEmail
Write-Host "✅ Git 用户信息已配置" -ForegroundColor Green

# 2. 添加所有文件
Write-Host "`n[2/5] 添加所有文件到 Git..." -ForegroundColor Yellow
& "C:\Program Files\Git\cmd\git.exe" add .
Write-Host "✅ 文件已添加到暂存区" -ForegroundColor Green

# 3. 提交代码
Write-Host "`n[3/5] 提交代码..." -ForegroundColor Yellow
$commitMessage = Read-Host "请输入提交信息（直接回车使用默认信息）"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit: AI创意伙伴前后端分离项目"
}
& "C:\Program Files\Git\cmd\git.exe" commit -m $commitMessage
Write-Host "✅ 代码已提交" -ForegroundColor Green

# 4. 添加远程仓库
Write-Host "`n[4/5] 添加远程仓库..." -ForegroundColor Yellow
& "C:\Program Files\Git\cmd\git.exe" remote remove origin 2>$null
& "C:\Program Files\Git\cmd\git.exe" remote add origin $repoUrl
Write-Host "✅ 远程仓库已添加: $repoUrl" -ForegroundColor Green

# 5. 推送到 GitHub
Write-Host "`n[5/5] 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "`n注意：推送时需要输入 GitHub 用户名和密码" -ForegroundColor Cyan
Write-Host "密码请使用 Personal Access Token，不是普通密码！" -ForegroundColor Red
Write-Host ""

& "C:\Program Files\Git\cmd\git.exe" push -u origin master

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  完成！🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n请访问你的仓库查看代码：" -ForegroundColor White
Write-Host $repoUrl -ForegroundColor Cyan
