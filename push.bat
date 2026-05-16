@echo off
chcp 65001 >nul
echo ========================================
echo   GitHub 推送脚本
echo ========================================
echo.

cd /d "d:\Trae\父级"

echo [1/4] 检查 Git 配置...
"C:\Program Files\Git\cmd\git.exe" config --global user.name
"C:\Program Files\Git\cmd\git.exe" config --global user.email
echo.

echo [2/4] 检查远程仓库...
"C:\Program Files\Git\cmd\git.exe" remote -v
echo.

echo [3/4] 检查提交状态...
"C:\Program Files\Git\cmd\git.exe" status
echo.

echo [4/4] 推送到 GitHub...
echo.
echo 请输入你的 GitHub 用户名: 
set /p username=
echo 请输入你的 Personal Access Token（密码）:
"C:\Program Files\Git\cmd\git.exe" credential reject <<EOF
protocol=https
host=github.com
username=%username%
EOF

"C:\Program Files\Git\cmd\git.exe" push -u origin master

echo.
echo ========================================
echo 完成！请访问 https://github.com/%username%/ai-creative-partner
echo ========================================
pause
