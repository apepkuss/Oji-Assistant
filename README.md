# Oji Assistant

A modern, cross-platform AI chat application built with React and Chakra UI. Oji provides an intuitive interface for AI conversations with support for both streaming and non-streaming responses.

## 🚀 Installation

### 🖥️ Desktop App (Electron)

Oji is available as native desktop applications for all major platforms:

- **macOS**: Native app with system integration (Intel and Apple Silicon)
- **Windows**: Native app with installer
- **Linux**: AppImage, DEB, and RPM packages

**📖 For detailed installation instructions, see:** [Desktop Installation Guide](docs/INSTALLATION_GUIDE.md) | [桌面安装指南](docs/INSTALLATION_GUIDE_ZH.md)

### 🌐 Web App

Access Oji directly in your browser or deploy your own instance:

- **Online Version**: [https://apepkuss.github.io/Oji-Assistant](https://apepkuss.github.io/Oji-Assistant)
- **Self-Hosted**: Download and deploy the web version on your own server
- **PWA Support**: Can be installed as a desktop app from your browser
- **Mobile Friendly**: Responsive design for mobile devices

**📖 For detailed web installation and deployment instructions, see:** [Web Installation Guide](docs/INSTALLATION_GUIDE.md#-web-version) | [网页版安装指南](docs/INSTALLATION_GUIDE_ZH.md#-网页版本)

## 🔨 Build from Source

### Prerequisites

- Node.js 18+
- npm or yarn

### Development Setup

#### 1. Clone the repository

```bash
git clone https://github.com/apepkuss/Oji-Assistant.git
cd Oji-Assistant
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Development Mode

For web development:

```bash
npm run dev
```

The development server will start at `http://localhost:5173`

### Production Builds

#### Desktop Apps

```bash
# Build for all platforms
npm run electron:dist

# Build for specific platforms
npm run build:mac      # macOS
npm run build:win      # Windows
npm run build:linux    # Linux
```

#### Web App

```bash
# Build web version
npm run build:web

# Preview web build locally
npm run preview:web
```

The web app will be available at `http://localhost:4173/`

#### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:8080
```

## 🔧 Configuration

### AI Service Setup

1. Configure your AI service endpoint in the app settings
2. Default endpoint: `http://localhost:9068/v1`
3. Supports OpenAI-compatible APIs

### Environment Variables

```bash
# Default AI service URL (for web builds)
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://{host}:{port}/v1

# App version
VITE_APP_VERSION=1.0.0
```

These environment variables can be set during build time:

```bash
# Build with custom AI service URL
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://{host}:{port}/v1 npm run build:web

# Or create a .env file
echo "VITE_DEFAULT_AI_SERVICE_BASE_URL=http://{host}:{port}/v1" > .env
npm run build:web
```

## 🚀 Deployment

### Web Deployment

See [WEB_DEPLOYMENT.md](./docs/WEB_DEPLOYMENT.md) | [网页部署指南](./docs/WEB_DEPLOYMENT_ZH.md) for detailed deployment instructions including:

- GitHub Pages automatic deployment
- Docker deployment
- Static file server deployment
- PWA installation
- CORS configuration

### Desktop Distribution

See [ELECTRON_SETUP.md](./docs/ELECTRON_SETUP.md) for detailed Electron app setup and distribution.

GitHub Actions automatically builds and releases desktop apps when you create a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

For production preview:

```bash
npm run preview:web
```

The application will be available at `http://localhost:5173` (dev) or `http://localhost:4173` (preview).
