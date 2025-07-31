# Oji Assistant - Installation Guide

This guide explains how to download and install Oji Assistant on different platforms, and how to use the various release assets.

- [Oji Assistant - Installation Guide](#oji-assistant---installation-guide)
  - [📦 Release Assets Overview](#-release-assets-overview)
  - [🖥️ Desktop Installation](#️-desktop-installation)
    - [macOS](#macos)
    - [Windows](#windows)
    - [Linux](#linux)
      - [AppImage (Universal Linux - Recommended)](#appimage-universal-linux---recommended)
      - [Debian/Ubuntu (.deb)](#debianubuntu-deb)
      - [Red Hat/Fedora (.rpm)](#red-hatfedora-rpm)
  - [🌐 Web Version](#-web-version)
    - [Online Version (Recommended)](#online-version-recommended)
    - [Self-Hosted Version](#self-hosted-version)
      - [Quick Local Setup](#quick-local-setup)
      - [Production Deployment](#production-deployment)
      - [When to Use Self-Hosted Web Version](#when-to-use-self-hosted-web-version)
  - [🔄 Auto-Update System](#-auto-update-system)
    - [How It Works](#how-it-works)
    - [Auto-Update Files](#auto-update-files)
    - [Disabling Auto-Updates](#disabling-auto-updates)
  - [🆚 Choosing the Right Version](#-choosing-the-right-version)
    - [For End Users](#for-end-users)
    - [For Developers/IT](#for-developersit)
  - [🔧 Troubleshooting](#-troubleshooting)
    - [Common Issues](#common-issues)
      - [macOS: "App is damaged" error](#macos-app-is-damaged-error)
      - [Windows: "Windows protected your PC"](#windows-windows-protected-your-pc)
      - [Linux: Permission denied](#linux-permission-denied)
      - [Web version: CORS errors](#web-version-cors-errors)
    - [Getting Help](#getting-help)
  - [🔒 Security Notes](#-security-notes)

## 📦 Release Assets Overview

Each Oji release includes multiple files for different platforms and use cases:

| File Type | Platform | Description | Auto-Update |
|-----------|----------|-------------|-------------|
| `Oji-x.x.x.dmg` | macOS (Intel) | macOS installer for Intel Macs | ✅ |
| `Oji-x.x.x-arm64.dmg` | macOS (Apple Silicon) | macOS installer for M1/M2 Macs | ✅ |
| `Oji Setup x.x.x.exe` | Windows | Windows installer (NSIS) | ✅ |
| `Oji-x.x.x.AppImage` | Linux | Portable Linux application | ✅ |
| `oji_x.x.x_amd64.deb` | Linux (Debian/Ubuntu) | Debian package | ✅ |
| `oji-x.x.x.x86_64.rpm` | Linux (Red Hat/Fedora) | RPM package | ✅ |
| `oji-web-vx.x.x.zip` | Web | Self-hosted web version | ❌ |
| `latest.yml` | Windows | Auto-update configuration | - |
| `latest-mac.yml` | macOS | Auto-update configuration | - |
| `latest-linux.yml` | Linux | Auto-update configuration | - |

## 🖥️ Desktop Installation

### macOS

**Choose the right version:**
- **Intel Macs**: Download `Oji-x.x.x.dmg`
- **Apple Silicon (M1/M2)**: Download `Oji-x.x.x-arm64.dmg`

**Installation steps:**
1. Download the appropriate `.dmg` file
2. Double-click to mount the disk image
3. Drag `Oji.app` to your Applications folder
4. Launch from Applications or Launchpad

**⚠️ Important - Gatekeeper Security Warning:**

If you see "Oji is damaged and can't be opened" error:

**Method 1: Terminal Command (Recommended)**
```bash
sudo xattr -rd com.apple.quarantine /Applications/Oji.app
```

**Method 2: System Settings**
1. Go to System Settings → Privacy & Security
2. Look for the blocked app notification
3. Click "Open Anyway"

**Method 3: Right-click Method**
1. Right-click `Oji.app` → "Open" (don't double-click)
2. Click "Open" in the warning dialog
3. If still blocked, use Method 1

> **Note**: This security warning appears because the app is not notarized by Apple. The app is safe to use.

### Windows

**Download:** `Oji Setup x.x.x.exe`

**Installation steps:**
1. Download the `.exe` installer
2. Right-click and "Run as administrator" (if needed)
3. Follow the installation wizard
4. Choose installation directory (optional)
5. Create desktop and start menu shortcuts
6. Launch from Start Menu or desktop shortcut

**Features:**
- Full Windows integration
- Automatic updates
- Proper uninstall support
- System notifications

### Linux

Choose the appropriate package for your distribution:

#### AppImage (Universal Linux - Recommended)
**Download:** `Oji-x.x.x.AppImage`

```bash
# Download and make executable
chmod +x Oji-x.x.x.AppImage

# Run directly
./Oji-x.x.x.AppImage

# Optional: Move to /usr/local/bin for system-wide access
sudo mv Oji-x.x.x.AppImage /usr/local/bin/oji
```

#### Debian/Ubuntu (.deb)
**Download:** `oji_x.x.x_amd64.deb`

```bash
# Install using dpkg
sudo dpkg -i oji_x.x.x_amd64.deb

# Fix dependencies if needed
sudo apt-get install -f

# Launch
oji
# or from Applications menu
```

#### Red Hat/Fedora (.rpm)
**Download:** `oji-x.x.x.x86_64.rpm`

```bash
# Fedora
sudo dnf install oji-x.x.x.x86_64.rpm

# CentOS/RHEL
sudo yum install oji-x.x.x.x86_64.rpm
# or
sudo rpm -ivh oji-x.x.x.x86_64.rpm

# Launch
oji
# or from Applications menu
```

## 🌐 Web Version

### Online Version (Recommended)
Access directly at: **[https://apepkuss.github.io/Oji-Assistant](https://apepkuss.github.io/Oji-Assistant)**

- No installation required
- Always up-to-date
- Works in any modern browser
- Identical functionality to desktop versions

### Self-Hosted Version
**Download:** `oji-web-vx.x.x.zip`

#### Quick Local Setup
```bash
# Extract files
unzip oji-web-vx.x.x.zip -d oji-web

# Start local server
cd oji-web
python3 -m http.server 8080
# or
npx serve . -p 8080

# Access at http://localhost:8080
```

#### Production Deployment

**Option 1: Static Web Server**
```bash
# Extract to web server directory
unzip oji-web-vx.x.x.zip -d /var/www/html/oji

# Configure nginx/apache to serve the directory
# Access via your domain: https://yourdomain.com/oji/
```

**Option 2: Docker**
```bash
# Extract files
unzip oji-web-vx.x.x.zip -d oji-web

# Run with Docker
docker run -d \
  --name oji-web \
  -p 8080:80 \
  -v $(pwd)/oji-web:/usr/share/nginx/html \
  nginx

# Access at http://localhost:8080
```

**Option 3: Cloud Platforms**
- **Netlify**: Drag and drop the `oji-web` folder
- **Vercel**: Upload and deploy via CLI or dashboard
- **GitHub Pages**: Push to a repository and enable Pages
- **Firebase**: Use `firebase deploy` with hosting setup

#### When to Use Self-Hosted Web Version
- ✅ Internal company deployment
- ✅ Offline/air-gapped environments
- ✅ Custom domain requirements
- ✅ Need to modify configuration
- ✅ Version control requirements
- ✅ Network restrictions

## 🔄 Auto-Update System

### How It Works
- Desktop versions automatically check for updates
- Configuration files (`latest*.yml`) contain update information
- Users are notified when updates are available
- Updates download and install automatically (with user consent)

### Auto-Update Files
- `latest.yml` - Windows update configuration
- `latest-mac.yml` - macOS update configuration
- `latest-linux.yml` - Linux update configuration

> **Note**: These files are automatically downloaded by the applications. Users don't need to download them manually.

### Disabling Auto-Updates
If you prefer manual updates:
1. Check application preferences/settings
2. Look for "Auto-update" or "Check for updates" option
3. Disable the setting

## 🆚 Choosing the Right Version

### For End Users
| Use Case | Recommended Download |
|----------|---------------------|
| **macOS daily use** | `Oji-x.x.x.dmg` or `Oji-x.x.x-arm64.dmg` |
| **Windows daily use** | `Oji Setup x.x.x.exe` |
| **Linux daily use** | `Oji-x.x.x.AppImage` |
| **Quick testing** | Use online web version |
| **Company deployment** | `oji-web-vx.x.x.zip` |

### For Developers/IT
| Use Case | Recommended Download |
|----------|---------------------|
| **Development testing** | AppImage (no system changes) |
| **Enterprise deployment** | Package files (.deb/.rpm) + web version |
| **Cross-platform testing** | All platform versions |
| **Custom integration** | `oji-web-vx.x.x.zip` for modifications |

## 🔧 Troubleshooting

### Common Issues

#### macOS: "App is damaged" error
See the detailed macOS installation steps above.

#### Windows: "Windows protected your PC"
1. Click "More info"
2. Click "Run anyway"
3. Or right-click installer → Properties → Unblock

#### Linux: Permission denied
```bash
chmod +x Oji-x.x.x.AppImage
```

#### Web version: CORS errors
- Use a proper web server (not file:// protocol)
- Configure server headers if needed

### Getting Help
- 📝 Check the [Issues page](https://github.com/apepkuss/Oji-Assistant/issues)
- 💬 Start a [Discussion](https://github.com/apepkuss/Oji-Assistant/discussions)
- 📧 Contact the maintainer

## 🔒 Security Notes

- Desktop applications are not code-signed (hence security warnings)
- All software is open source and auditable
- Web version runs entirely in your browser
- No telemetry or tracking
- Local processing only

---

**Need help?** Open an issue on [GitHub](https://github.com/apepkuss/Oji-Assistant/issues) or check our [documentation](README.md).