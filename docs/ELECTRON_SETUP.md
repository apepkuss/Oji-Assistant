<div align = "right">
<a href="INSTALLATION_GUIDE_ZH.md">简体中文</a>
</div>

# Electron Application Release Documentation

## 📋 Automated Release Process

This project has configured a complete cross-platform automated build and release process, supporting macOS, Windows, and Linux platforms.

## 🚀 How to Release New Versions

### Method 1: Git Tag Release (Recommended)

1. **Update Version Number**

   ```bash
   npm version patch  # Patch version update (1.0.0 -> 1.0.1)
   npm version minor  # Feature update (1.0.0 -> 1.1.0)
   npm version major  # Major version update (1.0.0 -> 2.0.0)
   ```

2. **Push Tag to GitHub**

   ```bash
   git push origin main --tags
   ```

3. **Automatic Build and Release**
   - GitHub Actions will automatically detect the new tag
   - Automatically build applications on three platforms
   - Create GitHub Release and upload installation packages

### Method 2: Manual Triggered Release

1. Go to the GitHub repository's "Actions" page
2. Select "Build and Release Electron App" workflow
3. Click "Run workflow"
4. Wait for build completion

## 📦 Build Artifacts

### macOS

- `.dmg` - Disk image installer
- `.zip` - Compressed package version
- Supports Intel (x64) and Apple Silicon (arm64)

### Windows

- `.exe` - NSIS installer
- `.exe` (portable) - Portable version
- Supports 64-bit and 32-bit

### Linux

- `.AppImage` - Portable application package
- `.deb` - Debian/Ubuntu installation package
- `.rpm` - Red Hat/Fedora installation package

### Web Version

- **GitHub Pages**: Automatically deployed to `https://apepkuss.github.io/Oji-Assistant`
- **Archive**: `oji-web-{version}.zip` for local deployment

## 🛠️ Local Development

### Start Development Environment

```bash
# Method 1: Using scripts
./scripts/dev.sh

# Method 2: Using npm commands
npm run electron:dev
```

### Local Build Testing

```bash
# Build all platforms (requires corresponding platform environments)
./scripts/build.sh

# Build current platform
npm run electron:dist

# Build specific platforms
npm run build:mac     # macOS
npm run build:win     # Windows
npm run build:linux   # Linux
```

## 📁 Project Structure

```txt
oji-assistant/
├── electron/           # Electron main process and preload scripts
│   ├── main.js        # Electron main process
│   └── preload.js     # Preload script
├── src/               # React application source code
├── scripts/           # Build scripts
├── .github/workflows/ # GitHub Actions workflows
├── build/             # Application icons and resources
├── public/            # Public resource files
└── release/           # Build output directory
```

## 🔧 Configuration Description

### Electron Builder Configuration

The `build` field in `package.json` configures:

- Application ID, name, and icon
- Build targets and formats for each platform
- Code signing configuration (optional)
- Auto-update configuration (optional)

### GitHub Actions Configuration

- `.github/workflows/build-release.yml` - Release workflow (supports desktop and web)
- `.github/workflows/dev-build.yml` - Development build workflow

## 🎨 Icon Configuration

**Important**: Before first release, you need to add application icons in the `build/` directory:

```bash
build/
├── icon.icns    # macOS (1024x1024px)
├── icon.ico     # Windows (256x256px)
└── icon.png     # Linux (512x512px)
```

You can use online tools like [ConvertICO](https://convertico.com/) or [RealFaviconGenerator](https://realfavicongenerator.net/) to generate icons in multiple formats.

## 🔒 Code Signing (Optional)

To avoid security warnings on macOS and Windows, it's recommended to configure code signing:

### macOS Code Signing

```json
"mac": {
  "identity": "Developer ID Application: Your Name",
  "hardenedRuntime": true,
  "entitlements": "build/entitlements.mac.plist"
}
```

### Windows Code Signing

```json
"win": {
  "certificateFile": "path/to/certificate.p12",
  "certificatePassword": "password"
}
```

## 🔄 Auto-Update (Optional)

You can integrate `electron-updater` to implement auto-update functionality:

```bash
npm install electron-updater
```

## 📝 Notes

1. **⚠️ Icon Configuration**: Currently missing application icon files in the `build/` directory, need to add:
   - `icon.icns` (macOS, 1024x1024px)
   - `icon.ico` (Windows, 256x256px)
   - `icon.png` (Linux, 512x512px)
2. **macOS builds** need to be performed in macOS environment (GitHub Actions configured)
3. **Windows builds** can be performed on any platform
4. **Linux builds** are recommended to be performed in Linux environment for compatibility
5. **Code signing** requires valid developer certificates
6. **Release permissions** require repository write permissions
7. **Web version** will be automatically deployed to GitHub Pages, accessible via link

## 🐛 Troubleshooting

### Build Failures

1. Check dependency versions in `package.json`
2. Ensure Node.js version compatibility (recommended 18.x)
3. Check error information in GitHub Actions logs

### Application Won't Start

1. Check path configuration in `electron/main.js`
2. Confirm React application build success
3. Check console error messages

### Cannot Connect to AI Service

1. Confirm AI service is running (default port 9068)
2. Check if Base URL in settings is correct
3. Confirm network connection is normal
4. Try accessing `http://localhost:9068/v1` in browser to confirm service is reachable
5. Check firewall settings for blocked connections

### Icons Not Displaying

1. Confirm icon files exist and are in correct format
2. Check icon path configuration in `package.json`
3. Rebuild the application
