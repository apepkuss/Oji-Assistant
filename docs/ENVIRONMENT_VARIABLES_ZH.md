# Oji Web 版本环境变量配置

Oji Web 版本支持通过环境变量设置默认的 AI 服务配置。这些变量允许您预配置 AI 服务基础 URL 和 API 密钥，这些值将作为【Server Settings】页面中的默认值使用。

## 🚀 使用方法

### 开发模式

```bash
# 使用自定义 AI 服务设置启动开发服务器
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run dev

# 或者使用预定义脚本（需要先修改 package.json）
npm run dev:custom
```

### 构建模式

```bash
# 使用自定义 AI 服务设置构建
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run build

# 或者使用预定义脚本（需要先修改 package.json）
npm run build:web:custom
```

### 预览模式

```bash
# 使用自定义 AI 服务设置预览
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run preview

# 或者使用预定义脚本（需要先修改 package.json）
npm run preview:web:custom
```

## 📋 可用环境变量

### `AI_BASE_URL`

设置默认的 AI 服务基础 URL。

```bash
AI_BASE_URL=http://your-ai-server:9068/v1 npm run dev
```

### `AI_API_KEY`

设置 AI 服务的默认 API 密钥。

```bash
AI_API_KEY=your-api-key npm run dev
```

### 组合使用

```bash
# 同时使用两个变量
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run dev
```

## 🔄 优先级顺序

默认值按以下优先级确定（从高到低）：

1. **运行时环境变量** (`AI_BASE_URL`, `AI_API_KEY`)
2. **构建时环境变量** (`VITE_DEFAULT_AI_SERVICE_BASE_URL`)
3. **空值** (如果没有设置环境变量，默认为空，需要用户手动配置)

## 🌍 持久化环境变量

您可以创建 `.env` 文件进行持久化配置：

```env
# .env 文件
AI_BASE_URL=http://your-ai-server:9068/v1
AI_API_KEY=your-api-key
```

然后正常运行：

```bash
npm run dev
npm run build
npm run preview
```

## 📝 示例

### 示例 1：使用自定义服务器进行开发

```bash
# 使用远程 AI 服务启动开发
AI_BASE_URL=https://api.your-company.com/ai/v1 AI_API_KEY=sk-1234567890abcdef npm run dev
```

### 示例 2：生产环境构建

```bash
# 为生产部署构建，使用特定的 AI 服务
AI_BASE_URL=https://ai-prod.your-company.com/v1 AI_API_KEY=sk-prod-key-here npm run build
```

### 示例 3：测试不同服务

```bash
# 测试服务 A
AI_BASE_URL=http://service-a:9068/v1 npm run dev

# 测试服务 B
AI_BASE_URL=http://service-b:8080/api/v1 AI_API_KEY=service-b-key npm run dev
```

## ⚠️ 重要说明

1. **环境变量只影响默认值**：这些环境变量只设置【Server Settings】页面中的默认值。用户仍然可以在应用程序中手动更改这些设置。

2. **环境变量更安全**：与命令行参数相比，环境变量不会在进程列表中显示。对于生产部署，建议使用 `.env` 文件或 CI/CD 系统的环境变量功能。

3. **仅适用于 Web 版本**：这些环境变量仅对 Web 版本有效，不适用于 Electron 桌面版本。

4. **设置持久化**：当用户在应用程序中保存设置时，这些保存的设置将覆盖环境变量默认值。

## 🔒 安全考虑

- 环境变量比命令行参数更安全，不会在系统进程列表中显示
- 对敏感数据使用 `.env` 文件或 CI/CD 系统的环境变量功能
- 考虑在自动化部署中使用 CI/CD 管道密钥
- 避免在共享环境中直接设置包含敏感信息的环境变量

## 🚀 CI/CD 集成

对于自动化部署，您可以在 CI/CD 管道中集成这些环境变量：

```yaml
# GitHub Actions 示例
- name: 使用自定义设置构建 Oji
  run: |
    AI_BASE_URL=${{ secrets.AI_SERVICE_URL }} \
    AI_API_KEY=${{ secrets.AI_API_KEY }} \
    npm run build
  env:
    AI_BASE_URL: ${{ secrets.AI_SERVICE_URL }}
    AI_API_KEY: ${{ secrets.AI_API_KEY }}
```

```bash
# Docker 构建示例
docker build \
  --build-arg AI_BASE_URL=https://ai.your-company.com/v1 \
  --build-arg AI_API_KEY=your-api-key \
  -t oji-web .
```

## 🔧 在 package.json 中自定义脚本

您可以在 `package.json` 中创建自定义脚本：

```json
{
  "scripts": {
    "dev:myserver": "AI_BASE_URL=http://my-ai-server:9068/v1 AI_API_KEY=my-key vite",
    "build:production": "AI_BASE_URL=https://prod-ai.company.com/v1 AI_API_KEY=prod-key vite build",
    "dev:local": "AI_BASE_URL=http://localhost:8080/v1 vite"
  }
}
```

然后使用：

```bash
npm run dev:myserver
npm run build:production
npm run dev:local
```
