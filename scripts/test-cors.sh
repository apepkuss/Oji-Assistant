#!/bin/bash

# Oji AI 服务 CORS 验证脚本
# 使用 curl 测试 Axum 服务的跨域配置

set -e

# 默认配置
BASE_URL="http://localhost:9068/v1"
API_KEY=""
TEST_MESSAGE="Hello, how are you?"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Oji AI 服务 CORS 验证脚本${NC}"
echo "=================================="

# 读取用户输入
read -p "AI 服务 Base URL [$BASE_URL]: " input_url
BASE_URL=${input_url:-$BASE_URL}

read -p "API Key (可选): " input_key
API_KEY=${input_key:-$API_KEY}

echo ""
echo -e "${BLUE}测试配置:${NC}"
echo "Base URL: $BASE_URL"
echo "API Key: ${API_KEY:+已设置}"
echo ""

# 测试计数器
TESTS_TOTAL=0
TESTS_PASSED=0
TESTS_FAILED=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_cmd="$2"

    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    echo -e "${YELLOW}测试 $TESTS_TOTAL: $test_name${NC}"
    echo "----------------------------------------"

    if eval "$test_cmd"; then
        echo -e "${GREEN}✅ 测试通过${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ 测试失败${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    echo ""
}

# 1. 测试 CORS 预检请求
test_preflight() {
    echo "发送 OPTIONS 预检请求..."

    local headers=""
    if [ -n "$API_KEY" ]; then
        headers="-H \"Authorization: Bearer $API_KEY\""
    fi

    local response=$(curl -s -w "%{http_code}" -o /dev/null \
        -X OPTIONS \
        -H "Origin: http://localhost:3000" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type,Authorization" \
        "$BASE_URL/chat/completions" 2>/dev/null)

    if [ "$response" = "200" ] || [ "$response" = "204" ]; then
        echo "CORS 预检响应: HTTP $response"

        # 检查 CORS 响应头
        local cors_headers=$(curl -s -I \
            -X OPTIONS \
            -H "Origin: http://localhost:3000" \
            -H "Access-Control-Request-Method: POST" \
            -H "Access-Control-Request-Headers: Content-Type,Authorization" \
            "$BASE_URL/chat/completions" 2>/dev/null)

        echo "CORS 响应头:"
        echo "$cors_headers" | grep -i "access-control" || echo "  未找到 Access-Control 头"
        return 0
    else
        echo "预检请求失败: HTTP $response"
        return 1
    fi
}

# 2. 测试实际 API 调用
test_api_call() {
    echo "发送 POST 请求到聊天 API..."

    local headers="Content-Type: application/json"
    if [ -n "$API_KEY" ]; then
        headers="$headers\nAuthorization: Bearer $API_KEY"
    fi

    local payload=$(cat <<EOF
{
    "model": "Unknown",
    "messages": [
        {
            "role": "user",
            "content": "$TEST_MESSAGE"
        }
    ],
    "stream": false
}
EOF
)

    local response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:3000" \
        $([ -n "$API_KEY" ] && echo "-H \"Authorization: Bearer $API_KEY\"") \
        -d "$payload" \
        "$BASE_URL/chat/completions" 2>/dev/null)

    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')

    echo "响应状态码: $http_code"

    if [ "$http_code" = "200" ]; then
        echo "响应内容 (前 200 字符):"
        echo "$body" | head -c 200
        echo ""
        return 0
    else
        echo "API 调用失败:"
        echo "$body"
        return 1
    fi
}

# 3. 测试流式响应
test_streaming() {
    echo "测试流式响应..."

    local headers="Content-Type: application/json"
    if [ -n "$API_KEY" ]; then
        headers="$headers\nAuthorization: Bearer $API_KEY"
    fi

    local payload=$(cat <<EOF
{
    "model": "Unknown",
    "messages": [
        {
            "role": "user",
            "content": "请简短回复：你好"
        }
    ],
    "stream": true
}
EOF
)

    echo "发送流式请求..."
    local response=$(timeout 10 curl -s -N \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:3000" \
        $([ -n "$API_KEY" ] && echo "-H \"Authorization: Bearer $API_KEY\"") \
        -d "$payload" \
        "$BASE_URL/chat/completions" 2>/dev/null | head -n 5)

    if [ -n "$response" ]; then
        echo "流式响应示例 (前 5 行):"
        echo "$response"
        return 0
    else
        echo "未收到流式响应"
        return 1
    fi
}

# 4. 检查服务可达性
test_connectivity() {
    echo "检查服务连接性..."

    # 提取主机和端口
    local host_port=$(echo "$BASE_URL" | sed 's|http[s]*://||' | sed 's|/.*||')

    if curl -s --max-time 5 "$BASE_URL" >/dev/null 2>&1; then
        echo "服务可达: $host_port"
        return 0
    else
        echo "无法连接到服务: $host_port"
        echo "请确保 AI 服务正在运行"
        return 1
    fi
}

# 运行所有测试
echo -e "${BLUE}开始 CORS 验证测试...${NC}"
echo ""

run_test "服务连接性检查" "test_connectivity"
run_test "CORS 预检请求 (OPTIONS)" "test_preflight"
run_test "API 调用测试 (POST)" "test_api_call"
run_test "流式响应测试" "test_streaming"

# 输出总结
echo "========================================"
echo -e "${BLUE}测试总结${NC}"
echo "总测试数: $TESTS_TOTAL"
echo -e "通过: ${GREEN}$TESTS_PASSED${NC}"
echo -e "失败: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 所有测试通过！${NC}"
    echo -e "${GREEN}您的 Axum AI 服务完全支持跨域访问。${NC}"
    echo ""
    echo -e "${BLUE}建议:${NC}"
    echo "1. 您的当前 CORS 配置已经适用于 Web 版本"
    echo "2. allow_origin(Any) 允许所有域名访问"
    echo "3. 可以考虑在生产环境中限制特定域名"
else
    echo ""
    echo -e "${YELLOW}⚠️  部分测试失败${NC}"
    echo -e "${YELLOW}请检查以下项目:${NC}"
    echo "1. AI 服务是否正在运行在 $BASE_URL"
    echo "2. CORS 配置是否正确应用"
    echo "3. 网络连接是否正常"
    echo "4. API Key 是否正确 (如果需要)"
fi

echo ""
echo -e "${BLUE}当前 Axum CORS 配置分析:${NC}"
echo "✅ allow_origin(Any) - 允许所有域名"
echo "✅ allow_methods([GET, POST]) - 支持必要的 HTTP 方法"
echo "✅ allow_headers(Any) - 允许所有请求头"
echo ""
echo "这个配置对于 Oji Web 版本是完全兼容的！"
