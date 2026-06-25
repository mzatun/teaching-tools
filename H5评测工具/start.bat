@echo off
chcp 65001 > nul
echo ================================
echo  青少年编程天赋测评H5工具
echo  爱创发明 定制版
echo ================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 16+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js 版本:
node -v

REM 进入后端目录
cd /d "%~dp0src\backend"

REM 检查依赖
if not exist "node_modules\" (
    echo.
    echo [安装] 首次运行，正在安装依赖（需要1-2分钟）...
    call npm install --no-optional
    if errorlevel 1 (
        echo [错误] 依赖安装失败，请检查网络后重试
        pause
        exit /b 1
    )
    echo [OK] 依赖安装完成
)

REM 确保 database 目录存在
if not exist "..\database\" mkdir "..\database"

echo.
echo [启动] 正在启动服务...
echo [访问] http://localhost:3000
echo [停止] 按 Ctrl+C 停止服务
echo.

call node app.js

pause
