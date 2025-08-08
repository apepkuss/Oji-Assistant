# Oji Web 版本部署指南

Oji 现在支持作为 Web 应用部署，用户可以通过浏览器访问完整的 AI 助手功能。

- [Oji Web 版本部署指南](#oji-web-版本部署指南)
  - [🌐 部署方式](#-部署方式)
    - [1. GitHub Pages 自动部署](#1-github-pages-自动部署)
    - [2. 手动部署](#2-手动部署)
      - [构建 Web 版本](#构建-web-版本)
      - [部署到任意 Web 服务器](#部署到任意-web-服务器)
    - [3. Docker 部署](#3-docker-部署)
      - [使用 Docker Compose（推荐）](#使用-docker-compose推荐)
      - [使用 Docker 命令](#使用-docker-命令)
    - [4. 静态文件服务器部署](#4-静态文件服务器部署)
      - [使用 Python](#使用-python)
      - [使用 Node.js serve](#使用-nodejs-serve)
      - [使用 nginx](#使用-nginx)
  - [⚙️ 配置](#️-配置)
    - [AI 服务配置](#ai-服务配置)
    - [跨域配置](#跨域配置)
      - [Express.js 示例](#expressjs-示例)
      - [Axum (Rust) 示例](#axum-rust-示例)
      - [🔍 验证 CORS 配置](#-验证-cors-配置)
        - [方法 1: 使用 Web 测试页面](#方法-1-使用-web-测试页面)
        - [方法 2: 使用命令行脚本](#方法-2-使用命令行脚本)
  - [🔧 环境变量](#-环境变量)
    - [构建时环境变量](#构建时环境变量)
    - [运行时环境变量](#运行时环境变量)
    - [Docker 部署中的环境变量](#docker-部署中的环境变量)
    - [使用 .env 文件](#使用-env-文件)
    - [优先级顺序](#优先级顺序)
    - [CI/CD 集成示例](#cicd-集成示例)
  - [📱 PWA 支持](#-pwa-支持)
  - [🛡️ 安全考虑](#️-安全考虑)
    - [HTTPS 部署](#https-部署)
    - [环境隔离](#环境隔离)
  - [🚀 性能优化](#-性能优化)
    - [启用 Gzip 压缩](#启用-gzip-压缩)
    - [CDN 部署](#cdn-部署)
  - [📊 监控](#-监控)
    - [日志记录](#日志记录)
    - [分析](#分析)
  - [🔄 更新部署](#-更新部署)
    - [自动更新](#自动更新)
    - [手动更新](#手动更新)
  - [🆘 故障排除](#-故障排除)
    - [常见问题](#常见问题)
    - [调试模式](#调试模式)

## 🌐 部署方式

### 1. GitHub Pages 自动部署

当创建新的 release tag 时，Web 版本会自动部署到 GitHub Pages：

- 访问地址：`https://apepkuss.github.io/Oji-Assistant`

### 2. 手动部署

#### 构建 Web 版本

```bash
npm run build:web
```

构建产物将生成在 `dist/` 目录中。

#### 部署到任意 Web 服务器

```bash
# 将 dist/ 目录内容复制到 Web 服务器
cp -r dist/* /path/to/webserver/root/
```

### 3. Docker 部署

#### 使用 Docker Compose（推荐）

```bash
# 启动服务
docker-compose up -d

# 访问 http://localhost:8080
```

#### 使用 Docker 命令

```bash
# 构建镜像
docker build -t oji-web .

# 运行容器
docker run -d -p 8080:80 oji-web

# 访问 http://localhost:8080
```

### 4. 静态文件服务器部署

#### 使用 Python

```bash
cd dist
python -m http.server 8080
# 访问 http://localhost:8080
```

#### 使用 Node.js serve

```bash
npx serve dist -p 8080
# 访问 http://localhost:8080
```

#### 使用 nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/oji/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## ⚙️ 配置

### AI 服务配置

Web 版本需要配置 AI 服务端点：

1. 打开 Oji Web 应用
2. 点击设置 ⚙️ 图标
3. 在 "Server" 标签页中配置：
   - **AI Service Base URL**: `http://your-ai-server:9068/v1`
   - **API Key**: （如果需要）

### 跨域配置

如果 AI 服务和 Web 应用在不同域名，需要在 AI 服务端配置 CORS：

#### Express.js 示例

```javascript
app.use(cors({
  origin: ['https://your-oji-domain.com', 'http://localhost:8080'],
  credentials: true
}));
```

#### Axum (Rust) 示例

```rust
use tower_http::cors::{Any, CorsLayer};
use http::Method;

let cors = CorsLayer::new()
    .allow_methods([Method::GET, Method::POST])
    .allow_headers(Any)
    .allow_origin(Any); // 开发环境使用，生产环境建议限制特定域名

let app = Router::new()
    .route("/v1/chat/completions", post(chat_handler))
    .layer(cors);
```

#### 🔍 验证 CORS 配置

我们提供了两种方式来验证您的 AI 服务 CORS 配置：

##### 方法 1: 使用 Web 测试页面

```bash
# 在项目根目录打开测试页面
open test-cors.html
# 或者在浏览器中访问: file:///path/to/oji/test-cors.html
```

##### 方法 2: 使用命令行脚本

```bash
# 运行 CORS 验证脚本
./scripts/test-cors.sh

# 或者手动指定服务地址
./scripts/test-cors.sh
# 然后输入您的 AI 服务 URL: http://localhost:9068/v1

# 测试 AI 服务连接性
./scripts/test-ai-service.sh
```

测试将验证：

- ✅ CORS 预检请求 (OPTIONS)
- ✅ 实际 API 调用 (POST)
- ✅ 流式响应支持
- ✅ 服务连接性

## 🔧 环境变量

Oji Web 版本支持两种环境变量配置方式：

### 构建时环境变量

在构建时设置这些变量会将配置固化到应用中：

```bash
# 配置默认的 AI 服务 URL
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1 npm run build:web

# 配置应用版本
VITE_APP_VERSION=1.0.0 npm run build:web

# 同时配置多个环境变量
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1 VITE_APP_VERSION=1.0.0 npm run build:web
```

**支持的构建时环境变量**：

- `VITE_DEFAULT_AI_SERVICE_BASE_URL`: 设置默认的 AI 服务端点 URL
- `VITE_APP_VERSION`: 设置应用版本（通常在 CI/CD 中自动设置）

### 运行时环境变量

运行时环境变量允许在启动应用时动态设置配置，优先级高于构建时设置：

```bash
# 开发模式使用自定义 AI 服务
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run dev

# 构建时使用自定义配置
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run build:web

# 预览时使用自定义配置
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run preview:web
```

**支持的运行时环境变量**：

- `AI_BASE_URL`: 设置默认的 AI 服务基础 URL
- `AI_API_KEY`: 设置默认的 API 密钥

### Docker 部署中的环境变量

在 Docker 环境中使用环境变量：

```bash
# 使用运行时环境变量构建
AI_BASE_URL=https://prod-ai.company.com/v1 AI_API_KEY=prod-key docker-compose up -d

# 或在 docker-compose.yml 中设置
```

```yaml
# docker-compose.yml 示例
version: '3.8'
services:
  oji-web:
    build: .
    ports:
      - "8080:80"
    environment:
      - AI_BASE_URL=https://prod-ai.company.com/v1
      - AI_API_KEY=your-production-key
```

### 使用 .env 文件

**使用 .env 文件**：

```bash
# 创建 .env 文件
echo "VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1" > .env
echo "AI_BASE_URL=http://your-ai-server:9068/v1" >> .env
echo "AI_API_KEY=your-api-key" >> .env

# 构建时会自动读取 .env 文件
npm run build:web
```

### 优先级顺序

环境变量的优先级（从高到低）：

1. **运行时环境变量** (`AI_BASE_URL`, `AI_API_KEY`) - 最高优先级
2. **构建时环境变量** (`VITE_DEFAULT_AI_SERVICE_BASE_URL`) - 中等优先级
3. **空值** (如果没有设置环境变量，默认为空，需要用户手动配置) - 最低优先级

### CI/CD 集成示例

```yaml
# GitHub Actions 示例
name: Deploy Oji Web
on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build with production settings
        run: |
          AI_BASE_URL=${{ secrets.PROD_AI_SERVICE_URL }} \
          AI_API_KEY=${{ secrets.PROD_AI_API_KEY }} \
          npm run build:web
        env:
          VITE_DEFAULT_AI_SERVICE_BASE_URL: ${{ secrets.PROD_AI_SERVICE_URL }}
```

*注意: 如果没有设置环境变量，应用的AI服务配置将为空，用户需要在应用设置中手动配置AI服务URL和API密钥。*

详细的环境变量使用说明请参考：[环境变量配置指南](./ENVIRONMENT_VARIABLES_ZH.md)

## 📱 PWA 支持

Oji Web 版本支持 Progressive Web App 功能：

- 可安装到桌面/主屏幕
- 离线缓存
- 类原生应用体验

用户可以在浏览器地址栏点击 "安装" 按钮将应用添加到桌面。

**注意**: 当前使用的是 `vite.svg` 作为应用图标。建议在 `public/` 目录中添加更合适的 PWA 图标（如 192x192 和 512x512 的 PNG 文件）以获得更好的用户体验。

## 🛡️ 安全考虑

### HTTPS 部署

生产环境建议使用 HTTPS：

```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # ... 其他配置
}
```

### 环境隔离

- 开发环境：`http://localhost:8080`
- 测试环境：`https://test.your-domain.com`
- 生产环境：`https://oji.your-domain.com`

## 🚀 性能优化

### 启用 Gzip 压缩

nginx 配置已包含 gzip 压缩配置，可显著减少传输大小。

### CDN 部署

可以将静态资源部署到 CDN 提高加载速度：

```bash
# 上传到 CDN 后更新 index.html 中的资源路径
# 或使用 Vite 的 base 配置
```

## 📊 监控

### 日志记录

Web 版本会在浏览器控制台记录关键操作和错误。

### 分析

可以集成 Google Analytics 或其他分析工具：

```html
<!-- 在 index.html 中添加分析代码 -->
```

## 🔄 更新部署

### 自动更新

通过 GitHub Actions 自动部署：

1. 创建新的 git tag：`git tag v1.0.1`
2. 推送 tag：`git push origin v1.0.1`
3. GitHub Actions 会自动构建和部署

### 手动更新

```bash
# 拉取最新代码
git pull origin main

# 重新构建
npm run build:web

# 重新部署
docker-compose up -d --build
```

## 🆘 故障排除

### 常见问题

1. **CORS 错误**
   - 检查 AI 服务的 CORS 配置
   - 确保允许 Web 应用的域名

2. **资源加载失败**
   - 检查 `base` 配置是否正确
   - 验证资源路径

3. **连接 AI 服务失败**
   - 验证 AI 服务是否正在运行
   - 检查网络连接和防火墙设置

### 调试模式

在浏览器开发者工具中查看：

- Network 标签页：检查网络请求
- Console 标签页：查看错误日志
- Application 标签页：检查 PWA 状态
