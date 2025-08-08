# Environment Variables for Oji Web Version

Oji Web version supports environment variables to set default AI service configuration. These variables allow you to pre-configure the AI service base URL and API key that will be used as default values in the Server Settings page.

## 🚀 Usage

### Development Mode

```bash
# Start development server with custom AI service settings
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run dev

# Or use the predefined script (modify package.json first)
npm run dev:custom
```

### Build Mode

```bash
# Build with custom AI service settings
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run build

# Or use the predefined script (modify package.json first)
npm run build:web:custom
```

### Preview Mode

```bash
# Preview with custom AI service settings
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run preview

# Or use the predefined script (modify package.json first)
npm run preview:web:custom
```

## 📋 Available Environment Variables

### `AI_BASE_URL`

Sets the default AI service base URL.

```bash
AI_BASE_URL=http://your-ai-server:9068/v1 npm run dev
```

### `AI_API_KEY`

Sets the default API key for the AI service.

```bash
AI_API_KEY=your-api-key npm run dev
```

### Combined Usage

```bash
# Use both variables together
AI_BASE_URL=http://your-ai-server:9068/v1 AI_API_KEY=your-api-key npm run dev
```

## 🔄 Priority Order

The default values are determined by the following priority (highest to lowest):

1. **Runtime environment variables** (`AI_BASE_URL`, `AI_API_KEY`)
2. **Build-time environment variables** (`VITE_DEFAULT_AI_SERVICE_BASE_URL`)
3. **Empty values** (if no environment variables are set, defaults to empty and requires manual user configuration)

## 🌍 Persistent Environment Variables

You can create a `.env` file for persistent configuration:

```env
# .env file
AI_BASE_URL=http://your-ai-server:9068/v1
AI_API_KEY=your-api-key
```

Then run normally:

```bash
npm run dev
npm run build
npm run preview
```

## 📝 Examples

### Example 1: Development with Custom Server

```bash
# Start development with a remote AI service
AI_BASE_URL=https://api.your-company.com/ai/v1 AI_API_KEY=sk-1234567890abcdef npm run dev
```

### Example 2: Build for Production

```bash
# Build for production deployment with specific AI service
AI_BASE_URL=https://ai-prod.your-company.com/v1 AI_API_KEY=sk-prod-key-here npm run build
```

### Example 3: Testing Different Services

```bash
# Test with service A
AI_BASE_URL=http://service-a:9068/v1 npm run dev

# Test with service B
AI_BASE_URL=http://service-b:8080/api/v1 AI_API_KEY=service-b-key npm run dev
```

## ⚠️ Important Notes

1. **Environment variables only affect the default values** in the Server Settings page. Users can still manually change these settings in the application.

2. **Environment variables are more secure** than command line arguments as they don't appear in process lists. For production deployments, use `.env` files or CI/CD environment variable features.

3. **These options only work for the web version**, not for the Electron desktop version.

4. **Settings persistence**: When users save settings in the application, those saved settings will override the environment variable defaults.

4. **Settings persistence**: When users save settings in the application, those saved settings will override the environment variable defaults.

## 🔒 Security Considerations

- Environment variables are more secure than command line arguments as they don't appear in system process lists
- Use `.env` files or CI/CD system environment variable features for sensitive data
- Consider using CI/CD pipeline secrets for automated deployments
- Avoid setting environment variables with sensitive information in shared environments

## 🚀 CI/CD Integration

For automated deployments, you can integrate these environment variables in your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Build Oji with custom settings
  run: |
    AI_BASE_URL=${{ secrets.AI_SERVICE_URL }} \
    AI_API_KEY=${{ secrets.AI_API_KEY }} \
    npm run build
  env:
    AI_BASE_URL: ${{ secrets.AI_SERVICE_URL }}
    AI_API_KEY: ${{ secrets.AI_API_KEY }}
```

```bash
# Docker build example
docker build \
  --build-arg AI_BASE_URL=https://ai.your-company.com/v1 \
  --build-arg AI_API_KEY=your-api-key \
  -t oji-web .
```
