# Oji Assistant

A modern, cross-platform AI chat application built with React and Chakra UI. Oji provides an intuitive interface for AI conversations with support for both streaming and non-streaming responses.

## 🚀 Available Versions

### 🖥️ Desktop App (Electron)

- **macOS**: Native app with system integration
- **Windows**: Native app with installer
- **Linux**: AppImage, DEB, and RPM packages

### 🌐 Web App (Progressive Web App)

- **Browser Access**: Works in any modern web browser
- **PWA Support**: Can be installed as a desktop app
- **Mobile Friendly**: Responsive design for mobile devices
- **Offline Capable**: Basic functionality works offline

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

### 🖥️ Desktop Development

#### 1. Clone the repository

```bash
git clone https://github.com/apepkuss/Oji-Assistant.git
cd Oji-Assistant
```

#### 2. Install dependencies

```bash
npm install
```

### 3. Build the application

```bash
npm run build
```

### 4. Run the application

For development:

```bash
npm run dev
```

The development server will start at `http://localhost:5173`

### 🌐 Web Development

#### 1. Build Web version

```bash
npm run build:web
```

#### 2. Preview Web version

```bash
npm run preview:web
```

The web app will be available at `http://localhost:4173/`

#### 3. Deploy with Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:8080
```

## 📦 Production Builds

### Desktop Apps

```bash
# Build for all platforms
npm run electron:dist

# Build for specific platforms
npm run build:mac      # macOS
npm run build:win      # Windows
npm run build:linux    # Linux
```

### Web App

```bash
# Build web version
npm run build:web

# Files will be in dist/ directory
# Deploy dist/ contents to any web server
```

## 🔧 Configuration

### AI Service Setup

1. Configure your AI service endpoint in the app settings
2. Default endpoint: `http://localhost:9068/v1`
3. Supports OpenAI-compatible APIs

### Environment Variables

```bash
# Default AI service URL (for web builds)
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1

# App version
VITE_APP_VERSION=1.0.0
```

These environment variables can be set during build time:

```bash
# Build with custom AI service URL
VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1 npm run build:web

# Or create a .env file
echo "VITE_DEFAULT_AI_SERVICE_BASE_URL=http://your-ai-server:9068/v1" > .env
npm run build:web
```

## 🚀 Deployment

### Web Deployment

See [WEB_DEPLOYMENT.md](./WEB_DEPLOYMENT.md) for detailed deployment instructions including:

- GitHub Pages automatic deployment
- Docker deployment
- Static file server deployment
- PWA installation
- CORS configuration

### Desktop Distribution

See [ELECTRON_SETUP.md](./ELECTRON_SETUP.md) for detailed Electron app setup and distribution.

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
