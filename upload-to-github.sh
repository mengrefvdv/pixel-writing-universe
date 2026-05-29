#!/bin/bash

# Pixel Writing Universe - Git 上传脚本
# 请在终端中执行此脚本

echo "🚀 开始上传 Pixel Writing Universe 到 GitHub..."
echo ""

# 1. 配置 Git 用户信息
echo "📝 配置 Git 用户信息..."
read -p "请输入您的 GitHub 用户名: " github_username
read -p "请输入您的 GitHub 邮箱: " github_email

git config --global user.name "$github_username"
git config --global user.email "$github_email"

# 2. 进入项目目录
cd /Users/qianyi/Documents/trae_projects/writing-app

# 3. 初始化 Git 仓库
echo "🔧 初始化 Git 仓库..."
git init

# 4. 添加远程仓库
echo "🔗 添加远程仓库..."
git remote add origin https://github.com/$github_username/pixel-writing-universe.git

# 5. 添加所有文件
echo "📦 添加文件到暂存区..."
git add .

# 6. 提交代码
echo "💾 提交代码..."
git commit -m "🎉 Initial commit: Pixel Writing Universe - 沉浸式像素风写作平台

✨ 功能亮点：
- 🏠 沉浸式3D房间场景
- ✍️ 写作编辑器与字数统计
- 🌿 植物成长系统（7种植物）
- 🐾 宠物陪伴系统（6种宠物）
- 🏆 成就系统（10个成就）
- 🎨 10+精美壁纸
- 🎨 8种编辑器主题（支持白色/黄色字体）
- 🌙 6种房间氛围
- 📚 SQLite数据库持久化存储
- 📖 React 18 + TypeScript + Flask 全栈开发"

# 7. 切换到 main 分支
echo "🌿 切换到 main 分支..."
git branch -M main

# 8. 推送到 GitHub
echo "🚀 推送到 GitHub..."
echo ""
echo "⚠️  首次推送需要输入 GitHub 用户名和密码/Token"
echo "💡 提示：如果使用 2FA，请在 GitHub Settings -> Developer settings 生成 Personal Access Token"
echo ""

git push -u origin main

echo ""
echo "✅ 上传完成！"
echo "🌐 请访问 https://github.com/$github_username/pixel-writing-universe 查看"
