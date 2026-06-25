#!/bin/bash

# 青少年编程天赋测评H5工具 - 启动脚本
# 爱创发明定制版
# 创建时间: 2026-05-05

echo "🚀 正在启动青少年编程天赋测评H5工具..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到Node.js，请先安装Node.js 16+"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"

# 进入后端目录
cd "$(dirname "$0")/src/backend" 2>/dev/null || cd src/backend

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
fi

# 检查数据库
if [ ! -f "../database/assessment.db" ]; then
    echo "🗄️  首次运行，正在初始化数据库..."
    sqlite3 ../database/assessment.db < ../database/schema.sql
    if [ $? -ne 0 ]; then
        echo "❌ 数据库初始化失败"
        exit 1
    fi
    echo "✅ 数据库初始化完成"
fi

# 启动服务
echo ""
echo "🎯 启动服务中..."
echo "📍 访问地址: http://localhost:3000"
echo "🛑 停止服务: 按 Ctrl+C"
echo ""

node app.js
