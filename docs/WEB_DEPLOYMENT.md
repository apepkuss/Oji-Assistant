<div align = "right">
<a href="WEB_DEPLOYMENT_ZH.md">简体中文</a>
</div>

# Oji Web Version Deployment Guide

Oji now supports deployment as a web application, allowing users to access the complete AI assistant functionality through their browser.

- [Oji Web Version Deployment Guide](#oji-web-version-deployment-guide)
  - [🌐 Deployment Methods](#-deployment-methods)
    - [1. GitHub Pages Automatic Deployment](#1-github-pages-automatic-deployment)
    - [2. Manual Deployment](#2-manual-deployment)
      - [Build Web Version](#build-web-version)
      - [Deploy to Any Web Server](#deploy-to-any-web-server)
    - [3. Docker Deployment](#3-docker-deployment)
      - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
      - [Using Docker Commands](#using-docker-commands)
    - [4. Static File Server Deployment](#4-static-file-server-deployment)
      - [Using Python](#using-python)
      - [Using Node.js serve](#using-nodejs-serve)
      - [Using nginx](#using-nginx)
  - [⚙️ Configuration](#️-configuration)
    - [AI Service Configuration](#ai-service-configuration)
    - [Cross-Origin Configuration](#cross-origin-configuration)
      - [Express.js Example](#expressjs-example)
      - [Axum (Rust) Example](#axum-rust-example)
      - [🔍 Verify CORS Configuration](#-verify-cors-configuration)
        - [Method 1: Using Web Test Page](#method-1-using-web-test-page)
        - [Method 2: Using Command Line Scripts](#method-2-using-command-line-scripts)
  - [🔧 Environment Variables](#-environment-variables)
    - [Build-time Environment Variables](#build-time-environment-variables)
    - [Runtime Environment Variables](#runtime-environment-variables)
    - [Environment Variables in Docker Deployment](#environment-variables-in-docker-deployment)
    - [Using .env Files](#using-env-files)
    - [Priority Order](#priority-order)
    - [CI/CD Integration Example](#cicd-integration-example)
  - [📱 PWA Support](#-pwa-support)
  - [🛡️ Security Considerations](#️-security-considerations)
    - [HTTPS Deployment](#https-deployment)
    - [Environment Isolation](#environment-isolation)
  - [🚀 Performance Optimization](#-performance-optimization)
    - [Enable Gzip Compression](#enable-gzip-compression)
    - [CDN Deployment](#cdn-deployment)
  - [📊 Monitoring](#-monitoring)
    - [Logging](#logging)
    - [Analytics](#analytics)
  - [🔄 Update Deployment](#-update-deployment)
    - [Automatic Updates](#automatic-updates)
    - [Manual Updates](#manual-updates)
  - [🆘 Troubleshooting](#-troubleshooting)
    - [Common Issues](#common-issues)
    - [Debug Mode](#debug-mode)

## 🌐 Deployment Methods

### 1. GitHub Pages Automatic Deployment

When creating a new release tag, the web version is automatically deployed to GitHub Pages:

- Access URL: `https://apepkuss.github.io/Oji-Assistant`

### 2. Manual Deployment

#### Build Web Version

```bash
npm run build:web
```

Build artifacts will be generated in the `dist/` directory.

#### Deploy to Any Web Server

```bash
# Copy dist/ directory contents to web server
cp -r dist/* /path/to/webserver/root/
```

### 3. Docker Deployment

#### Using Docker Compose (Recommended)

```bash
# Start services
docker-compose up -d

# Access at http://localhost:8080
```

#### Using Docker Commands

```bash
# Build image
docker build -t oji-web .

# Run container
docker run -d -p 8080:80 oji-web

# Access at http://localhost:8080
```

### 4. Static File Server Deployment

#### Using Python

```bash
cd dist
python -m http.server 8080
# Access at http://localhost:8080
```

#### Using Node.js serve

```bash
npx serve dist -p 8080
# Access at http://localhost:8080
```

#### Using nginx

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

## ⚙️ Configuration

### AI Service Configuration

The web version requires configuring the AI service endpoint:

1. Open Oji Web application
2. Click the settings ⚙️ icon
3. Configure in the "Server" tab:
   - **AI Service Base URL**: `http://your-ai-server:9068/v1`
   - **API Key**: (if required)

### Cross-Origin Configuration

If the AI service and web application are on different domains, you need to configure CORS on the AI service side:

#### Express.js Example

```javascript
app.use(cors({
  origin: ['https://your-oji-domain.com', 'http://localhost:8080'],
  credentials: true
}));
```

#### Axum (Rust) Example

```rust
use tower_http::cors::{Any, CorsLayer};
use http::Method;

let cors = CorsLayer::new()
    .allow_methods([Method::GET, Method::POST])
    .allow_headers(Any)
    .allow_origin(Any); // For development, recommend restricting to specific domains in production

let app = Router::new()
    .route("/v1/chat/completions", post(chat_handler))
    .layer(cors);
```

#### 🔍 Verify CORS Configuration

We provide two ways to verify your AI service CORS configuration:

##### Method 1: Using Web Test Page

```bash
# Open test page in project root directory
open test-cors.html
# Or access in browser: file:///path/to/oji/test-cors.html
```

##### Method 2: Using Command Line Scripts

```bash
# Run CORS verification script
./scripts/test-cors.sh

# Or manually specify service address
./scripts/test-cors.sh
# Then enter your AI service URL: http://localhost:9068/v1

# Test AI service connectivity
./scripts/test-ai-service.sh
```

Testing will verify:

- ✅ CORS preflight requests (OPTIONS)
- ✅ Actual API calls (POST)
- ✅ Streaming response support
- ✅ Service connectivity

## 🔧 Environment Variables

Oji Web version supports two types of environment variable configuration:

### Build-time Environment Variables

Setting these variables during build time will embed the configuration into the application:

```bash
# Configure default AI service URL
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1 npm run build:web

# Configure application version
VITE_APP_VERSION=1.0.0 npm run build:web

# Configure multiple environment variables simultaneously
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1 VITE_APP_VERSION=1.0.0 npm run build:web
```

**Supported build-time environment variables**:

- `VITE_DEFAULT_AI_SERVICE_BASE_URL`: Set default AI service endpoint URL
- `VITE_APP_VERSION`: Set application version (usually set automatically in CI/CD)

### Runtime Environment Variables

Runtime environment variables allow dynamic configuration when starting the application, with higher priority than build-time settings:

```bash
# Development mode with custom AI service
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run dev

# Build with custom configuration
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run build:web

# Preview with custom configuration
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run preview:web
```

**Supported runtime environment variables**:

- `AI_BASE_URL`: Set default AI service base URL
- `AI_API_KEY`: Set default API key

### Environment Variables in Docker Deployment

Using environment variables in Docker environment:

```bash
# Build with runtime environment variables
AI_BASE_URL=https://prod-ai.company.com/v1 AI_API_KEY=prod-key docker-compose up -d

# Or set in docker-compose.yml
```

```yaml
# docker-compose.yml example
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

### Using .env Files

**Using .env file**:

```bash
# Create .env file
echo "VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1" > .env
echo "AI_BASE_URL=http://your-ai-server:9068/v1" >> .env
echo "AI_API_KEY=your-api-key" >> .env

# Build will automatically read .env file
npm run build:web
```

### Priority Order

Environment variable priority (from highest to lowest):

1. **Runtime environment variables** (`AI_BASE_URL`, `AI_API_KEY`) - Highest priority
2. **Build-time environment variables** (`VITE_DEFAULT_AI_SERVICE_BASE_URL`) - Medium priority
3. **Hardcoded default values** (`http://localhost:9068/v1`) - Lowest priority

### CI/CD Integration Example

```yaml
# GitHub Actions example
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

*Note: If no environment variables are set, the application will use the default value `http://localhost:9068/v1`. Users can still manually modify these configurations in the application settings.*

For detailed environment variable usage instructions, please refer to: [Environment Variables Configuration Guide](./ENVIRONMENT_VARIABLES.md)

## 📱 PWA Support

Oji Web version supports Progressive Web App functionality:

- Installable to desktop/home screen
- Offline caching
- Native app-like experience

Users can click the "Install" button in the browser address bar to add the application to their desktop.

**Note**: Currently using `vite.svg` as the application icon. It's recommended to add more appropriate PWA icons (such as 192x192 and 512x512 PNG files) in the `public/` directory for a better user experience.

## 🛡️ Security Considerations

### HTTPS Deployment

HTTPS is recommended for production environments:

```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # ... other configurations
}
```

### Environment Isolation

- Development environment: `http://localhost:8080`
- Testing environment: `https://test.your-domain.com`
- Production environment: `https://oji.your-domain.com`

## 🚀 Performance Optimization

### Enable Gzip Compression

The nginx configuration already includes gzip compression settings, which can significantly reduce transfer size.

### CDN Deployment

Static resources can be deployed to CDN to improve loading speed:

```bash
# After uploading to CDN, update resource paths in index.html
# Or use Vite's base configuration
```

## 📊 Monitoring

### Logging

The web version logs key operations and errors in the browser console.

### Analytics

You can integrate Google Analytics or other analytics tools:

```html
<!-- Add analytics code in index.html -->
```

## 🔄 Update Deployment

### Automatic Updates

Automatic deployment through GitHub Actions:

1. Create new git tag: `git tag v1.0.1`
2. Push tag: `git push origin v1.0.1`
3. GitHub Actions will automatically build and deploy

### Manual Updates

```bash
# Pull latest code
git pull origin main

# Rebuild
npm run build:web

# Redeploy
docker-compose up -d --build
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check AI service CORS configuration
   - Ensure web application domain is allowed

2. **Resource Loading Failures**
   - Check if `base` configuration is correct
   - Verify resource paths

3. **AI Service Connection Failures**
   - Verify if AI service is running
   - Check network connection and firewall settings

### Debug Mode

View in browser developer tools:

- Network tab: Check network requests
- Console tab: View error logs
- Application tab: Check PWA status
