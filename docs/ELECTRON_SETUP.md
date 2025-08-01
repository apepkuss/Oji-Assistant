# Electron 应用发布说明

## 📋 自动化发布流程

本项目已配置完整的跨平台自动化构建和发布流程，支持 macOS、Windows 和 Linux 平台。

## 🚀 如何发布新版本

### 方法 1: Git Tag 发布 (推荐)

1. **更新版本号**

   ```bash
   npm version patch  # 小版本更新 (1.0.0 -> 1.0.1)
   npm version minor  # 功能更新 (1.0.0 -> 1.1.0)
   npm version major  # 大版本更新 (1.0.0 -> 2.0.0)
   ```

2. **推送标签到GitHub**

   ```bash
   git push origin main --tags
   ```

3. **自动构建和发布**
   - GitHub Actions 会自动检测到新标签
   - 自动在三个平台上构建应用
   - 创建GitHub Release并上传安装包

### 方法 2: 手动触发发布

1. 前往 GitHub 仓库的 "Actions" 页面
2. 选择 "Build and Release Electron App" 工作流
3. 点击 "Run workflow"
4. 等待构建完成

## 📦 构建产物

### macOS

- `.dmg` - 磁盘镜像安装包
- `.zip` - 压缩包版本
- 支持 Intel (x64) 和 Apple Silicon (arm64)

### Windows

- `.exe` - NSIS 安装程序
- `.exe` (portable) - 便携版本
- 支持 64位 和 32位

### Linux

- `.AppImage` - 便携应用包
- `.deb` - Debian/Ubuntu 安装包
- `.rpm` - Red Hat/Fedora 安装包

### Web 版本

- **GitHub Pages**: 自动部署到 `https://apepkuss.github.io/Oji-Assistant`
- **压缩包**: `oji-web-{version}.zip` 用于本地部署

## 🛠️ 本地开发

### 启动开发环境

```bash
# 方法 1: 使用脚本
./scripts/dev.sh

# 方法 2: 使用npm命令
npm run electron:dev
```

### 本地构建测试

```bash
# 构建所有平台 (需要对应平台环境)
./scripts/build.sh

# 构建当前平台
npm run electron:dist

# 构建特定平台
npm run build:mac     # macOS
npm run build:win     # Windows
npm run build:linux   # Linux
```

## 📁 项目结构

```txt
oji-assistant/
├── electron/           # Electron 主进程和预加载脚本
│   ├── main.js        # Electron 主进程
│   └── preload.js     # 预加载脚本
├── src/               # React 应用源码
├── scripts/           # 构建脚本
├── .github/workflows/ # GitHub Actions 工作流
├── build/             # 应用图标和资源
├── public/            # 公共资源文件
└── release/           # 构建输出目录
```

## 🔧 配置说明

### Electron Builder 配置

在 `package.json` 中的 `build` 字段配置了：

- 应用ID、名称和图标
- 各平台的构建目标和格式
- 代码签名配置 (可选)
- 自动更新配置 (可选)

### GitHub Actions 配置

- `.github/workflows/build-release.yml` - 发布工作流 (支持桌面端和Web端)
- `.github/workflows/dev-build.yml` - 开发构建工作流

## 🎨 图标配置

**重要**: 在首次发布前，需要在 `build/` 目录中添加应用图标：

```bash
build/
├── icon.icns    # macOS (1024x1024px)
├── icon.ico     # Windows (256x256px)
└── icon.png     # Linux (512x512px)
```

可以使用在线工具如 [ConvertICO](https://convertico.com/) 或 [RealFaviconGenerator](https://realfavicongenerator.net/) 生成多种格式的图标。

## 🔒 代码签名 (可选)

为了在 macOS 和 Windows 上避免安全警告，建议配置代码签名：

### macOS 代码签名

```json
"mac": {
  "identity": "Developer ID Application: Your Name",
  "hardenedRuntime": true,
  "entitlements": "build/entitlements.mac.plist"
}
```

### Windows 代码签名

```json
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "password"
}
```

## 🔄 自动更新 (可选)

可以集成 `electron-updater` 实现自动更新功能：

```bash
npm install electron-updater
```

## 📝 注意事项

1. **⚠️ 图标配置**: 当前 `build/` 目录中缺少应用图标文件，需要添加：
   - `icon.icns` (macOS, 1024x1024px)
   - `icon.ico` (Windows, 256x256px)
   - `icon.png` (Linux, 512x512px)
2. **macOS 构建**需要在 macOS 环境中进行（GitHub Actions 已配置）
3. **Windows 构建**可以在任何平台进行
4. **Linux 构建**建议在 Linux 环境中进行以确保兼容性
5. **代码签名**需要有效的开发者证书
6. **发布权限**需要仓库的 write 权限
7. **Web 版本**会自动部署到 GitHub Pages，可通过链接访问

## 🐛 故障排除

### 构建失败

1. 检查 `package.json` 中的依赖版本
2. 确保 Node.js 版本兼容 (推荐 18.x)
3. 检查 GitHub Actions 日志中的错误信息

### 应用无法启动

1. 检查 `electron/main.js` 中的路径配置
2. 确认 React 应用构建成功
3. 检查控制台错误信息

### 无法连接到AI服务

1. 确认AI服务正在运行（默认端口9068）
2. 检查设置中的Base URL是否正确
3. 确认网络连接正常
4. 尝试在浏览器中访问 `http://localhost:9068/v1` 确认服务可达
5. 检查防火墙设置是否阻止了连接

### 图标未显示

1. 确认图标文件存在且格式正确
2. 检查 `package.json` 中的图标路径配置
3. 重新构建应用
