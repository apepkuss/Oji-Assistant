#!/bin/bash

# Oji 环境变量测试脚本
# 用于验证环境变量配置是否正确工作

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Oji 环境变量配置测试${NC}"
echo "=================================="

# 测试 1: 默认配置
echo -e "${YELLOW}测试 1: 默认配置${NC}"
echo "启动开发服务器（默认配置）..."
npm run dev &
DEV_PID=$!
sleep 3

echo "停止开发服务器..."
kill $DEV_PID 2>/dev/null || true
wait $DEV_PID 2>/dev/null || true

echo -e "${GREEN}✅ 默认配置测试完成${NC}"
echo ""

# 测试 2: 自定义环境变量
echo -e "${YELLOW}测试 2: 自定义环境变量${NC}"
echo "设置自定义 AI 服务配置..."
export AI_BASE_URL="http://localhost:9068/v1"
export AI_API_KEY="custom-api-key"

echo "启动开发服务器（自定义配置）..."
AI_BASE_URL="$AI_BASE_URL" AI_API_KEY="$AI_API_KEY" npm run dev &
DEV_PID=$!
sleep 3

echo "停止开发服务器..."
kill $DEV_PID 2>/dev/null || true
wait $DEV_PID 2>/dev/null || true

echo -e "${GREEN}✅ 自定义配置测试完成${NC}"
echo ""

# 测试 3: 构建测试
echo -e "${YELLOW}测试 3: 构建测试${NC}"
echo "使用自定义配置构建..."
AI_BASE_URL="http://localhost:9068/v1" AI_API_KEY="build-api-key" npm run build

echo -e "${GREEN}✅ 构建测试完成${NC}"
echo ""

echo -e "${BLUE}🎉 所有测试完成！${NC}"
echo ""
echo "使用方法："
echo "1. 默认启动: npm run dev"
echo "2. 自定义配置: AI_BASE_URL=http://localhost:9068/v1 AI_API_KEY=your-key npm run dev"
echo "3. 使用 .env 文件配置持久化设置"
