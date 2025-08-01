# Oji Assistant - 安装指南

本指南说明如何在不同平台上下载和安装 Oji Assistant，以及如何使用各种发布资源。

- [Oji Assistant - 安装指南](#oji-assistant---安装指南)
  - [📦 发布资源概览](#-发布资源概览)
  - [🖥️ 桌面安装](#️-桌面安装)
    - [macOS](#macos)
    - [Windows](#windows)
    - [Linux](#linux)
      - [AppImage（通用 Linux - 推荐）](#appimage通用-linux---推荐)
      - [Debian/Ubuntu (.deb)](#debianubuntu-deb)
      - [Red Hat/Fedora (.rpm)](#red-hatfedora-rpm)
  - [🌐 网页版本](#-网页版本)
    - [在线版本（推荐）](#在线版本推荐)
    - [自托管版本](#自托管版本)
      - [快速本地设置](#快速本地设置)
      - [生产环境部署](#生产环境部署)
      - [何时使用自托管网页版本](#何时使用自托管网页版本)
  - [🔄 自动更新系统](#-自动更新系统)
    - [工作原理](#工作原理)
    - [自动更新文件](#自动更新文件)
    - [禁用自动更新](#禁用自动更新)
  - [🆚 选择正确的版本](#-选择正确的版本)
    - [适用于最终用户](#适用于最终用户)
    - [适用于开发者/IT](#适用于开发者it)
  - [🔧 故障排除](#-故障排除)
    - [常见问题](#常见问题)
      - [macOS："应用程序已损坏"错误](#macos应用程序已损坏错误)
      - [Windows："Windows 保护了您的电脑"](#windowswindows-保护了您的电脑)
      - [Linux：权限被拒绝](#linux权限被拒绝)
      - [网页版本：CORS 错误](#网页版本cors-错误)
    - [获取帮助](#获取帮助)
  - [🔒 安全说明](#-安全说明)

## 📦 发布资源概览

每个 Oji 发布版本都包含适用于不同平台和用途的多个文件：

| 文件类型 | 平台 | 描述 | 自动更新 |
|-----------|----------|-------------|-------------|
| `Oji-x.x.x.dmg` | macOS (Intel) | 适用于 Intel Mac 的 macOS 安装包 | ✅ |
| `Oji-x.x.x-arm64.dmg` | macOS (Apple Silicon) | 适用于 M1/M2 Mac 的 macOS 安装包 | ✅ |
| `Oji Setup x.x.x.exe` | Windows | Windows 安装程序 (NSIS) | ✅ |
| `Oji-x.x.x.AppImage` | Linux | 便携式 Linux 应用程序 | ✅ |
| `oji_x.x.x_amd64.deb` | Linux (Debian/Ubuntu) | Debian 软件包 | ✅ |
| `oji-x.x.x.x86_64.rpm` | Linux (Red Hat/Fedora) | RPM 软件包 | ✅ |
| `oji-web-vx.x.x.zip` | Web | 自托管的网页版本 | ❌ |
| `latest.yml` | Windows | 自动更新配置 | - |
| `latest-mac.yml` | macOS | 自动更新配置 | - |
| `latest-linux.yml` | Linux | 自动更新配置 | - |

## 🖥️ 桌面安装

### macOS

- **选择正确的版本：**

  - **Intel Mac**：下载 `Oji-x.x.x.dmg`
  - **Apple Silicon (M1/M2)**：下载 `Oji-x.x.x-arm64.dmg`

- **安装步骤：**

  1. 下载相应的 `.dmg` 文件
  2. 双击挂载磁盘镜像
  3. 将 `Oji.app` 拖拽到应用程序文件夹
  4. 从应用程序或启动台启动

**⚠️ 重要 - Gatekeeper 安全警告：**

如果您看到"Oji 已损坏且无法打开"错误：

- **方法1：终端命令（推荐）**

  ```bash
  sudo xattr -rd com.apple.quarantine /Applications/Oji.app
  ```

- **方法2：系统设置**

  1. 前往系统设置 → 隐私与安全性
  2. 查找被阻止的应用程序通知
  3. 点击"仍要打开"

- **方法3：右键点击方法**

  1. 右键点击 `Oji.app` → "打开"（不要双击）
  2. 在警告对话框中点击"打开"
  3. 如果仍被阻止，请使用方法1

  > **注意**：出现此安全警告是因为应用程序未经过 Apple 公证。该应用程序使用安全。

### Windows

- **下载：** `Oji Setup x.x.x.exe`

- **安装步骤：**

  1. 下载 `.exe` 安装程序
  2. 右键点击并"以管理员身份运行"（如需要）
  3. 按照安装向导操作
  4. 选择安装目录（可选）
  5. 创建桌面和开始菜单快捷方式
  6. 从开始菜单或桌面快捷方式启动

- **功能特色：**

  - 完整的 Windows 集成
  - 自动更新
  - 适当的卸载支持
  - 系统通知

### Linux

为您的发行版选择合适的软件包：

#### AppImage（通用 Linux - 推荐）

**下载：** `Oji-x.x.x.AppImage`

```bash
# 下载并设置为可执行
chmod +x Oji-x.x.x.AppImage

# 直接运行
./Oji-x.x.x.AppImage

# 可选：移动到 /usr/local/bin 以供系统范围访问
sudo mv Oji-x.x.x.AppImage /usr/local/bin/oji
```

#### Debian/Ubuntu (.deb)

**下载：** `oji_x.x.x_amd64.deb`

```bash
# 使用 dpkg 安装
sudo dpkg -i oji_x.x.x_amd64.deb

# 如需要修复依赖关系
sudo apt-get install -f

# 启动
oji
# 或从应用程序菜单
```

#### Red Hat/Fedora (.rpm)

**下载：** `oji-x.x.x.x86_64.rpm`

```bash
# Fedora
sudo dnf install oji-x.x.x.x86_64.rpm

# CentOS/RHEL
sudo yum install oji-x.x.x.x86_64.rpm
# 或
sudo rpm -ivh oji-x.x.x.x86_64.rpm

# 启动
oji
# 或从应用程序菜单
```

## 🌐 网页版本

### 在线版本（推荐）

直接访问：**[https://apepkuss.github.io/Oji-Assistant](https://apepkuss.github.io/Oji-Assistant)**

- 无需安装
- 始终保持最新版本
- 在任何现代浏览器中工作
- 与桌面版本功能相同

### 自托管版本

**下载：** `oji-web-vx.x.x.zip`

#### 快速本地设置

```bash
# 解压文件
unzip oji-web-vx.x.x.zip -d oji-web

# 启动本地服务器
cd oji-web
python3 -m http.server 8080
# 或
npx serve . -p 8080

# 访问 http://localhost:8080
```

#### 生产环境部署

- **选项1：静态网络服务器**

  ```bash
  # 解压到网络服务器目录
  unzip oji-web-vx.x.x.zip -d /var/www/html/oji

  # 配置 nginx/apache 提供目录服务
  # 通过您的域名访问：https://yourdomain.com/oji/
  ```

- **选项2：Docker**

  ```bash
  # 解压文件
  unzip oji-web-vx.x.x.zip -d oji-web

  # 使用 Docker 运行
  docker run -d \
    --name oji-web \
    -p 8080:80 \
    -v $(pwd)/oji-web:/usr/share/nginx/html \
    nginx

  # 访问 http://localhost:8080
  ```

- **选项3：云平台**

  - **Netlify**：直接拖拽 `oji-web` 文件夹
  - **Vercel**：通过 CLI 或控制面板上传和部署
  - **GitHub Pages**：推送到仓库并启用 Pages
  - **Firebase**：使用 `firebase deploy` 配置托管

#### 何时使用自托管网页版本

- ✅ 公司内部部署
- ✅ 离线/隔离环境
- ✅ 自定义域名需求
- ✅ 需要修改配置
- ✅ 版本控制需求
- ✅ 网络限制

## 🔄 自动更新系统

### 工作原理

- 桌面版本自动检查更新
- 配置文件（`latest*.yml`）包含更新信息
- 有可用更新时通知用户
- 更新自动下载和安装（需用户同意）

### 自动更新文件

- `latest.yml` - Windows 更新配置
- `latest-mac.yml` - macOS 更新配置
- `latest-linux.yml` - Linux 更新配置

> **注意**：这些文件由应用程序自动下载。用户无需手动下载。

### 禁用自动更新

如果您偏好手动更新：

1. 检查应用程序偏好设置/设置
2. 查找"自动更新"或"检查更新"选项
3. 禁用该设置

## 🆚 选择正确的版本

### 适用于最终用户

| 使用场景 | 推荐下载 |
|----------|---------------------|
| **macOS 日常使用** | `Oji-x.x.x.dmg` 或 `Oji-x.x.x-arm64.dmg` |
| **Windows 日常使用** | `Oji Setup x.x.x.exe` |
| **Linux 日常使用** | `Oji-x.x.x.AppImage` |
| **快速测试** | 使用在线网页版本 |
| **公司部署** | `oji-web-vx.x.x.zip` |

### 适用于开发者/IT

| 使用场景 | 推荐下载 |
|----------|---------------------|
| **开发测试** | AppImage（无系统更改） |
| **企业部署** | 软件包文件（.deb/.rpm）+ 网页版本 |
| **跨平台测试** | 所有平台版本 |
| **自定义集成** | `oji-web-vx.x.x.zip` 用于修改 |

## 🔧 故障排除

### 常见问题

#### macOS："应用程序已损坏"错误

请参阅上面详细的 macOS 安装步骤。

#### Windows："Windows 保护了您的电脑"

1. 点击"更多信息"
2. 点击"仍要运行"
3. 或右键点击安装程序 → 属性 → 解除阻止

#### Linux：权限被拒绝

```bash
chmod +x Oji-x.x.x.AppImage
```

#### 网页版本：CORS 错误

- 使用适当的网络服务器（不是 file:// 协议）
- 如需要配置服务器标头

### 获取帮助

- 📝 查看 [问题页面](https://github.com/apepkuss/Oji-Assistant/issues)
- 💬 开始 [讨论](https://github.com/apepkuss/Oji-Assistant/discussions)
- 📧 联系维护者

## 🔒 安全说明

- 桌面应用程序未经代码签名（因此会出现安全警告）
- 所有软件都是开源的，可以审计
- 网页版本完全在您的浏览器中运行
- 无遥测或跟踪
- 仅本地处理

---

**需要帮助？** 在 [GitHub](https://github.com/apepkuss/Oji-Assistant/issues) 上提出问题或查看我们的 [文档](../README.md)。
