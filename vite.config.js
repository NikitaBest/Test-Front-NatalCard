import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Загружаем переменные окружения
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000,
      host: mode === 'production' ? true : false,
    },
    preview: {
      port: 3000,
      host: mode === 'production' ? true : false,
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production',
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __DEBUG__: JSON.stringify(env.VITE_DEBUG === 'true'),
    }
  }
})
