import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 解析环境变量
// 用户可以通过环境变量传递配置：
// AI_BASE_URL=http://test:9068/v1 AI_API_KEY=test123 npm run dev
function getCliConfig() {
  return {
    baseUrl: process.env.AI_BASE_URL || '',
    apiKey: process.env.AI_API_KEY || ''
  }
}

const cliConfig = getCliConfig()

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 传递环境变量到前端应用
  const envDefines = {
    'import.meta.env.VITE_RUNTIME_AI_SERVICE_BASE_URL': JSON.stringify(cliConfig.baseUrl),
    'import.meta.env.VITE_RUNTIME_AI_API_KEY': JSON.stringify(cliConfig.apiKey)
  }

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/v1': 'http://localhost:9068',
      },
    },
    define: envDefines
  }
})
