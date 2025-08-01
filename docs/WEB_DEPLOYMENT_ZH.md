# Oji Web 版本部署指南

Oji 现在支持作为 Web 应用部署，用户可以通过浏览器访问完整的 AI 助手功能。

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

Oji Web 版本支持通过环境变量配置默认设置。在构建时设置这些变量：

```bash
# 配置默认的 AI 服务 URL
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1 npm run build:web

# 配置应用版本
VITE_APP_VERSION=1.0.0 npm run build:web

# 同时配置多个环境变量
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1 VITE_APP_VERSION=1.0.0 npm run build:web
```

**支持的环境变量**：

- `VITE_DEFAULT_AI_SERVICE_BASE_URL`: 设置默认的 AI 服务端点 URL
- `VITE_APP_VERSION`: 设置应用版本（通常在 CI/CD 中自动设置）

**使用 .env 文件**：

```bash
# 创建 .env 文件
echo "VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1" > .env

# 构建时会自动读取 .env 文件
npm run build:web
```

*注意: 如果没有设置环境变量，应用会使用默认值 `http://localhost:9068/v1`。用户仍然可以在应用设置中手动修改这些配置。*

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
